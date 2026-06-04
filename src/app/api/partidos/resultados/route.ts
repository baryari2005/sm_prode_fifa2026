import { NextRequest, NextResponse } from "next/server";

import { requireAuth, requirePermission } from "@/lib/server-auth";
import {
  createResultado,
  getPartidoById,
  getResultadoByPartidoId,
  updateResultado,
} from "@/features/partidos/services/partido.service";
import { recalculateRanking } from "@/features/pronosticos/services/ranking-recalculation.service";
import {
  resultadoCreateSchema,
  resultadoUpdateSchema,
} from "@/features/partidos/schemas/resultado.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureResultadoEditable(partidoId: string) {
  const [partido, resultado] = await Promise.all([
    getPartidoById(partidoId),
    getResultadoByPartidoId(partidoId),
  ]);

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  if (resultado?.estado === "FINALIZADO") {
    throw new Error("RESULTADO_FINAL_LOCKED");
  }
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver_detalle");

    const url = new URL(req.url);
    const partidoId = url.searchParams.get("partidoId");

    if (!partidoId) {
      return NextResponse.json(
        { message: "Se requiere el parametro partidoId" },
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
        { message: "No autorizado. Debes iniciar sesion." },
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

    await ensureResultadoEditable(dto.partidoId);

    const resultado = await createResultado(dto);

    if (resultado.estado === "FINALIZADO") {
      await recalculateRanking({
        source: "live-control",
        triggeredByUserId: loggedInUser.id,
        partidoId: dto.partidoId,
        force: true,
        soloNoCalculados: false,
      });
    }

    return NextResponse.json(resultado, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear resultados." },
        { status: 403 }
      );
    }

    if (err instanceof Error && err.message === "PARTIDO_NOT_FOUND") {
      return NextResponse.json(
        { message: "Partido no encontrado." },
        { status: 404 }
      );
    }

    if (err instanceof Error && err.message === "RESULTADO_FINAL_LOCKED") {
      return NextResponse.json(
        {
          message:
            "No se puede modificar el resultado porque el partido esta finalizado.",
        },
        { status: 409 }
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
    const { partidoId, ...updateData } = body as {
      partidoId?: string;
      [key: string]: unknown;
    };

    if (!partidoId) {
      return NextResponse.json(
        { message: "Se requiere partidoId" },
        { status: 400 }
      );
    }

    const dto = resultadoUpdateSchema.parse(updateData);

    await ensureResultadoEditable(partidoId);

    const resultado = await updateResultado(partidoId, dto);

    if (resultado.estado === "FINALIZADO") {
      await recalculateRanking({
        source: "live-control",
        triggeredByUserId: loggedInUser.id,
        partidoId,
        force: true,
        soloNoCalculados: false,
      });
    }

    return NextResponse.json(resultado);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para editar resultados." },
        { status: 403 }
      );
    }

    if (err instanceof Error && err.message === "PARTIDO_NOT_FOUND") {
      return NextResponse.json(
        { message: "Partido no encontrado." },
        { status: 404 }
      );
    }

    if (err instanceof Error && err.message === "RESULTADO_FINAL_LOCKED") {
      return NextResponse.json(
        {
          message:
            "No se puede modificar el resultado porque el partido esta finalizado.",
        },
        { status: 409 }
      );
    }

    console.error("PUT /api/partidos/resultados error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
