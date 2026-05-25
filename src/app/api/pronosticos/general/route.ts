import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREDICTION_CLOSE_MINUTES_BEFORE = 60;

const pronosticoBulkItemSchema = z.object({
  partidoId: z.string().min(1, "El partido es obligatorio"),
  golesLocal: z.number().int().min(0, "Los goles no pueden ser negativos"),
  golesVisitante: z.number().int().min(0, "Los goles no pueden ser negativos"),
});

const pronosticoBulkSchema = z.object({
  pronosticos: z
    .array(pronosticoBulkItemSchema)
    .min(1, "No hay pronosticos para guardar"),
});

type PronosticoBulkItem = z.infer<typeof pronosticoBulkItemSchema>;

type PartidoParaValidar = {
  id: string;
  fecha: Date;
  activo: boolean;
  resultado: {
    id: string;
  } | null;
};

function isPredictionClosed(fechaPartido: Date | string) {
  const matchDate = new Date(fechaPartido).getTime();
  const closeAt = matchDate - PREDICTION_CLOSE_MINUTES_BEFORE * 60 * 1000;

  return Date.now() >= closeAt;
}

function removeDuplicatedPredictions(items: PronosticoBulkItem[]) {
  const map = new Map<string, PronosticoBulkItem>();

  items.forEach((item) => {
    map.set(item.partidoId, item);
  });

  return Array.from(map.values());
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const body = await req.json();

    const parsed = pronosticoBulkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Datos invalidos",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const pronosticos = removeDuplicatedPredictions(parsed.data.pronosticos);
    const partidoIds = pronosticos.map((pronostico) => pronostico.partidoId);

    const partidos: PartidoParaValidar[] = await prisma.partido.findMany({
      where: {
        id: {
          in: partidoIds,
        },
      },
      select: {
        id: true,
        fecha: true,
        activo: true,
        resultado: {
          select: {
            id: true,
          },
        },
      },
    });

    const partidosById = new Map<string, PartidoParaValidar>();
    partidos.forEach((partido) => {
      partidosById.set(partido.id, partido);
    });

    const pronosticosValidos: PronosticoBulkItem[] = [];
    const errors: Array<{
      partidoId: string;
      message: string;
    }> = [];

    pronosticos.forEach((pronostico) => {
      const partido = partidosById.get(pronostico.partidoId);

      if (!partido) {
        errors.push({
          partidoId: pronostico.partidoId,
          message: "El partido no existe",
        });
        return;
      }

      if (!partido.activo) {
        errors.push({
          partidoId: pronostico.partidoId,
          message: "El partido no esta activo",
        });
        return;
      }

      if (partido.resultado) {
        errors.push({
          partidoId: pronostico.partidoId,
          message:
            "El pronostico de este partido ya no se puede modificar porque el partido esta iniciado",
        });
        return;
      }

      if (isPredictionClosed(partido.fecha)) {
        errors.push({
          partidoId: pronostico.partidoId,
          message: "El pronostico de este partido ya esta cerrado",
        });
        return;
      }

      pronosticosValidos.push(pronostico);
    });

    if (pronosticosValidos.length === 0) {
      return NextResponse.json(
        {
          message: "No se pudo guardar ningun pronostico",
          savedCount: 0,
          skippedCount: errors.length,
          errors,
        },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      pronosticosValidos.map((pronostico) =>
        prisma.prediccionPartido.upsert({
          where: {
            usuarioId_partidoId: {
              usuarioId: loggedInUser.id,
              partidoId: pronostico.partidoId,
            },
          },
          update: {
            golesLocal: pronostico.golesLocal,
            golesVisitante: pronostico.golesVisitante,
          },
          create: {
            usuarioId: loggedInUser.id,
            partidoId: pronostico.partidoId,
            golesLocal: pronostico.golesLocal,
            golesVisitante: pronostico.golesVisitante,
          },
        }),
      ),
    );

    return NextResponse.json({
      message:
        errors.length > 0
          ? "Algunos pronosticos se guardaron, pero otros fueron omitidos"
          : "Pronosticos guardados correctamente",
      savedCount: pronosticosValidos.length,
      skippedCount: errors.length,
      errors,
    });
  } catch (error) {
    console.error("[PRONOSTICOS_BULK_POST]", error);

    return NextResponse.json(
      {
        message: "Error interno al guardar los pronosticos",
      },
      { status: 500 },
    );
  }
}
