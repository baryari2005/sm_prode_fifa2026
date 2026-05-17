import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { getPartidoById } from "@/features/partidos/services/partido.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const partidoId = id;

    const partido = await getPartidoById(partidoId);

    if (!partido) {
      return NextResponse.json(
        { message: "Partido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(partido);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver partidos." },
        { status: 403 }
      );
    }

    console.error("GET /api/partidos/[id] error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
