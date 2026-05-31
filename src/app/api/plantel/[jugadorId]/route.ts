import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  deleteJugadorSeleccion,
  getJugadorSeleccionById,
  updateJugadorSeleccion,
} from "@/features/partidos/services/partido.service";
import { jugadorSeleccionUpdateSchema } from "@/features/partidos/schemas/jugador-seleccion.schema";
import { normalizePlantelPositionCode } from "@/features/planteles/helpers/plantel-position.helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{
    jugadorId: string;
  }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { jugadorId } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "ver");

    const jugador = await getJugadorSeleccionById(jugadorId);

    if (!jugador) {
      return NextResponse.json({ message: "Jugador no encontrado." }, { status: 404 });
    }

    return NextResponse.json(jugador);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para ver el plantel." },
        { status: 403 }
      );
    }

    console.error("GET /api/plantel/[jugadorId] error:", err);

    return NextResponse.json(
      { message: "Error al obtener el jugador" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { jugadorId } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const body = await req.json();
    const dto = jugadorSeleccionUpdateSchema.parse({
      ...body,
      posicion:
        typeof body?.posicion === "string"
          ? normalizePlantelPositionCode(body.posicion)
          : body?.posicion,
    });
    const jugador = await updateJugadorSeleccion(jugadorId, dto);

    return NextResponse.json(jugador);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para editar el plantel." },
        { status: 403 }
      );
    }

    console.error("PUT /api/plantel/[jugadorId] error:", err);

    return NextResponse.json(
      { message: "Error al actualizar el jugador" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { jugadorId } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    await deleteJugadorSeleccion(jugadorId);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para editar el plantel." },
        { status: 403 }
      );
    }

    console.error("DELETE /api/plantel/[jugadorId] error:", err);

    return NextResponse.json(
      { message: "Error al eliminar el jugador" },
      { status: 400 }
    );
  }
}
