import { NextRequest, NextResponse } from "next/server";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import { liveStatusSchema } from "@/features/live-control/schemas/live-control.schemas";
import { updateLiveMatchStatus } from "@/features/live-control/services/live-control.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await requireLiveControlAccess(req);
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = liveStatusSchema.parse(body);

    await updateLiveMatchStatus({
      partidoId: id,
      estado: parsed.estado,
      minuto: parsed.minuto,
      observacion: parsed.observacion,
      userId: user.id,
    });

    return NextResponse.json({ message: "Estado live actualizado correctamente." });
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

    console.error("PATCH /api/admin/live-control/matches/[id]/status error:", err);
    return NextResponse.json({ message: "No se pudo actualizar el estado." }, { status: 500 });
  }
}
