import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EstadoPartido } from "@prisma/client";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";
import { isKnockoutPhaseName } from "@/features/partidos/utils/partidos-ui.helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pronosticoSchema = z.object({
  partidoId: z.string().uuid(),
  golesLocal: z.coerce.number().int().min(0),
  golesVisitante: z.coerce.number().int().min(0),
  equipoClasificadoId: z.string().uuid().nullable().optional(),
});

function isPredictionClosed(fecha: Date, minutesBefore = 60) {
  const closeTime = fecha.getTime() - minutesBefore * 60 * 1000;
  return Date.now() >= closeTime;
}

function isPredictionBlockedByMatchState(
  resultado: { estado: EstadoPartido } | null
) {
  if (!resultado) return false;

  return resultado.estado !== EstadoPartido.PENDIENTE;
}

function resolveEquipoClasificadoId(params: {
  golesLocal: number;
  golesVisitante: number;
  equipoClasificadoId?: string | null;
  faseNombre?: string | null;
  seleccionLocalId: string;
  seleccionVisitanteId: string;
}): { equipoClasificadoId: string | null } | { error: string } {
  const requiereClasificado =
    isKnockoutPhaseName(params.faseNombre) &&
    params.golesLocal === params.golesVisitante;

  if (!requiereClasificado) return { equipoClasificadoId: null };

  if (!params.equipoClasificadoId) {
    return {
      error:
        "Debes seleccionar quien pasa por penales para pronosticar un empate en eliminatorias.",
    };
  }

  const equiposValidos = [
    params.seleccionLocalId,
    params.seleccionVisitanteId,
  ];

  if (!equiposValidos.includes(params.equipoClasificadoId)) {
    return {
      error: "El equipo clasificado debe pertenecer al partido.",
    };
  }

  return {
    equipoClasificadoId: params.equipoClasificadoId,
  };
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const url = new URL(req.url);
    const partidoId = url.searchParams.get("partidoId");

    if (partidoId) {
      const prediccion = await prisma.prediccionPartido.findUnique({
        where: {
          usuarioId_partidoId: {
            usuarioId: loggedInUser.id,
            partidoId,
          },
        },
      });

      return NextResponse.json(prediccion);
    }

    const predicciones = await prisma.prediccionPartido.findMany({
      where: {
        usuarioId: loggedInUser.id,
      },
      include: {
        partido: {
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: predicciones,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    console.error("GET /api/pronosticos error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const body = await req.json();
    const dto = pronosticoSchema.parse(body);

    const partido = await prisma.partido.findFirst({
      where: {
        id: dto.partidoId,
        activo: true,
      },
      include: {
        fase: true,
        resultado: true,
      },
    });

    if (!partido) {
      return NextResponse.json(
        { message: "Partido no encontrado." },
        { status: 404 }
      );
    }

    if (isPredictionBlockedByMatchState(partido.resultado)) {
      return NextResponse.json(
        {
          message:
            "No se puede modificar el pronostico porque el partido ya no esta pendiente.",
        },
        { status: 400 }
      );
    }

    if (isPredictionClosed(partido.fecha)) {
      return NextResponse.json(
        { message: "El pronóstico ya está cerrado para este partido." },
        { status: 400 }
      );
    }

    const clasificado = resolveEquipoClasificadoId({
      golesLocal: dto.golesLocal,
      golesVisitante: dto.golesVisitante,
      equipoClasificadoId: dto.equipoClasificadoId,
      faseNombre: partido.fase?.nombre,
      seleccionLocalId: partido.seleccionLocalId,
      seleccionVisitanteId: partido.seleccionVisitanteId,
    });

    if (clasificado && "error" in clasificado) {
      return NextResponse.json(
        { message: clasificado.error },
        { status: 400 }
      );
    }

    const prediccion = await prisma.prediccionPartido.upsert({
      where: {
        usuarioId_partidoId: {
          usuarioId: loggedInUser.id,
          partidoId: dto.partidoId,
        },
      },
      create: {
        usuarioId: loggedInUser.id,
        partidoId: dto.partidoId,
        golesLocal: dto.golesLocal,
        golesVisitante: dto.golesVisitante,
        equipoClasificadoId:
          clasificado && "equipoClasificadoId" in clasificado
            ? clasificado.equipoClasificadoId
            : null,
      },
      update: {
        golesLocal: dto.golesLocal,
        golesVisitante: dto.golesVisitante,
        equipoClasificadoId:
          clasificado && "equipoClasificadoId" in clasificado
            ? clasificado.equipoClasificadoId
            : null,
        puntosOtorgados: 0,
        aciertoTipo: null,
        calculadoAt: null,
      },
    });

    return NextResponse.json(prediccion, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos de pronóstico inválidos.", issues: err.issues },
        { status: 400 }
      );
    }

    console.error("POST /api/pronosticos error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
