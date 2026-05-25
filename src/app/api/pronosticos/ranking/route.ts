import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...(init?.headers ?? {}),
    },
  });
}

function getDisplayName(user: {
  nombre?: string | null;
  apellido?: string | null;
  userId?: string | null;
  email?: string | null;
}) {
  const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim();
  return fullName || user.userId || user.email || "Usuario";
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);

    const [rankingRows, myScoredPredictions] = await Promise.all([
      prisma.rankingUsuario.findMany({
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              userId: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: [
          { puntosTotales: "desc" },
          { aciertosExactos: "desc" },
          { aciertosTendencia: "desc" },
          { updatedAt: "asc" },
        ],
      }),
      prisma.prediccionPartido.findMany({
        where: {
          usuarioId: loggedInUser.id,
          calculadoAt: {
            not: null,
          },
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
          calculadoAt: "desc",
        },
        take: 20,
      }),
    ]);

    const ranking = rankingRows.map((row, index) => ({
      posicion: index + 1,
      usuarioId: row.usuarioId,
      nombre: getDisplayName(row.usuario),
      avatarUrl: row.usuario.avatarUrl ?? null,
      puntosTotales: row.puntosTotales,
      aciertosExactos: row.aciertosExactos,
      aciertosTendencia: row.aciertosTendencia,
      partidosPronosticados: row.partidosPronosticados,
      partidosCalificados: row.partidosCalificados,
      updatedAt: row.updatedAt,
    }));

    const miRanking = ranking.find((item) => item.usuarioId === loggedInUser.id) ?? {
      posicion: null,
      usuarioId: loggedInUser.id,
      nombre: getDisplayName(loggedInUser),
      avatarUrl: loggedInUser.avatarUrl ?? null,
      puntosTotales: 0,
      aciertosExactos: 0,
      aciertosTendencia: 0,
      partidosPronosticados: 0,
      partidosCalificados: 0,
      updatedAt: null,
    };

    const historial = myScoredPredictions.map((item) => ({
      id: item.id,
      partidoId: item.partidoId,
      golesLocal: item.golesLocal,
      golesVisitante: item.golesVisitante,
      puntosOtorgados: item.puntosOtorgados,
      aciertoTipo: item.aciertoTipo,
      calculadoAt: item.calculadoAt,
      partido: {
        id: item.partido.id,
        fecha: item.partido.fecha,
        fase: item.partido.fase,
        seleccionLocal: item.partido.seleccionLocal,
        seleccionVisitante: item.partido.seleccionVisitante,
        resultado: item.partido.resultado,
      },
    }));

    return noStoreJson({
      data: {
        miRanking,
        ranking,
        historial,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return noStoreJson(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      );
    }

    console.error("GET /api/pronosticos/ranking error:", err);

    return noStoreJson(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
