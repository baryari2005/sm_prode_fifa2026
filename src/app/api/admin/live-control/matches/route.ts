import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireLiveControlAccess } from "@/features/live-control/helpers/live-control-permissions";
import { listLiveControlMatches } from "@/features/live-control/services/live-control.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await requireLiveControlAccess(req);
    const matches = await listLiveControlMatches();

    return NextResponse.json(
      { data: matches },
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

    if (
      err instanceof Error &&
      (err.message === "FORBIDDEN" || err.message === "LIVE_CONTROL_FORBIDDEN")
    ) {
      return NextResponse.json({ message: "Acceso denegado." }, { status: 403 });
    }

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2021" || err.code === "P2022")
    ) {
      return NextResponse.json(
        {
          message:
            "La base no tiene todavia toda la infraestructura de Live Control. Ejecuta la migracion de Prisma para habilitar eventos y auditoria.",
        },
        { status: 500 },
      );
    }

    console.error("GET /api/admin/live-control/matches error:", err);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
