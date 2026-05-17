import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  getReglaCruceById,
  updateReglaCruce,
  deleteReglaCruce,
} from "@/features/partidos/services/reglas-cruce.service";
import {
  reglaCruceUpdateSchema,
} from "@/features/partidos/schemas/regla-cruce.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");
    const { id } = await params;

    const regla = await getReglaCruceById(id);
    if (!regla) {
      return NextResponse.json({ message: "Regla no encontrada" }, { status: 404 });
    }

    return NextResponse.json(regla);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver reglas." },
        { status: 403 }
      );
    }

    console.error("GET /api/reglas-cruces/[id] error:", err);
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
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");
    const { id } = await params;

    const body = await req.json();
    const dto = reglaCruceUpdateSchema.parse(body);

    const updated = await updateReglaCruce(id, {
      ...dto,
      faseId: dto.faseId ? Number(dto.faseId) : undefined,
      partidoNumero: dto.partidoNumero ? Number(dto.partidoNumero) : undefined,
      orden: dto.orden !== undefined ? Number(dto.orden) : undefined,
      fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      hora: dto.hora ?? undefined,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar reglas." },
        { status: 403 }
      );
    }

    console.error("PATCH /api/reglas-cruces/[id] error:", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");
    const { id } = await params;

    await deleteReglaCruce(id);

    return NextResponse.json({ message: "Regla eliminada" });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para eliminar reglas." },
        { status: 403 }
      );
    }

    console.error("DELETE /api/reglas-cruces/[id] error:", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
