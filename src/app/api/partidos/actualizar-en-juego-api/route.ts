import { EstadoPartido } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { recalcularPronosticosDePartido } from "@/features/partidos/services/pronosticos.service";
import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";

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

type FootballDataMatchDetail = {
  id: number;
  status: string;
  utcDate: string;
  minute?: number | null;
  score?: FootballDataScore | null;
};

type FootballDataMatchDetailResponse = {
  match?: FootballDataMatchDetail;
  message?: string;
};

type SyncResultAction =
  | "created"
  | "updated"
  | "finished"
  | "skipped"
  | "error";

function normalizarApiUrl(rawUrl: string) {
  return rawUrl.trim().replace(/^['"]+/, "").replace(/['";\s]+$/, "");
}

function buildMatchDetailUrl(baseMatchesUrl: string, matchId: number) {
  const normalized = normalizarApiUrl(baseMatchesUrl).replace(/\/+$/, "");
  const matchCollectionSuffix = "/matches";

  if (normalized.endsWith(matchCollectionSuffix)) {
    return `${normalized}/${matchId}`;
  }

  return `${normalized}${matchCollectionSuffix}/${matchId}`;
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

function shouldUseMock(req: NextRequest) {
  const url = new URL(req.url);
  const mockParam = url.searchParams.get("mock");
  const mockEnv = process.env.LIVE_MATCH_SYNC_USE_MOCK;

  return mockParam === "1" || mockEnv === "true";
}

function buildMockMatchDetail(partido: {
  footballDataId: number;
  fecha: Date;
  resultado: {
    golesLocal: number;
    golesVisitante: number;
    tiempoJuego: number | null;
    estado: EstadoPartido;
  } | null;
}) {
  const currentMinute =
    partido.resultado?.estado === EstadoPartido.EN_JUEGO
      ? partido.resultado?.tiempoJuego ?? 0
      : 0;

  const nextMinute = currentMinute <= 0 ? 15 : Math.min(currentMinute + 15, 90);
  const baseLocal = partido.resultado?.golesLocal ?? 0;
  const baseVisitante = partido.resultado?.golesVisitante ?? 0;

  let golesLocal = baseLocal;
  let golesVisitante = baseVisitante;

  if (nextMinute >= 30 && baseLocal === 0) {
    golesLocal = 1;
  }

  if (nextMinute >= 60 && baseVisitante === 0) {
    golesVisitante = 1;
  }

  if (nextMinute >= 75 && golesLocal <= golesVisitante) {
    golesLocal = golesVisitante + 1;
  }

  const status = nextMinute >= 90 ? "FINISHED" : "IN_PLAY";

  return {
    id: partido.footballDataId,
    status,
    utcDate: partido.fecha.toISOString(),
    minute: status === "FINISHED" ? 90 : nextMinute,
    score: {
      fullTime: {
        home: golesLocal,
        away: golesVisitante,
      },
      penalties: null,
    },
  } satisfies FootballDataMatchDetail;
}

async function getMatchDetailFromApi(matchId: number) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const urlApi = process.env.MUNDIAL_2026_API_URL;

  if (!token) {
    throw new Error("Falta configurar FOOTBALL_DATA_API_TOKEN en .env.local");
  }

  if (!urlApi) {
    throw new Error("Falta configurar MUNDIAL_2026_API_URL en .env.local");
  }

  const matchUrl = buildMatchDetailUrl(urlApi, matchId);

  const response = await fetch(matchUrl, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as FootballDataMatchDetailResponse;

  if (!response.ok) {
    throw new Error(payload.message || `Error al consultar match ${matchId}`);
  }

  if (!payload.match) {
    throw new Error(`La API no devolvio datos para match ${matchId}`);
  }

  return payload.match;
}

export async function POST(req: NextRequest) {
  try {
    await authorize(req);
    const useMock = shouldUseMock(req);

    const now = new Date();

    const partidosCandidatos = await prisma.partido.findMany({
      where: {
        activo: true,
        footballDataId: {
          not: null,
        },
        fecha: {
          lte: now,
        },
        OR: [
          {
            resultado: {
              is: null,
            },
          },
          {
            resultado: {
              is: {
                estado: EstadoPartido.PENDIENTE,
              },
            },
          },
          {
            resultado: {
              is: {
                estado: EstadoPartido.EN_JUEGO,
              },
            },
          },
        ],
      },
      include: {
        resultado: true,
        seleccionLocal: true,
        seleccionVisitante: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });

    if (partidosCandidatos.length === 0) {
      return NextResponse.json({
        message: "No hay partidos pendientes o en juego para sincronizar.",
        meta: {
          scanned: 0,
          created: 0,
          updated: 0,
          finished: 0,
          skipped: 0,
          errors: 0,
        },
        resultados: [],
      });
    }

    const resultados: Array<{
      footballDataId: number;
      partidoId: string;
      success: boolean;
      action: SyncResultAction;
      message: string;
    }> = [];

    for (const partido of partidosCandidatos) {
      const footballDataId = partido.footballDataId;

      if (typeof footballDataId !== "number") {
        resultados.push({
          footballDataId: -1,
          partidoId: partido.id,
          success: false,
          action: "skipped",
          message: "El partido no tiene footballDataId valido.",
        });
        continue;
      }

      try {
        const match = useMock
          ? buildMockMatchDetail({
              footballDataId,
              fecha: partido.fecha,
              resultado: partido.resultado
                ? {
                    golesLocal: partido.resultado.golesLocal,
                    golesVisitante: partido.resultado.golesVisitante,
                    tiempoJuego: partido.resultado.tiempoJuego,
                    estado: partido.resultado.estado,
                  }
                : null,
            })
          : await getMatchDetailFromApi(footballDataId);
        const estado = mapApiStatusToEstado(match.status);

        if (
          estado !== EstadoPartido.EN_JUEGO &&
          estado !== EstadoPartido.FINALIZADO &&
          estado !== EstadoPartido.SUSPENDIDO &&
          estado !== EstadoPartido.CANCELADO
        ) {
          resultados.push({
            footballDataId,
            partidoId: partido.id,
            success: true,
            action: "skipped",
            message: `Estado remoto ${match.status} omitido para evitar sobrescribir el partido.`,
          });
          continue;
        }

        const golesLocal = match.score?.fullTime?.home ?? 0;
        const golesVisitante = match.score?.fullTime?.away ?? 0;
        const penalesLocal = match.score?.penalties?.home ?? null;
        const penalesVisitante = match.score?.penalties?.away ?? null;
        const isFinished = estado === EstadoPartido.FINALIZADO;
        const hasResultado = Boolean(partido.resultado);

        const recalculo = await prisma.$transaction(async (tx) => {
          if (hasResultado) {
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
                tiempoJuego: isFinished ? 90 : match.minute ?? null,
                observaciones: isFinished
                  ? useMock
                    ? "Resultado final sincronizado desde simulacion mock."
                    : "Resultado final sincronizado desde football-data.org."
                  : useMock
                  ? `Marcador en vivo sincronizado desde simulacion mock${match.minute ? ` (${match.minute}')` : ""}.`
                  : `Marcador en vivo sincronizado desde football-data.org${match.minute ? ` (${match.minute}')` : ""}.`,
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
                tiempoJuego: isFinished ? 90 : match.minute ?? null,
                observaciones: isFinished
                  ? useMock
                    ? "Resultado final sincronizado desde simulacion mock."
                    : "Resultado final sincronizado desde football-data.org."
                  : useMock
                  ? `Marcador en vivo sincronizado desde simulacion mock${match.minute ? ` (${match.minute}')` : ""}.`
                  : `Marcador en vivo sincronizado desde football-data.org${match.minute ? ` (${match.minute}')` : ""}.`,
              },
            });
          }

          if (isFinished) {
            return recalcularPronosticosDePartido(tx, partido.id);
          }

          return null;
        });

        resultados.push({
          footballDataId,
          partidoId: partido.id,
          success: true,
          action: isFinished ? "finished" : hasResultado ? "updated" : "created",
          message: isFinished
            ? `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: partido finalizado. Pronosticos recalculados: ${recalculo?.procesadas ?? 0}.`
            : hasResultado
            ? `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: marcador en juego sincronizado.`
            : `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: partido pasado a en juego y resultado creado.`,
        });
      } catch (error) {
        resultados.push({
          footballDataId,
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
    const errors = resultados.filter((item) => item.action === "error").length;

    return NextResponse.json({
      message: `Sincronizacion en vivo completada${useMock ? " (mock)" : ""}. ${created} creados, ${updated} actualizados, ${finished} finalizados, ${skipped} omitidos y ${errors} con error.`,
      meta: {
        scanned: partidosCandidatos.length,
        created,
        updated,
        finished,
        skipped,
        errors,
        source: useMock ? "mock" : "api",
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
