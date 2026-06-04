import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  recalculateRankingForMatchBatch,
  recalculateRankingForPhaseBatch,
  recalculateRankingForRangeBatch,
} from "@/features/pronosticos/services/ranking-batch.service";

const RANKING_RECALCULATION_LOCK_ID = 20260526;

type RankingRecalculationSource = "cron" | "live-control";

type RankingRecalculationInput = {
  source: RankingRecalculationSource;
  triggeredByUserId?: string;
  partidoId?: string;
  faseId?: number;
  force?: boolean;
  fechaDesde?: Date;
  fechaHasta?: Date;
  soloNoCalculados?: boolean;
};

export type RankingRecalculationResult = {
  source: RankingRecalculationSource;
  triggeredByUserId: string | null;
  partidoId: string | null;
  force: boolean;
  fechaDesde: string | null;
  fechaHasta: string | null;
  soloNoCalculados: boolean;
  scope: "general" | "partido" | "fase";
  totalUsuariosRecalculados: number;
  totalPartidosConsiderados: number;
  totalPrediccionesProcesadas: number;
  executedAt: string;
};

async function acquireRankingRecalculationLock(tx: Prisma.TransactionClient) {
  const rows = await tx.$queryRaw<Array<{ locked: boolean }>>`
    SELECT pg_try_advisory_xact_lock(${RANKING_RECALCULATION_LOCK_ID}) AS locked
  `;

  return rows[0]?.locked === true;
}

function buildResult(
  input: RankingRecalculationInput,
  totals: {
    totalUsuariosRecalculados: number;
    totalPartidosConsiderados: number;
    totalPrediccionesProcesadas: number;
  },
): RankingRecalculationResult {
  return {
    source: input.source,
    triggeredByUserId: input.triggeredByUserId ?? null,
    partidoId: input.partidoId ?? null,
    force: Boolean(input.force),
    fechaDesde: input.fechaDesde?.toISOString() ?? null,
    fechaHasta: input.fechaHasta?.toISOString() ?? null,
    soloNoCalculados: Boolean(input.soloNoCalculados),
    scope: input.partidoId ? "partido" : input.faseId ? "fase" : "general",
    totalUsuariosRecalculados: totals.totalUsuariosRecalculados,
    totalPartidosConsiderados: totals.totalPartidosConsiderados,
    totalPrediccionesProcesadas: totals.totalPrediccionesProcesadas,
    executedAt: new Date().toISOString(),
  };
}

function logRankingRecalculation(
  stage: "start" | "success" | "error" | "locked",
  payload: Record<string, unknown>,
) {
  const prefix = `[ranking-recalculation:${stage}]`;

  if (stage === "error") {
    console.error(prefix, payload);
    return;
  }

  console.info(prefix, payload);
}

export async function recalculateRanking(
  input: RankingRecalculationInput,
): Promise<RankingRecalculationResult> {
  logRankingRecalculation("start", {
    source: input.source,
    triggeredByUserId: input.triggeredByUserId ?? null,
    partidoId: input.partidoId ?? null,
    faseId: input.faseId ?? null,
    force: Boolean(input.force),
    fechaDesde: input.fechaDesde?.toISOString() ?? null,
    fechaHasta: input.fechaHasta?.toISOString() ?? null,
    soloNoCalculados: Boolean(input.soloNoCalculados),
  });

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const lockAcquired = await acquireRankingRecalculationLock(tx);

        if (!lockAcquired) {
          throw new Error("RANKING_RECALCULATION_IN_PROGRESS");
        }

        if (input.partidoId) {
          const partialResult = await recalculateRankingForMatchBatch(tx, input.partidoId);

          return buildResult(input, {
            totalUsuariosRecalculados: partialResult.usuariosActualizados,
            totalPartidosConsiderados: partialResult.partidosProcesados,
            totalPrediccionesProcesadas: partialResult.prediccionesProcesadas,
          });
        }

        if (input.faseId) {
          const phaseResult = await recalculateRankingForPhaseBatch(tx, input.faseId);

          return buildResult(input, {
            totalUsuariosRecalculados: phaseResult.usuariosActualizados,
            totalPartidosConsiderados: phaseResult.partidosProcesados,
            totalPrediccionesProcesadas: phaseResult.prediccionesProcesadas,
          });
        }

        const generalResult = await recalculateRankingForRangeBatch(tx, {
          fechaDesde: input.fechaDesde,
          fechaHasta: input.fechaHasta,
          soloNoCalculados: input.soloNoCalculados,
        });

        return buildResult(input, {
          totalUsuariosRecalculados: generalResult.usuariosActualizados,
          totalPartidosConsiderados: generalResult.partidosProcesados,
          totalPrediccionesProcesadas: generalResult.prediccionesProcesadas,
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    logRankingRecalculation("success", result);
    return result;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RANKING_RECALCULATION_IN_PROGRESS"
    ) {
      logRankingRecalculation("locked", {
        source: input.source,
        triggeredByUserId: input.triggeredByUserId ?? null,
      });
    } else {
      logRankingRecalculation("error", {
        source: input.source,
        triggeredByUserId: input.triggeredByUserId ?? null,
        partidoId: input.partidoId ?? null,
        faseId: input.faseId ?? null,
        error: error instanceof Error ? error.message : error,
      });
    }

    throw error;
  }
}
