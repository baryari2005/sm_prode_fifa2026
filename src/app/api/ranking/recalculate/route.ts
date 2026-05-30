import { NextRequest, NextResponse } from "next/server";

import { recalculateRanking } from "@/features/pronosticos/services/ranking-recalculation.service";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    requirePermission(user, "ranking", "recalcular");

    const result = await recalculateRanking({
      source: "live-control",
      triggeredByUserId: user.id,
      force: true,
      soloNoCalculados: false,
    });

    return NextResponse.json(
      {
        message: "Ranking recalculado correctamente",
        data: {
          source: result.source,
          totalUsuariosRecalculados: result.totalUsuariosRecalculados,
          totalPartidosConsiderados: result.totalPartidosConsiderados,
          totalPrediccionesProcesadas: result.totalPrediccionesProcesadas,
          executedAt: result.executedAt,
          triggeredByUserId: result.triggeredByUserId,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Acceso denegado." }, { status: 403 });
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

    console.error("POST /api/ranking/recalculate error:", err);

    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
