import { NextRequest, NextResponse } from "next/server";
import { EstadoPartido } from "@prisma/client";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildPredictionMeta(params: {
  fecha: Date;
  activo: boolean;
  resultado: { estado: EstadoPartido } | null;
  hasPrediction: boolean;
  serverNow: Date;
}) {
  const closeAt = new Date(
    params.fecha.getTime() - 60 * 60 * 1000,
  );
  const isClosed = params.serverNow.getTime() >= closeAt.getTime();
  const started =
    params.resultado?.estado !== undefined &&
    params.resultado.estado !== EstadoPartido.PENDIENTE;
  const isBlocked = started || isClosed;
  const canEdit = params.activo && !isBlocked;

  let status: "pendiente" | "cargado" | "cerrado" | "partido_iniciado" | "finalizado" =
    "pendiente";

  if (params.resultado?.estado === EstadoPartido.FINALIZADO) {
    status = "finalizado";
  } else if (started) {
    status = "partido_iniciado";
  } else if (isClosed) {
    status = "cerrado";
  } else if (params.hasPrediction) {
    status = "cargado";
  }

  return {
    canEdit,
    isClosed,
    isBlocked,
    status,
    closeAt: closeAt.toISOString(),
    evaluatedAt: params.serverNow.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const serverNow = new Date();

    const [partidosFinalizados, partidosAbiertos] = await Promise.all([
      prisma.partido.findMany({
        where: {
          activo: true,
          resultado: {
            is: {
              estado: EstadoPartido.FINALIZADO,
            },
          },
        },
        include: {
          fase: true,
          seleccionLocal: true,
          seleccionVisitante: true,
          resultado: true,
        },
        orderBy: {
          fecha: "asc",
        },
      }),
      prisma.partido.findMany({
        where: {
          activo: true,
          OR: [
            {
              resultado: null,
            },
            {
              resultado: {
                is: {
                  estado: {
                    not: EstadoPartido.FINALIZADO,
                  },
                },
              },
            },
          ],
        },
        include: {
          fase: true,
          seleccionLocal: true,
          seleccionVisitante: true,
          resultado: true,
        },
        orderBy: {
          fecha: "asc",
        },
      }),
    ]);

    const partidos = [...partidosFinalizados, ...partidosAbiertos].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const predicciones = await prisma.prediccionPartido.findMany({
      where: {
        usuarioId: loggedInUser.id,
        partidoId: {
          in: partidos.map((partido) => partido.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const prediccionByPartidoId = new Map<string, (typeof predicciones)[number]>();
    predicciones.forEach((prediccion) => {
      if (!prediccionByPartidoId.has(prediccion.partidoId)) {
        prediccionByPartidoId.set(prediccion.partidoId, prediccion);
      }
    });

    const data = partidos.map((partido) => {
      const miPrediccion = prediccionByPartidoId.get(partido.id) ?? null;

      return {
        ...partido,
        miPrediccion,
        predictionMeta: buildPredictionMeta({
          fecha: partido.fecha,
          activo: partido.activo !== false,
          resultado: partido.resultado
            ? { estado: partido.resultado.estado }
            : null,
          hasPrediction: Boolean(miPrediccion),
          serverNow,
        }),
      };
    });

    return NextResponse.json(
      {
        data,
        meta: {
          total: data.length,
          serverNow: serverNow.toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    console.error("GET /api/pronosticos/fixture error:", err);

    return NextResponse.json(
      {
        message: "Error interno del servidor",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
