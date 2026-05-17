import { NextRequest, NextResponse } from "next/server";

import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  getPartidoById,
  getPreviousLineupForSelection,
} from "@/features/partidos/services/partido.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const partido = await getPartidoById(id);

    if (!partido) {
      return NextResponse.json(
        { message: "Partido no encontrado" },
        { status: 404 }
      );
    }

    const [localPrevious, visitantePrevious] = await Promise.all([
      getPreviousLineupForSelection(id, partido.seleccionLocalId),
      getPreviousLineupForSelection(id, partido.seleccionVisitanteId),
    ]);

    return NextResponse.json({
      local: localPrevious,
      visitante: visitantePrevious,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver formaciones." },
        { status: 403 }
      );
    }

    console.error("GET /api/partidos/[id]/formaciones-base error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
