import { Prisma } from "@prisma/client";

type RankingBatchInput = {
  fechaDesde?: Date;
  fechaHasta?: Date;
  soloNoCalculados?: boolean;
};

type RankingBatchResult = {
  partidosProcesados: number;
  prediccionesProcesadas: number;
  usuariosActualizados: number;
};

type MatchSummary = {
  id: string;
  faseId: number;
};

function buildUuidList(ids: string[]) {
  return Prisma.join(ids.map((id) => Prisma.sql`${id}::uuid`));
}

function buildIntList(ids: number[]) {
  return Prisma.join(ids.map((id) => Prisma.sql`${id}`));
}

async function rebuildGlobalRankingForAffectedUsers(
  tx: Prisma.TransactionClient,
  matchIds: string[],
) {
  const matchIdsSql = buildUuidList(matchIds);

  await tx.$executeRaw`
    DELETE FROM "RankingUsuario"
    WHERE "usuarioId" IN (
      SELECT DISTINCT pp."usuarioId"
      FROM "PrediccionPartido" pp
      WHERE pp."partidoId" IN (${matchIdsSql})
    )
  `;

  await tx.$executeRaw`
    INSERT INTO "RankingUsuario" (
      "id",
      "usuarioId",
      "puntosTotales",
      "aciertosExactos",
      "aciertosTendencia",
      "partidosPronosticados",
      "partidosCalificados",
      "createdAt",
      "updatedAt"
    )
    SELECT
      gen_random_uuid(),
      pp."usuarioId",
      COALESCE(SUM(pp."puntosOtorgados"), 0)::int,
      COUNT(*) FILTER (
        WHERE pp."aciertoTipo" = CAST('EXACTO' AS "AciertoTipo")
      )::int,
      COUNT(*) FILTER (
        WHERE pp."aciertoTipo" = CAST('TENDENCIA' AS "AciertoTipo")
      )::int,
      COUNT(*)::int,
      COUNT(*) FILTER (
        WHERE pp."calculadoAt" IS NOT NULL
      )::int,
      NOW(),
      NOW()
    FROM "PrediccionPartido" pp
    WHERE pp."usuarioId" IN (
      SELECT DISTINCT pp2."usuarioId"
      FROM "PrediccionPartido" pp2
      WHERE pp2."partidoId" IN (${matchIdsSql})
    )
    GROUP BY pp."usuarioId"
    ON CONFLICT ("usuarioId") DO UPDATE
    SET
      "puntosTotales" = EXCLUDED."puntosTotales",
      "aciertosExactos" = EXCLUDED."aciertosExactos",
      "aciertosTendencia" = EXCLUDED."aciertosTendencia",
      "partidosPronosticados" = EXCLUDED."partidosPronosticados",
      "partidosCalificados" = EXCLUDED."partidosCalificados",
      "updatedAt" = NOW()
  `;
}

async function rebuildPhaseRankingForAffectedScope(
  tx: Prisma.TransactionClient,
  matchIds: string[],
  phaseIds: number[],
) {
  const matchIdsSql = buildUuidList(matchIds);
  const affectedUsersSql = Prisma.sql`
    SELECT DISTINCT pp."usuarioId"
    FROM "PrediccionPartido" pp
    WHERE pp."partidoId" IN (${matchIdsSql})
  `;

  const phaseContext = await tx.fase.findMany({
    select: {
      id: true,
      orden: true,
    },
    orderBy: {
      orden: "asc",
    },
  });

  if (phaseContext.length === 0) {
    return;
  }

  const groupPhase = phaseContext[0];
  const knockoutPhases = phaseContext.filter((phase) => phase.orden > groupPhase.orden);
  const affectedPhaseSet = new Set(phaseIds);
  const includesGroupPhase = affectedPhaseSet.has(groupPhase.id);
  const affectedKnockoutPhases = knockoutPhases.filter((phase) => affectedPhaseSet.has(phase.id));

  const targetPhaseIds = new Set<number>();

  if (includesGroupPhase) {
    targetPhaseIds.add(groupPhase.id);
  }

  if (affectedKnockoutPhases.length > 0) {
    const earliestAffectedKnockoutOrder = Math.min(
      ...affectedKnockoutPhases.map((phase) => phase.orden),
    );

    knockoutPhases
      .filter((phase) => phase.orden >= earliestAffectedKnockoutOrder)
      .forEach((phase) => targetPhaseIds.add(phase.id));
  }

  if (targetPhaseIds.size === 0) {
    return;
  }

  const targetPhaseIdsList = Array.from(targetPhaseIds);
  const targetPhaseIdsSql = buildIntList(targetPhaseIdsList);

  const knockoutPhaseValues = knockoutPhases.map(
    (phase) => Prisma.sql`(${phase.id}, ${phase.orden})`,
  );
  const knockoutPhaseRowsSql = Prisma.join(knockoutPhaseValues);

  await tx.$executeRaw`
    DELETE FROM "RankingUsuarioFase"
    WHERE "faseId" IN (${targetPhaseIdsSql})
      AND "usuarioId" IN (${affectedUsersSql})
  `;

  if (includesGroupPhase) {
    await tx.$executeRaw`
      INSERT INTO "RankingUsuarioFase" (
        "id",
        "usuarioId",
        "faseId",
        "puntosTotales",
        "aciertosExactos",
        "aciertosTendencia",
        "partidosPronosticados",
        "partidosCalificados",
        "createdAt",
        "updatedAt"
      )
      SELECT
        gen_random_uuid(),
        pp."usuarioId",
        ${groupPhase.id},
        COALESCE(SUM(pp."puntosOtorgados"), 0)::int,
        COUNT(*) FILTER (
          WHERE pp."aciertoTipo" = CAST('EXACTO' AS "AciertoTipo")
        )::int,
        COUNT(*) FILTER (
          WHERE pp."aciertoTipo" = CAST('TENDENCIA' AS "AciertoTipo")
        )::int,
        COUNT(*)::int,
        COUNT(*) FILTER (
          WHERE pp."calculadoAt" IS NOT NULL
        )::int,
        NOW(),
        NOW()
      FROM "PrediccionPartido" pp
      INNER JOIN "Partido" p
        ON p."id" = pp."partidoId"
      WHERE p."faseId" = ${groupPhase.id}
        AND pp."usuarioId" IN (${affectedUsersSql})
      GROUP BY pp."usuarioId"
      ON CONFLICT ("usuarioId", "faseId") DO UPDATE
      SET
        "puntosTotales" = EXCLUDED."puntosTotales",
        "aciertosExactos" = EXCLUDED."aciertosExactos",
        "aciertosTendencia" = EXCLUDED."aciertosTendencia",
        "partidosPronosticados" = EXCLUDED."partidosPronosticados",
        "partidosCalificados" = EXCLUDED."partidosCalificados",
        "updatedAt" = NOW()
    `;
  }

  if (targetPhaseIdsList.some((phaseId) => phaseId !== groupPhase.id) && knockoutPhaseValues.length > 0) {
    await tx.$executeRaw`
      WITH knockout_targets AS (
        SELECT *
        FROM (VALUES ${knockoutPhaseRowsSql}) AS kt("faseId", "orden")
        WHERE kt."faseId" IN (${targetPhaseIdsSql})
      ),
      knockout_sources AS (
        SELECT *
        FROM (VALUES ${knockoutPhaseRowsSql}) AS ks("faseId", "orden")
      )
      INSERT INTO "RankingUsuarioFase" (
        "id",
        "usuarioId",
        "faseId",
        "puntosTotales",
        "aciertosExactos",
        "aciertosTendencia",
        "partidosPronosticados",
        "partidosCalificados",
        "createdAt",
        "updatedAt"
      )
      SELECT
        gen_random_uuid(),
        pp."usuarioId",
        kt."faseId",
        COALESCE(SUM(pp."puntosOtorgados"), 0)::int,
        COUNT(*) FILTER (
          WHERE pp."aciertoTipo" = CAST('EXACTO' AS "AciertoTipo")
        )::int,
        COUNT(*) FILTER (
          WHERE pp."aciertoTipo" = CAST('TENDENCIA' AS "AciertoTipo")
        )::int,
        COUNT(*)::int,
        COUNT(*) FILTER (
          WHERE pp."calculadoAt" IS NOT NULL
        )::int,
        NOW(),
        NOW()
      FROM knockout_targets kt
      INNER JOIN knockout_sources ks
        ON ks."orden" <= kt."orden"
      INNER JOIN "Partido" p
        ON p."faseId" = ks."faseId"
      INNER JOIN "PrediccionPartido" pp
        ON pp."partidoId" = p."id"
      WHERE pp."usuarioId" IN (${affectedUsersSql})
      GROUP BY pp."usuarioId", kt."faseId"
      ON CONFLICT ("usuarioId", "faseId") DO UPDATE
      SET
        "puntosTotales" = EXCLUDED."puntosTotales",
        "aciertosExactos" = EXCLUDED."aciertosExactos",
        "aciertosTendencia" = EXCLUDED."aciertosTendencia",
        "partidosPronosticados" = EXCLUDED."partidosPronosticados",
        "partidosCalificados" = EXCLUDED."partidosCalificados",
        "updatedAt" = NOW()
    `;
  }
}

async function recalculatePredictionsForMatches(
  tx: Prisma.TransactionClient,
  matchIds: string[],
) {
  const matchIdsSql = buildUuidList(matchIds);

  await tx.$executeRaw`
    UPDATE "PrediccionPartido" AS pp
    SET
      "puntosOtorgados" = CASE
        WHEN pp."golesLocal" = r."golesLocal"
          AND pp."golesVisitante" = r."golesVisitante"
          THEN COALESCE(rp."puntosExacto", 3)
        WHEN (
          CASE
            WHEN pp."golesLocal" > pp."golesVisitante" THEN 'LOCAL'
            WHEN pp."golesLocal" < pp."golesVisitante" THEN 'VISITANTE'
            ELSE 'EMPATE'
          END
        ) = (
          CASE
            WHEN r."golesLocal" > r."golesVisitante" THEN 'LOCAL'
            WHEN r."golesLocal" < r."golesVisitante" THEN 'VISITANTE'
            ELSE 'EMPATE'
          END
        ) THEN COALESCE(rp."puntosParcial", 1)
        ELSE COALESCE(rp."puntosSinAcierto", 0)
      END,
      "aciertoTipo" = CASE
        WHEN pp."golesLocal" = r."golesLocal"
          AND pp."golesVisitante" = r."golesVisitante"
          THEN CAST('EXACTO' AS "AciertoTipo")
        WHEN (
          CASE
            WHEN pp."golesLocal" > pp."golesVisitante" THEN 'LOCAL'
            WHEN pp."golesLocal" < pp."golesVisitante" THEN 'VISITANTE'
            ELSE 'EMPATE'
          END
        ) = (
          CASE
            WHEN r."golesLocal" > r."golesVisitante" THEN 'LOCAL'
            WHEN r."golesLocal" < r."golesVisitante" THEN 'VISITANTE'
            ELSE 'EMPATE'
          END
        ) THEN CAST('TENDENCIA' AS "AciertoTipo")
        ELSE CAST('NINGUNO' AS "AciertoTipo")
      END,
      "calculadoAt" = NOW(),
      "updatedAt" = NOW()
    FROM "Partido" p
    INNER JOIN "Resultado" r
      ON r."partidoId" = p."id"
      AND r."estado" = CAST('FINALIZADO' AS "EstadoPartido")
    LEFT JOIN "ReglaPuntaje" rp
      ON rp."faseId" = p."faseId"
      AND rp."activo" = true
    WHERE pp."partidoId" = p."id"
      AND p."id" IN (${matchIdsSql})
  `;
}

async function getAffectedUsersCount(
  tx: Prisma.TransactionClient,
  matchIds: string[],
) {
  const matchIdsSql = buildUuidList(matchIds);
  const rows = await tx.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT pp."usuarioId") AS count
    FROM "PrediccionPartido" pp
    WHERE pp."partidoId" IN (${matchIdsSql})
  `;

  return Number(rows[0]?.count ?? 0);
}

async function getPredictionsCount(
  tx: Prisma.TransactionClient,
  matchIds: string[],
) {
  const matchIdsSql = buildUuidList(matchIds);
  const rows = await tx.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) AS count
    FROM "PrediccionPartido" pp
    WHERE pp."partidoId" IN (${matchIdsSql})
  `;

  return Number(rows[0]?.count ?? 0);
}

async function processMatchesBatch(
  tx: Prisma.TransactionClient,
  matches: MatchSummary[],
): Promise<RankingBatchResult> {
  if (matches.length === 0) {
    return {
      partidosProcesados: 0,
      prediccionesProcesadas: 0,
      usuariosActualizados: 0,
    };
  }

  const matchIds = matches.map((match) => match.id);
  const phaseIds = Array.from(new Set(matches.map((match) => match.faseId)));

  const [prediccionesProcesadas, usuariosActualizados] = await Promise.all([
    getPredictionsCount(tx, matchIds),
    getAffectedUsersCount(tx, matchIds),
  ]);

  await recalculatePredictionsForMatches(tx, matchIds);
  await rebuildPhaseRankingForAffectedScope(tx, matchIds, phaseIds);
  await rebuildGlobalRankingForAffectedUsers(tx, matchIds);

  return {
    partidosProcesados: matches.length,
    prediccionesProcesadas,
    usuariosActualizados,
  };
}

export async function recalculateRankingForPhaseBatch(
  tx: Prisma.TransactionClient,
  faseId: number,
) {
  const matches = await tx.partido.findMany({
    where: {
      activo: true,
      faseId,
      resultado: {
        is: {
          estado: "FINALIZADO",
        },
      },
    },
    select: {
      id: true,
      faseId: true,
    },
  });

  return processMatchesBatch(tx, matches);
}

export async function recalculateRankingForMatchBatch(
  tx: Prisma.TransactionClient,
  partidoId: string,
) {
  const match = await tx.partido.findFirst({
    where: {
      id: partidoId,
      activo: true,
      resultado: {
        is: {
          estado: "FINALIZADO",
        },
      },
    },
    select: {
      id: true,
      faseId: true,
    },
  });

  return processMatchesBatch(tx, match ? [match] : []);
}

export async function recalculateRankingForRangeBatch(
  tx: Prisma.TransactionClient,
  input?: RankingBatchInput,
) {
  const matches = await tx.partido.findMany({
    where: {
      activo: true,
      ...(input?.fechaDesde || input?.fechaHasta
        ? {
            fecha: {
              ...(input?.fechaDesde ? { gte: input.fechaDesde } : {}),
              ...(input?.fechaHasta ? { lte: input.fechaHasta } : {}),
            },
          }
        : {}),
      resultado: {
        is: {
          estado: "FINALIZADO",
        },
      },
      ...(input?.soloNoCalculados
        ? {
            predicciones: {
              some: {
                calculadoAt: null,
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      faseId: true,
    },
    orderBy: {
      fecha: "asc",
    },
  });

  return processMatchesBatch(tx, matches);
}
