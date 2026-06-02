import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import type { GoalDetail } from "@/features/partidos/types/fixture-details";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type GoleadorDTO = {
  id: string;
  nombre: string;
  nacionalidad: string;
  posicion: string;
  seleccion: string;
  codigoSeleccion: string;
  escudo: string | null;
  goles: number;
  asistencias: number;
  penales: number;
  partidosJugados: number;
  source: "db" | "mock";
};

function getMockScorers(): GoleadorDTO[] {
  return [
    {
      id: "mock-1",
      nombre: "Julian Alvarez",
      nacionalidad: "Argentina",
      posicion: "Delantero",
      seleccion: "Argentina",
      codigoSeleccion: "ARG",
      escudo: null,
      goles: 5,
      asistencias: 1,
      penales: 0,
      partidosJugados: 5,
      source: "mock",
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const url = new URL(req.url);
    const useMock = url.searchParams.get("mock") === "1";

    if (useMock) {
      const goleadores = getMockScorers();
      return NextResponse.json({
        data: goleadores,
        meta: { total: goleadores.length, source: "mock" },
      });
    }

    const resultados = await prisma.resultado.findMany({
      where: {
        OR: [
          { detalleGolesLocal: { not: Prisma.JsonNull } },
          { detalleGolesVisitante: { not: Prisma.JsonNull } },
        ],
      },
      include: {
        partido: {
          include: {
            seleccionLocal: true,
            seleccionVisitante: true,
          },
        },
      },
    });

    const players = await prisma.jugadorSeleccion.findMany({
      where: { activo: true },
      include: {
        seleccion: true,
      },
    });

    const playerMap = new Map(players.map((player) => [player.id, player]));
    const accumulator = new Map<string, GoleadorDTO>();

    for (const resultado of resultados) {
      const localGoals = (resultado.detalleGolesLocal as GoalDetail[] | null) ?? [];
      const awayGoals = (resultado.detalleGolesVisitante as GoalDetail[] | null) ?? [];

      for (const goal of localGoals) {
        const player = playerMap.get(goal.jugadorId);
        const current = accumulator.get(goal.jugadorId);
        const next: GoleadorDTO = current ?? {
          id: goal.jugadorId,
          nombre: goal.nombre,
          nacionalidad: player?.nacionalidad ?? "Sin dato",
          posicion: player?.posicion ?? "Sin dato",
          seleccion: resultado.partido.seleccionLocal.nombre,
          codigoSeleccion: resultado.partido.seleccionLocal.codigo,
          escudo: resultado.partido.seleccionLocal.bandera ?? null,
          goles: 0,
          asistencias: 0,
          penales: 0,
          partidosJugados: player?.apariciones ?? 0,
          source: "db",
        };

        next.goles += 1;
        if (goal.penal) next.penales += 1;
        accumulator.set(goal.jugadorId, next);
      }

      for (const goal of awayGoals) {
        const player = playerMap.get(goal.jugadorId);
        const current = accumulator.get(goal.jugadorId);
        const next: GoleadorDTO = current ?? {
          id: goal.jugadorId,
          nombre: goal.nombre,
          nacionalidad: player?.nacionalidad ?? "Sin dato",
          posicion: player?.posicion ?? "Sin dato",
          seleccion: resultado.partido.seleccionVisitante.nombre,
          codigoSeleccion: resultado.partido.seleccionVisitante.codigo,
          escudo: resultado.partido.seleccionVisitante.bandera ?? null,
          goles: 0,
          asistencias: 0,
          penales: 0,
          partidosJugados: player?.apariciones ?? 0,
          source: "db",
        };

        next.goles += 1;
        if (goal.penal) next.penales += 1;
        accumulator.set(goal.jugadorId, next);
      }
    }

    const goleadores = Array.from(accumulator.values()).sort((a, b) => {
      if (b.goles !== a.goles) return b.goles - a.goles;
      if (b.penales !== a.penales) return a.penales - b.penales;
      return a.nombre.localeCompare(b.nombre);
    });

    return NextResponse.json({
      data: goleadores,
      meta: {
        total: goleadores.length,
        source: "db",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado. Debes iniciar sesion." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "No tenés permisos para ver goleadores." }, { status: 403 });
    }

    console.error("GET /api/goleadores error:", err);

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
