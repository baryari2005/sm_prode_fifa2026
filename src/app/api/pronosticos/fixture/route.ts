import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);

    const partidos = await prisma.partido.findMany({
      where: {
        activo: true,
      },
      include: {
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        resultado: true,
        predicciones: {
          where: {
            usuarioId: loggedInUser.id,
          },
          take: 1,
        },
      },
      orderBy: {
        fecha: "asc",
      },
      take: 200,
    });

    const data = partidos.map((partido) => {
      const { predicciones, ...rest } = partido;

      return {
        ...rest,
        miPrediccion: predicciones[0] ?? null,
      };
    });

    return NextResponse.json({
      data,
      meta: {
        total: data.length,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    console.error("GET /api/pronosticos/fixture error:", err);

    return NextResponse.json(
      {
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
