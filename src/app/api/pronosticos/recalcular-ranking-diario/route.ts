import { NextRequest, NextResponse } from "next/server";

import { requireAuth, requirePermission } from "@/lib/server-auth";
import { recalculateRanking } from "@/features/pronosticos/services/ranking-recalculation.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const incomingCronSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  if (
    cronSecret &&
    (incomingCronSecret === cronSecret || authHeader === `Bearer ${cronSecret}`)
  ) {
    return;
  }

  const loggedInUser = await requireAuth(req);
  requirePermission(loggedInUser, "resultados", "editar");
}

function resolveDailyRange(req: NextRequest) {
  const url = new URL(req.url);
  const forceAll = url.searchParams.get("all") === "1";
  const onlyPending = url.searchParams.get("onlyPending") !== "0";

  if (forceAll) {
    return {
      fechaDesde: undefined,
      fechaHasta: undefined,
      onlyPending,
      label: "todos los partidos finalizados",
    };
  }

  const now = new Date();
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 1);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    fechaDesde: start,
    fechaHasta: end,
    onlyPending,
    label: `partidos finalizados entre ${start.toISOString()} y ${end.toISOString()}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    await authorize(req);

    const range = resolveDailyRange(req);

    const result = await recalculateRanking({
      source: "cron",
      fechaDesde: range.fechaDesde,
      fechaHasta: range.fechaHasta,
      soloNoCalculados: range.onlyPending,
      force: !range.onlyPending,
    });

    return NextResponse.json({
      message: `Recalculo diario completado para ${range.label}. ${result.totalPartidosConsiderados} partidos, ${result.totalPrediccionesProcesadas} predicciones y ${result.totalUsuariosRecalculados} usuarios actualizados.`,
      meta: {
        fechaDesde: range.fechaDesde?.toISOString() ?? null,
        fechaHasta: range.fechaHasta?.toISOString() ?? null,
        soloNoCalculados: range.onlyPending,
        partidosProcesados: result.totalPartidosConsiderados,
        prediccionesProcesadas: result.totalPrediccionesProcesadas,
        usuariosActualizados: result.totalUsuariosRecalculados,
        source: result.source,
        executedAt: result.executedAt,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para recalcular ranking." },
        { status: 403 },
      );
    }

    if (
      err instanceof Error &&
      err.message === "RANKING_RECALCULATION_IN_PROGRESS"
    ) {
      return NextResponse.json(
        { message: "Ya hay un recalculo de ranking en curso." },
        { status: 409 },
      );
    }

    console.error("POST /api/pronosticos/recalcular-ranking-diario error:", err);

    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
