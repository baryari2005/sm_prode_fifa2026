import { NextRequest, NextResponse } from "next/server";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import { syncSingleMatchNow } from "@/features/live-control/services/live-control.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    await requireLiveControlAccess(req);
    const { id } = await ctx.params;
    const result = await syncSingleMatchNow(id);

    return NextResponse.json({
      message: result?.message ?? "Sincronización individual completada.",
      data: result,
    });
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

    console.error("POST /api/admin/live-control/matches/[id]/sync-now error:", err);
    return NextResponse.json({ message: "No se pudo sincronizar el partido." }, { status: 500 });
  }
}
