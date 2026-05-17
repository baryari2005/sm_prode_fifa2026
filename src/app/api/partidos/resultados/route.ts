import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  createResultado,
  updateResultado,
  getResultadoByPartidoId,
} from "@/features/partidos/services/partido.service";
import { resultadoCreateSchema, resultadoUpdateSchema } from "@/features/partidos/schemas/resultado.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const url = new URL(req.url);
    const partidoId = url.searchParams.get("partidoId");

    if (!partidoId) {
      return NextResponse.json(
        { message: "Se requiere el parámetro partidoId" },
        { status: 400 }
      );
    }

    const resultado = await getResultadoByPartidoId(partidoId);

    if (!resultado) {
      return NextResponse.json(
        { message: "Resultado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(resultado);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver resultados." },
        { status: 403 }
      );
    }

    console.error("GET /api/partidos/resultados error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "resultados", "crear");

    const body = await req.json();
    const dto = resultadoCreateSchema.parse(body);

    const resultado = await createResultado(dto);

    return NextResponse.json(resultado, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear resultados." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/resultados error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "resultados", "editar");

    const body = await req.json();
    const { partidoId, ...updateData } = body;

    if (!partidoId) {
      return NextResponse.json(
        { message: "Se requiere partidoId" },
        { status: 400 }
      );
    }

    const dto = resultadoUpdateSchema.parse(updateData);
    const resultado = await updateResultado(partidoId, dto);

    return NextResponse.json(resultado);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar resultados." },
        { status: 403 }
      );
    }

    console.error("PUT /api/partidos/resultados error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
