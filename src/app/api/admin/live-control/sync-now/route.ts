import { NextRequest, NextResponse } from "next/server";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import { syncLiveMatches } from "@/features/live-control/services/live-control.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    await requireLiveControlAccess(req);
    const result = await syncLiveMatches();

    return NextResponse.json({
      message: result.message,
      data: result.items,
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

    console.error("POST /api/admin/live-control/sync-now error:", err);
    return NextResponse.json({ message: "No se pudo sincronizar." }, { status: 500 });
  }
}
