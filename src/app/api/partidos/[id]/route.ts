import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { getPartidoById, updatePartido } from "@/features/partidos/services/partido.service";

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

    requirePermission(loggedInUser, "partidos", "ver_detalle");

    const partido = await getPartidoById(id);

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
        { message: "No tenés permisos para ver el detalle del partido." },
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

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "editar");

    const body = await req.json() as {
      fecha?: string | null;
      estadio?: string | null;
      ciudad?: string | null;
    };

    const data = {
      ...(Object.prototype.hasOwnProperty.call(body, "fecha")
        ? { fecha: body.fecha ? new Date(body.fecha) : undefined }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(body, "estadio")
        ? { estadio: body.estadio?.trim() ? body.estadio.trim() : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(body, "ciudad")
        ? { ciudad: body.ciudad?.trim() ? body.ciudad.trim() : null }
        : {}),
    };

    const partido = await updatePartido(id, data);

    return NextResponse.json(partido, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
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
        { message: "No tenes permisos para editar el partido." },
        { status: 403 },
      );
    }

    console.error("PATCH /api/partidos/[id] error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
