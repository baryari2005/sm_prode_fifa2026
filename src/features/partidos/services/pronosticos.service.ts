import { AciertoTipo, Prisma } from "@prisma/client";

type ScoreResult = {
  puntosOtorgados: number;
  aciertoTipo: AciertoTipo;
};

function getResultadoClave(golesLocal: number, golesVisitante: number) {
  if (golesLocal > golesVisitante) return "LOCAL";
  if (golesLocal < golesVisitante) return "VISITANTE";
  return "EMPATE";
}

export function calcularPuntajePronostico(input: {
  prediccionLocal: number;
  prediccionVisitante: number;
  resultadoLocal: number;
  resultadoVisitante: number;
}): ScoreResult {
  const {
    prediccionLocal,
    prediccionVisitante,
    resultadoLocal,
    resultadoVisitante,
  } = input;

  const esExacto =
    prediccionLocal === resultadoLocal &&
    prediccionVisitante === resultadoVisitante;

  if (esExacto) {
    return {
      puntosOtorgados: 3,
      aciertoTipo: AciertoTipo.EXACTO,
    };
  }

  const resultadoPronosticado = getResultadoClave(
    prediccionLocal,
    prediccionVisitante
  );
  const resultadoReal = getResultadoClave(resultadoLocal, resultadoVisitante);

  if (resultadoPronosticado === resultadoReal) {
    return {
      puntosOtorgados: 1,
      aciertoTipo: AciertoTipo.TENDENCIA,
    };
  }

  return {
    puntosOtorgados: 0,
    aciertoTipo: AciertoTipo.NINGUNO,
  };
}

async function recomputarRankingUsuarios(
  tx: Prisma.TransactionClient,
  usuarioIds: string[]
) {
  const uniqueUserIds = Array.from(new Set(usuarioIds.filter(Boolean)));

  for (const usuarioId of uniqueUserIds) {
    const [predicciones, exactos, tendencias, puntos] = await Promise.all([
      tx.prediccionPartido.count({
        where: { usuarioId },
      }),
      tx.prediccionPartido.count({
        where: {
          usuarioId,
          aciertoTipo: AciertoTipo.EXACTO,
        },
      }),
      tx.prediccionPartido.count({
        where: {
          usuarioId,
          aciertoTipo: AciertoTipo.TENDENCIA,
        },
      }),
      tx.prediccionPartido.aggregate({
        where: { usuarioId },
        _sum: {
          puntosOtorgados: true,
        },
      }),
    ]);

    const calificadas = await tx.prediccionPartido.count({
      where: {
        usuarioId,
        calculadoAt: {
          not: null,
        },
      },
    });

    await tx.rankingUsuario.upsert({
      where: { usuarioId },
      create: {
        usuarioId,
        puntosTotales: puntos._sum.puntosOtorgados ?? 0,
        aciertosExactos: exactos,
        aciertosTendencia: tendencias,
        partidosPronosticados: predicciones,
        partidosCalificados: calificadas,
      },
      update: {
        puntosTotales: puntos._sum.puntosOtorgados ?? 0,
        aciertosExactos: exactos,
        aciertosTendencia: tendencias,
        partidosPronosticados: predicciones,
        partidosCalificados: calificadas,
      },
    });
  }
}

export async function recalcularPronosticosDePartido(
  tx: Prisma.TransactionClient,
  partidoId: string
) {
  const partido = await tx.partido.findUnique({
    where: { id: partidoId },
    include: {
      resultado: true,
      predicciones: true,
    },
  });

  if (!partido?.resultado || partido.resultado.estado !== "FINALIZADO") {
    return {
      partidoId,
      procesadas: 0,
      usuariosActualizados: 0,
    };
  }

  const usuarioIds: string[] = [];

  for (const prediccion of partido.predicciones) {
    const score = calcularPuntajePronostico({
      prediccionLocal: prediccion.golesLocal,
      prediccionVisitante: prediccion.golesVisitante,
      resultadoLocal: partido.resultado.golesLocal,
      resultadoVisitante: partido.resultado.golesVisitante,
    });

    await tx.prediccionPartido.update({
      where: { id: prediccion.id },
      data: {
        puntosOtorgados: score.puntosOtorgados,
        aciertoTipo: score.aciertoTipo,
        calculadoAt: new Date(),
      },
    });

    usuarioIds.push(prediccion.usuarioId);
  }

  await recomputarRankingUsuarios(tx, usuarioIds);

  return {
    partidoId,
    procesadas: partido.predicciones.length,
    usuariosActualizados: Array.from(new Set(usuarioIds)).length,
  };
}
