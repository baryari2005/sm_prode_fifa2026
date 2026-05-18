import { EstadoPartido } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

type FootballDataMatchDetailResponse =
  | FootballDataMatchDetail
  | {
      match?: FootballDataMatchDetail;
      message?: string;
    };

type SyncResultAction =
  | "created"
  | "updated"
  | "finished"
  | "skipped"
  | "error";

type ManualMockTarget = {
  partidoId: string | null;
  footballDataId: number | null;
};

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

  return mockParam === "1" || mockParam === "true" || mockEnv === "true";
}

function wasMockRequestedByQuery(req: NextRequest) {
  const url = new URL(req.url);
  const mockParam = url.searchParams.get("mock");

  return mockParam === "1" || mockParam === "true";
}

function shouldIncludeFutureMatches(req: NextRequest) {
  const url = new URL(req.url);
  const includeFuture = url.searchParams.get("includeFuture");

  return includeFuture === "1" || includeFuture === "true";
}

function getManualMockTarget(req: NextRequest): ManualMockTarget {
  const url = new URL(req.url);

  const partidoId = url.searchParams.get("partidoId");
  const footballDataIdParam = url.searchParams.get("footballDataId");

  const footballDataId = footballDataIdParam
    ? Number(footballDataIdParam)
    : null;

  return {
    partidoId,
    footballDataId:
      footballDataId !== null && !Number.isNaN(footballDataId)
        ? footballDataId
        : null,
  };
}

function parseNullableNumber(value: string | null) {
  if (value === null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
}

function buildAutoMockMatchDetail(partido: {
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

function buildManualMockMatchDetail(
  req: NextRequest,
  partido: {
    footballDataId: number;
    fecha: Date;
    resultado: {
      golesLocal: number;
      golesVisitante: number;
      tiempoJuego: number | null;
      estado: EstadoPartido;
    } | null;
  },
) {
  const url = new URL(req.url);

  const status = url.searchParams.get("status") ?? "IN_PLAY";

  const homeParam = parseNullableNumber(url.searchParams.get("home"));
  const awayParam = parseNullableNumber(url.searchParams.get("away"));
  const minuteParam = parseNullableNumber(url.searchParams.get("minute"));

  const penHomeParam = parseNullableNumber(url.searchParams.get("penHome"));
  const penAwayParam = parseNullableNumber(url.searchParams.get("penAway"));

  const golesLocal = homeParam ?? partido.resultado?.golesLocal ?? 0;
  const golesVisitante = awayParam ?? partido.resultado?.golesVisitante ?? 0;

  const minute =
    minuteParam ??
    (status === "FINISHED" ? 90 : partido.resultado?.tiempoJuego ?? null);

  return {
    id: partido.footballDataId,
    status,
    utcDate: partido.fecha.toISOString(),
    minute,
    score: {
      fullTime: {
        home: golesLocal,
        away: golesVisitante,
      },
      penalties: {
        home: penHomeParam,
        away: penAwayParam,
      },
    },
  } satisfies FootballDataMatchDetail;
}

function extractFootballDataMatch(
  payload: FootballDataMatchDetailResponse,
  matchId: number,
) {
  if ("match" in payload && payload.match) {
    return payload.match;
  }

  if ("id" in payload && typeof payload.id === "number") {
    return payload;
  }

  if ("message" in payload && payload.message) {
    throw new Error(payload.message);
  }

  throw new Error(`La API no devolvio datos para match ${matchId}`);
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
    const message = "message" in payload ? payload.message : null;
    throw new Error(message || `Error al consultar match ${matchId}`);
  }

  return extractFootballDataMatch(payload, matchId);
}

function buildObservaciones(params: {
  useMock: boolean;
  isFinished: boolean;
  minute?: number | null;
}) {
  const { useMock, isFinished, minute } = params;

  if (isFinished) {
    return useMock
      ? "Resultado final sincronizado desde simulacion mock."
      : "Resultado final sincronizado desde football-data.org.";
  }

  const minuteText = minute ? ` (${minute}')` : "";

  return useMock
    ? `Marcador en vivo sincronizado desde simulacion mock${minuteText}.`
    : `Marcador en vivo sincronizado desde football-data.org${minuteText}.`;
}

async function ejecutarSincronizacionPartidosEnJuego(req: NextRequest) {
  await authorize(req);

  const useMock = shouldUseMock(req);
  const mockRequestedByQuery = wasMockRequestedByQuery(req);
  const includeFuture = shouldIncludeFutureMatches(req);
  const manualTarget = getManualMockTarget(req);

  if (
    mockRequestedByQuery &&
    !manualTarget.partidoId &&
    !manualTarget.footballDataId
  ) {
    return {
      message:
        "Para usar mock manual tenes que enviar partidoId o footballDataId.",
      example:
        "/api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=IN_PLAY&home=2&away=1&minute=64&includeFuture=1",
      meta: {
        scanned: 0,
        created: 0,
        updated: 0,
        finished: 0,
        skipped: 0,
        errors: 1,
        source: "mock",
      },
      resultados: [],
    };
  }

  const now = new Date();

  const estadosPermitidosParaResultado = useMock
    ? [
        EstadoPartido.PENDIENTE,
        EstadoPartido.EN_JUEGO,
        EstadoPartido.FINALIZADO,
        EstadoPartido.SUSPENDIDO,
        EstadoPartido.CANCELADO,
      ]
    : [EstadoPartido.PENDIENTE, EstadoPartido.EN_JUEGO];

  const partidosCandidatos = await prisma.partido.findMany({
    where: {
      activo: true,
      footballDataId: {
        not: null,
      },
      ...(includeFuture
        ? {}
        : {
            fecha: {
              lte: now,
            },
          }),
      ...(manualTarget.partidoId
        ? {
            id: manualTarget.partidoId,
          }
        : {}),
      ...(manualTarget.footballDataId
        ? {
            footballDataId: manualTarget.footballDataId,
          }
        : {}),
      OR: [
        {
          resultado: {
            is: null,
          },
        },
        {
          resultado: {
            is: {
              estado: {
                in: estadosPermitidosParaResultado,
              },
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
    return {
      message: "No hay partidos pendientes o en juego para sincronizar.",
      meta: {
        scanned: 0,
        created: 0,
        updated: 0,
        finished: 0,
        skipped: 0,
        errors: 0,
        source: useMock ? "mock" : "api",
      },
      resultados: [],
    };
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
      const partidoMockData = {
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
      };

      const match = useMock
        ? mockRequestedByQuery
          ? buildManualMockMatchDetail(req, partidoMockData)
          : buildAutoMockMatchDetail(partidoMockData)
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

      const observaciones = buildObservaciones({
        useMock,
        isFinished,
        minute: match.minute,
      });

      await prisma.$transaction(async (tx) => {
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
              observaciones,
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
              observaciones,
            },
          });
        }

      });

      resultados.push({
        footballDataId,
        partidoId: partido.id,
        success: true,
        action: isFinished ? "finished" : hasResultado ? "updated" : "created",
        message: isFinished
          ? `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: partido finalizado. Pendiente de ranking diario.`
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
  const finished = resultados.filter(
    (item) => item.action === "finished",
  ).length;
  const skipped = resultados.filter((item) => item.action === "skipped").length;
  const errors = resultados.filter((item) => item.action === "error").length;

  return {
    message: `Sincronizacion en vivo completada${
      useMock ? " (mock)" : ""
    }. ${created} creados, ${updated} actualizados, ${finished} finalizados, ${skipped} omitidos y ${errors} con error.`,
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
  };
}

function handleRouteError(method: "GET" | "POST", err: unknown) {
  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { message: "No autorizado. Debes iniciar sesion." },
      { status: 401 },
    );
  }

  if (err instanceof Error && err.message === "FORBIDDEN") {
    return NextResponse.json(
      { message: "No tenes permisos para sincronizar partidos en juego." },
      { status: 403 },
    );
  }

  console.error(`${method} /api/partidos/actualizar-en-juego-api error:`, err);

  return NextResponse.json(
    {
      message: err instanceof Error ? err.message : "Error interno del servidor",
    },
    { status: 500 },
  );
}

export async function GET(req: NextRequest) {
  try {
    const result = await ejecutarSincronizacionPartidosEnJuego(req);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleRouteError("GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await ejecutarSincronizacionPartidosEnJuego(req);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleRouteError("POST", err);
  }
}
