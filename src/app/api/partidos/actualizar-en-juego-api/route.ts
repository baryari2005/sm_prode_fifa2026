import { EstadoPartido } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { recalcularPronosticosDePartido } from "@/features/partidos/services/pronosticos.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FootballDataScore = {
  fullTime?: {
    home: number | null;
    away: number | null;
  } | null;
  penalties?: {
    home: number | null;
    away: number | null;
  } | null;
};

type FootballDataLiveMatch = {
  id: number;
  status: string;
  utcDate: string;
  stage?: string | null;
  minute?: number | null;
  score?: FootballDataScore | null;
};

type FootballDataLiveResponse = {
  matches?: FootballDataLiveMatch[];
  message?: string;
};

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED", "LIVE"]);

function normalizarApiUrl(rawUrl: string) {
  return rawUrl.trim().replace(/^['"]+/, "").replace(/['";\s]+$/, "");
}

async function authorize(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const incomingCronSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  if (
    cronSecret &&
    (incomingCronSecret === cronSecret || authHeader === `Bearer ${cronSecret}`)
  ) {
    return;
  }

  const loggedInUser = await requireAuth(req);

  try {
    requirePermission(loggedInUser, "resultados", "editar");
    return;
  } catch {}

  requirePermission(loggedInUser, "resultados", "crear");
}

async function getLiveMatchesFromApi() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const urlApi = process.env.MUNDIAL_2026_API_URL;

  if (!token) {
    throw new Error("Falta configurar FOOTBALL_DATA_API_TOKEN en .env.local");
  }

  if (!urlApi) {
    throw new Error("Falta configurar MUNDIAL_2026_API_URL en .env.local");
  }

  const apiUrl = new URL(normalizarApiUrl(urlApi));
  apiUrl.searchParams.set("season", "2026");

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as FootballDataLiveResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Error al consultar football-data.org");
  }

  return (payload.matches ?? []).filter((match) => LIVE_STATUSES.has(match.status));
}

function mapApiStatusToEstado(status: string): EstadoPartido {
  switch (status) {
    case "FINISHED":
      return EstadoPartido.FINALIZADO;
    case "SUSPENDED":
      return EstadoPartido.SUSPENDIDO;
    case "CANCELLED":
      return EstadoPartido.CANCELADO;
    case "IN_PLAY":
    case "PAUSED":
    case "LIVE":
      return EstadoPartido.EN_JUEGO;
    default:
      return EstadoPartido.PENDIENTE;
  }
}

export async function POST(req: NextRequest) {
  try {
    await authorize(req);

    const liveMatches = await getLiveMatchesFromApi();

    if (liveMatches.length === 0) {
      return NextResponse.json({
        message: "No hay partidos en juego para sincronizar.",
        meta: {
          scanned: 0,
          updated: 0,
          created: 0,
          finished: 0,
          skipped: 0,
        },
        resultados: [],
      });
    }

    const ids = liveMatches.map((match) => match.id);

    const partidos = await prisma.partido.findMany({
      where: {
        activo: true,
        footballDataId: {
          in: ids,
        },
      },
      include: {
        resultado: true,
        seleccionLocal: true,
        seleccionVisitante: true,
      },
    });

    const partidosByFootballDataId = new Map(
      partidos
        .filter(
          (partido): partido is typeof partido & { footballDataId: number } =>
            typeof partido.footballDataId === "number"
        )
        .map((partido) => [partido.footballDataId, partido])
    );

    const resultados: Array<{
      footballDataId: number;
      success: boolean;
      action: "created" | "updated" | "finished" | "skipped" | "error";
      message: string;
      partidoId?: string;
    }> = [];

    for (const match of liveMatches) {
      const partido = partidosByFootballDataId.get(match.id);

      if (!partido) {
        resultados.push({
          footballDataId: match.id,
          success: false,
          action: "skipped",
          message: "No se encontro un partido local con ese footballDataId.",
        });
        continue;
      }

      const golesLocal = match.score?.fullTime?.home ?? 0;
      const golesVisitante = match.score?.fullTime?.away ?? 0;
      const penalesLocal = match.score?.penalties?.home ?? null;
      const penalesVisitante = match.score?.penalties?.away ?? null;
      const estado = mapApiStatusToEstado(match.status);
      const isFinished = estado === EstadoPartido.FINALIZADO;

      try {
        const recalculo = await prisma.$transaction(async (tx) => {
          if (partido.resultado) {
            await tx.resultado.update({
              where: {
                partidoId: partido.id,
              },
              data: {
                golesLocal,
                golesVisitante,
                penalesLocal,
                penalesVisitante,
                estado,
                tiempoJuego: isFinished ? 90 : null,
                observaciones: isFinished
                  ? "Resultado final sincronizado desde football-data.org."
                  : "Marcador en vivo sincronizado desde football-data.org.",
              },
            });
          } else {
            await tx.resultado.create({
              data: {
                partidoId: partido.id,
                golesLocal,
                golesVisitante,
                penalesLocal,
                penalesVisitante,
                estado,
                tiempoJuego: isFinished ? 90 : null,
                observaciones: isFinished
                  ? "Resultado final sincronizado desde football-data.org."
                  : "Marcador en vivo sincronizado desde football-data.org.",
              },
            });
          }

          if (isFinished) {
            return recalcularPronosticosDePartido(tx, partido.id);
          }

          return null;
        });

        resultados.push({
          footballDataId: match.id,
          partidoId: partido.id,
          success: true,
          action: isFinished
            ? "finished"
            : partido.resultado
            ? "updated"
            : "created",
          message: isFinished
            ? `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: partido finalizado. Pronosticos recalculados: ${recalculo?.procesadas ?? 0}.`
            : `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: marcador en juego sincronizado.`,
        });
      } catch (error) {
        resultados.push({
          footballDataId: match.id,
          partidoId: partido.id,
          success: false,
          action: "error",
          message: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    const created = resultados.filter((item) => item.action === "created").length;
    const updated = resultados.filter((item) => item.action === "updated").length;
    const finished = resultados.filter((item) => item.action === "finished").length;
    const skipped = resultados.filter((item) => item.action === "skipped").length;

    return NextResponse.json({
      message: `Sincronizacion en vivo completada. ${updated} actualizados, ${created} creados, ${finished} finalizados y ${skipped} omitidos.`,
      meta: {
        scanned: liveMatches.length,
        updated,
        created,
        finished,
        skipped,
      },
      resultados,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para sincronizar partidos en juego." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/actualizar-en-juego-api error:", err);

    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
