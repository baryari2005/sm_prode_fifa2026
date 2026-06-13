import { NextRequest, NextResponse } from "next/server";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import { manualGoalSchema } from "@/features/live-control/schemas/live-control.schemas";
import { createManualGoal } from "@/features/live-control/services/live-control.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await requireLiveControlAccess(req);
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = manualGoalSchema.parse(body);

    const event = await createManualGoal({
      partidoId: id,
      team: parsed.team,
      minute: parsed.minute,
      playerId: parsed.playerId,
      ownGoal: parsed.ownGoal,
      description: parsed.description,
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Gol manual cargado correctamente.", data: event },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (
      err instanceof Error &&
      (err.message === "FORBIDDEN" || err.message === "LIVE_CONTROL_FORBIDDEN")
    ) {
      return NextResponse.json({ message: "Acceso denegado." }, { status: 403 });
    }

    if (err instanceof Error && err.message === "PARTIDO_NOT_FOUND") {
      return NextResponse.json({ message: "Partido no encontrado." }, { status: 404 });
    }

    console.error("POST /api/admin/live-control/matches/[id]/goal error:", err);
    return NextResponse.json({ message: "No se pudo cargar el gol manual." }, { status: 500 });
  }
}
