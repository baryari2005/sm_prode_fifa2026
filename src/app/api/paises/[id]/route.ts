import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { paisUpdateSchema } from "@/features/paises/schemas/paises.schema";
import {
  getPaisById,
  updatePais,
  deletePais,
  activatePais,
  handlePaisError,
} from "@/features/paises/services/paises.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "ver");

    const pais = await getPaisById(id);

    if (!pais) {
      return NextResponse.json(
        { message: "Selección no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(pais);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver selecciones." },
        { status: 403 }
      );
    }

    console.error(`GET /api/paises/${id} error:`, err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const body = await req.json();
    const dto = paisUpdateSchema.parse(body);

    // Transform null to undefined for optional fields
    const transformedDto = {
      ...dto,
      footballDataTeamId: dto.footballDataTeamId ?? undefined,
      bandera: dto.bandera ?? undefined,
      grupo: dto.grupo ?? undefined,
      confederacion: dto.confederacion ?? undefined,
    };

    const pais = await updatePais(id, transformedDto);

    return NextResponse.json(pais);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar selecciones." },
        { status: 403 }
      );
    }

    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { message: "Datos inválidos", errors: err },
        { status: 400 }
      );
    }

    const { message, status } = handlePaisError(err);

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "eliminar");

    await deletePais(id);

    return NextResponse.json({ message: "País eliminado correctamente" });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para eliminar selecciones." },
        { status: 403 }
      );
    }

    console.error(`DELETE /api/paises/${id} error:`, err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const body = await req.json();
    const { action } = body;

    if (action === "activate") {
      const pais = await activatePais(id);
      return NextResponse.json(pais);
    }

    return NextResponse.json(
      { message: "Acción no reconocida" },
      { status: 400 }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar selecciones." },
        { status: 403 }
      );
    }

    console.error(`POST /api/paises/${id} error:`, err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
