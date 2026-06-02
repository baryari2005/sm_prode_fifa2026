import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  createJugadorSeleccion,
  listJugadoresBySeleccionId,
  listJugadoresBySeleccionIdPaginated,
} from "@/features/partidos/services/partido.service";
import { jugadorSeleccionCreateSchema } from "@/features/partidos/schemas/jugador-seleccion.schema";
import { normalizePlantelPositionCode } from "@/features/planteles/helpers/plantel-position.helpers";

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
    requirePermission(loggedInUser, "paises", "ver");
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") ?? searchParams.get("search") ?? undefined;
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(
      searchParams.get("pageSize") ?? searchParams.get("limit") ?? 10
    );
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const rawSortDir = searchParams.get("sortDir");
    const sortDir = rawSortDir === "desc" ? "desc" : "asc";

    const wantsPaginated =
      searchParams.has("page") ||
      searchParams.has("pageSize") ||
      searchParams.has("limit") ||
      searchParams.has("sortBy") ||
      searchParams.has("sortDir") ||
      Boolean(search?.trim());

    if (wantsPaginated) {
      const result = await listJugadoresBySeleccionIdPaginated({
        seleccionId: id,
        search,
        page,
        pageSize,
        sortBy,
        sortDir,
      });

      return NextResponse.json({
        data: result.items,
        meta: {
          total: result.total,
          pageCount: result.pageCount,
          page,
          pageSize,
        },
      });
    }

    const items = await listJugadoresBySeleccionId(id);
    return NextResponse.json({ data: items });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver el plantel." },
        { status: 403 }
      );
    }

    console.error("GET /api/paises/[id]/plantel error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const body = await req.json();
    const dto = jugadorSeleccionCreateSchema.parse({
      ...body,
      seleccionId: id,
      posicion: normalizePlantelPositionCode(body?.posicion),
    });

    const jugador = await createJugadorSeleccion(dto);

    return NextResponse.json(jugador, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar el plantel." },
        { status: 403 }
      );
    }

    console.error("POST /api/paises/[id]/plantel error:", err);

    return NextResponse.json(
      { message: "Error al crear el jugador" },
      { status: 400 }
    );
  }
}
