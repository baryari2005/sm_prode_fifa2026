import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { replaceJugadoresSeleccion } from "@/features/partidos/services/partido.service";
import { jugadorSeleccionCreateSchema } from "@/features/partidos/schemas/jugador-seleccion.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const body = (await req.json()) as { items?: unknown[] };
    const items = Array.isArray(body.items) ? body.items : [];

    const normalizedItems = [];
    for (const item of items) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const dto = jugadorSeleccionCreateSchema.parse({
        ...item,
        seleccionId: id,
      });
      normalizedItems.push(dto);
    }

    const { cleared, created } = await replaceJugadoresSeleccion(id, normalizedItems);

    return NextResponse.json(
      {
        data: created,
        total: created.length,
        meta: {
          cleared,
          imported: created.length,
          seleccionId: id,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "No tenes permisos para importar plantel." }, { status: 403 });
    }

    console.error("POST /api/paises/[id]/plantel/import error:", err);
    return NextResponse.json({ message: "Error al importar plantel" }, { status: 400 });
  }
}
