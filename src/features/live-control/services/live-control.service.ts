import {
  EstadoPartido,
  PartidoEventoLiveSource,
  PartidoEventoLiveTipo,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/db";
import { recalculateRanking } from "@/features/pronosticos/services/ranking-recalculation.service";
import type {
  ApiGoalCandidate,
  LiveActionResponse,
  LiveControlMatch,
  LiveControlMatchesResponse,
  LiveEventDTO,
  MatchLiveSnapshot,
} from "@/features/live-control/types/live-control.types";
import {
  DEFAULT_TEAM_STATS,
  type TeamLineup,
  type TeamStats,
} from "@/features/partidos/types/fixture-details";

const GOAL_TOLERANCE_MINUTES = 2;

type Tx = Prisma.TransactionClient;

type MatchWithRelations = Prisma.PartidoGetPayload<{
  include: {
    fase: true;
    seleccionLocal: true;
    seleccionVisitante: true;
    resultado: true;
    eventosLive: {
      include: {
        jugador: true;
        createdBy: true;
      };
    };
    liveAudits: {
      include: {
        user: true;
      };
      orderBy: {
        createdAt: "desc";
      };
      take: 20;
    };
  };
}>;

type SyncMatchOptions = {
  partidoId?: string;
  useMock?: boolean;
};

type RemoteLiveMatch = {
  footballDataId: number;
  status: string;
  minute?: number | null;
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    } | null;
    penalties?: {
      home: number | null;
      away: number | null;
    } | null;
  } | null;
  goals?: ApiGoalCandidate[];
};

function isMissingLiveControlInfraError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

function toJsonInput(value: unknown) {
  return value === null || value === undefined
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue);
}

function normalizeApiUrl(rawUrl: string) {
  return rawUrl.trim().replace(/^['"]+/, "").replace(/['";\s]+$/, "");
}

function buildMatchDetailUrl(baseMatchesUrl: string, matchId: number) {
  const normalized = normalizeApiUrl(baseMatchesUrl).replace(/\/+$/, "");
  const matchDetailPattern = /\/matches\/\d+$/;
  const matchCollectionSuffix = "/matches";
  const competitionMatchesPattern = /\/competitions\/[^/]+\/matches$/;

  if (matchDetailPattern.test(normalized)) {
    return normalized;
  }

  if (competitionMatchesPattern.test(normalized)) {
    const apiRoot = normalized.replace(/\/competitions\/[^/]+\/matches$/, "");
    return `${apiRoot}/matches/${matchId}`;
  }

  if (normalized.endsWith(matchCollectionSuffix)) {
    return `${normalized}/${matchId}`;
  }

  return `${normalized}${matchCollectionSuffix}/${matchId}`;
}

function mapApiStatusToEstado(status: string): EstadoPartido {
  switch (status) {
    case "FINISHED":
      return EstadoPartido.FINALIZADO;
    case "SUSPENDED":
      return EstadoPartido.SUSPENDIDO;
    case "CANCELLED":
      return EstadoPartido.CANCELADO;
    case "PAUSED":
      return EstadoPartido.ENTRETIEMPO;
    case "IN_PLAY":
    case "LIVE":
      return EstadoPartido.EN_JUEGO;
    default:
      return EstadoPartido.PENDIENTE;
  }
}

function buildObservaciones(source: "api" | "manual", estado: EstadoPartido, minute?: number | null) {
  const suffix = minute ? ` (${minute}')` : "";

  if (source === "manual") {
    return `Operacion live manual${suffix}.`;
  }

  if (estado === EstadoPartido.FINALIZADO) {
    return "Resultado final sincronizado desde football-data.org.";
  }

  return `Marcador en vivo sincronizado desde football-data.org${suffix}.`;
}

export function calculateScoreFromEvents(
  partido: Pick<MatchWithRelations, "seleccionLocalId" | "seleccionVisitanteId" | "eventosLive">,
) {
  return partido.eventosLive.reduce(
    (acc, event) => {
      if (event.tipo !== PartidoEventoLiveTipo.GOL) return acc;
      if (event.equipoId === partido.seleccionLocalId) acc.local += 1;
      if (event.equipoId === partido.seleccionVisitanteId) acc.visitante += 1;
      return acc;
    },
    { local: 0, visitante: 0 },
  );
}

export function calculateCardsFromEvents(
  partido: Pick<MatchWithRelations, "seleccionLocalId" | "seleccionVisitanteId" | "eventosLive">,
) {
  return partido.eventosLive.reduce(
    (acc, event) => {
      const isYellow =
        event.tipo === PartidoEventoLiveTipo.TARJETA_AMARILLA;
      const isRed =
        event.tipo === PartidoEventoLiveTipo.TARJETA_ROJA;

      if (!isYellow && !isRed) return acc;

      const side =
        event.equipoId === partido.seleccionLocalId
          ? "local"
          : event.equipoId === partido.seleccionVisitanteId
            ? "visitante"
            : null;

      if (!side) return acc;

      if (isYellow) {
        acc[side].yellowCards += 1;
      }

      if (isRed) {
        acc[side].redCards += 1;
      }

      return acc;
    },
    {
      local: { yellowCards: 0, redCards: 0 },
      visitante: { yellowCards: 0, redCards: 0 },
    },
  );
}

function mergeDerivedCardStats(
  currentStats: Prisma.JsonValue | null | undefined,
  nextCards: { yellowCards: number; redCards: number },
): TeamStats {
  const base =
    currentStats && typeof currentStats === "object" && !Array.isArray(currentStats)
      ? ({ ...DEFAULT_TEAM_STATS, ...(currentStats as unknown as Partial<TeamStats>) } satisfies TeamStats)
      : { ...DEFAULT_TEAM_STATS };

  return {
    ...base,
    yellowCards: nextCards.yellowCards,
    redCards: nextCards.redCards,
  };
}

function normalizeTeamLineup(value: Prisma.JsonValue | null | undefined): TeamLineup | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as unknown as TeamLineup;
}

function markCardOnLineup(
  lineup: TeamLineup | null,
  playerId: string,
  cardType: "AMARILLA" | "SEGUNDA_AMARILLA" | "ROJA_DIRECTA",
) {
  if (!lineup) {
    return null;
  }

  let updated = false;

  const applyCard = (players: TeamLineup["titulares"]) =>
    players.map((player) => {
      if (player.jugadorId !== playerId) {
        return player;
      }

      updated = true;

      return {
        ...player,
        yellow:
          cardType === "AMARILLA" || cardType === "SEGUNDA_AMARILLA"
            ? true
            : player.yellow,
        red:
          cardType === "ROJA_DIRECTA" || cardType === "SEGUNDA_AMARILLA"
            ? true
            : player.red,
      };
    });

  if (!updated && !lineup.titulares.some((player) => player.jugadorId === playerId)) {
    const suplenteEncontrado = lineup.suplentes.some((player) => player.jugadorId === playerId);

    if (!suplenteEncontrado) {
      return lineup;
    }
  }

  return {
    ...lineup,
    titulares: applyCard(lineup.titulares),
    suplentes: applyCard(lineup.suplentes),
  };
}

function incrementGoalOnLineup(lineup: TeamLineup | null, playerId: string) {
  if (!lineup) {
    return null;
  }

  let updated = false;

  const applyGoal = (players: TeamLineup["titulares"]) =>
    players.map((player) => {
      if (player.jugadorId !== playerId) {
        return player;
      }

      updated = true;

      return {
        ...player,
        goals: (player.goals ?? 0) + 1,
      };
    });

  if (
    !lineup.titulares.some((player) => player.jugadorId === playerId) &&
    !lineup.suplentes.some((player) => player.jugadorId === playerId)
  ) {
    return lineup;
  }

  const nextLineup = {
    ...lineup,
    titulares: applyGoal(lineup.titulares),
    suplentes: applyGoal(lineup.suplentes),
  };

  return updated ? nextLineup : lineup;
}

export function findMatchingGoal(
  apiGoal: ApiGoalCandidate,
  dbGoals: LiveEventDTO[],
) {
  return dbGoals.find((goal) => {
    if (goal.partidoId !== apiGoal.partidoId) return false;
    if (goal.equipoId !== apiGoal.equipoId) return false;
    if (apiGoal.externalEventId && goal.externalEventId === apiGoal.externalEventId) {
      return true;
    }

    const samePlayer =
      !apiGoal.jugadorId ||
      !goal.jugadorId ||
      apiGoal.jugadorId === goal.jugadorId;
    const minuteA = apiGoal.minuto ?? null;
    const minuteB = goal.minuto ?? null;
    const sameMinute =
      minuteA === null ||
      minuteB === null ||
      Math.abs(minuteA - minuteB) <= GOAL_TOLERANCE_MINUTES;

    return samePlayer && sameMinute;
  });
}

export function reconcileLiveEvents(
  apiEvents: ApiGoalCandidate[],
  dbEvents: LiveEventDTO[],
) {
  const dbGoals = dbEvents.filter((event) => event.tipo === PartidoEventoLiveTipo.GOL);
  const toCreate = apiEvents.filter((goal) => !findMatchingGoal(goal, dbGoals));

  return {
    toCreate,
    matched: apiEvents.length - toCreate.length,
  };
}

async function getLiveMatchDetailFromApi(matchId: number): Promise<RemoteLiveMatch> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const urlApi = process.env.MUNDIAL_2026_API_URL;

  if (!token) {
    throw new Error("Falta configurar FOOTBALL_DATA_API_TOKEN en .env.local");
  }

  if (!urlApi) {
    throw new Error("Falta configurar MUNDIAL_2026_API_URL en .env.local");
  }

  const response = await fetch(buildMatchDetailUrl(urlApi, matchId), {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
    },
    cache: "no-store",
  });

  const rawPayload = await response.text();
  let payload: (
    | {
        id?: number;
        status?: string;
        minute?: number | null;
        score?: RemoteLiveMatch["score"];
      }
    | { match?: RemoteLiveMatch; message?: string }
    | null
  ) = null;

  if (rawPayload) {
    try {
      payload = JSON.parse(rawPayload) as
        | {
            id?: number;
            status?: string;
            minute?: number | null;
            score?: RemoteLiveMatch["score"];
          }
        | { match?: RemoteLiveMatch; message?: string };
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const providerMessage =
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : rawPayload.trim();

    throw new Error(providerMessage || `Error al consultar match ${matchId}`);
  }

  if (payload && "match" in payload && payload.match) {
    return payload.match;
  }

  if (payload && "id" in payload && typeof payload.id === "number" && payload.status) {
    return {
      footballDataId: payload.id,
      status: payload.status,
      minute: payload.minute ?? null,
      score: payload.score ?? null,
      goals: [],
    };
  }

  throw new Error(`La API no devolvio datos para match ${matchId}`);
}

function buildMockRemoteLiveMatch(partido: MatchWithRelations): RemoteLiveMatch {
  const currentMinute = partido.resultado?.tiempoJuego ?? 0;
  const nextMinute = currentMinute <= 0 ? 18 : Math.min(currentMinute + 12, 90);
  const currentScore = calculateScoreFromEvents(partido);
  const home = nextMinute >= 30 ? Math.max(currentScore.local, 1) : currentScore.local;
  const away = nextMinute >= 65 ? Math.max(currentScore.visitante, 1) : currentScore.visitante;
  const status = nextMinute >= 90 ? "FINISHED" : nextMinute === 45 ? "PAUSED" : "IN_PLAY";

  const apiGoals: ApiGoalCandidate[] = [];

  while (apiGoals.length < home) {
    apiGoals.push({
      partidoId: partido.id,
      equipoId: partido.seleccionLocalId,
      minuto: 18 + apiGoals.length * 18,
      externalEventId: `mock-local-${partido.id}-${apiGoals.length + 1}`,
      descripcion: "Gol mock local",
    });
  }

  while (apiGoals.filter((goal) => goal.equipoId === partido.seleccionVisitanteId).length < away) {
    apiGoals.push({
      partidoId: partido.id,
      equipoId: partido.seleccionVisitanteId,
      minuto: 35 + apiGoals.length * 14,
      externalEventId: `mock-away-${partido.id}-${apiGoals.length + 1}`,
      descripcion: "Gol mock visitante",
    });
  }

  return {
    footballDataId: partido.footballDataId ?? 0,
    status,
    minute: status === "FINISHED" ? 90 : nextMinute,
    score: {
      fullTime: {
        home,
        away,
      },
      penalties: null,
    },
    goals: apiGoals,
  };
}

async function registerLiveAudit(
  tx: Tx,
  input: {
    partidoId: string;
    userId: string;
    accion: string;
    valorAnterior?: unknown;
    valorNuevo?: unknown;
  },
) {
  await tx.partidoLiveAudit.create({
    data: {
      partidoId: input.partidoId,
      userId: input.userId,
      accion: input.accion,
      valorAnterior: toJsonInput(input.valorAnterior ?? null),
      valorNuevo: toJsonInput(input.valorNuevo ?? null),
    },
  });
}

async function ensureResultadoFromLive(
  tx: Tx,
  partido: MatchWithRelations,
  estado: EstadoPartido,
  minuto: number | null,
  observaciones: string | null,
  remoteScore?: {
    local?: number | null;
    visitante?: number | null;
    penalesLocal?: number | null;
    penalesVisitante?: number | null;
  },
) {
  const eventScore = calculateScoreFromEvents(partido);
  const score = {
    local: remoteScore?.local ?? eventScore.local,
    visitante: remoteScore?.visitante ?? eventScore.visitante,
  };
  const cards = calculateCardsFromEvents(partido);
  const penalesLocal = remoteScore?.penalesLocal ?? null;
  const penalesVisitante = remoteScore?.penalesVisitante ?? null;

  if (partido.resultado) {
    await tx.resultado.update({
      where: { partidoId: partido.id },
      data: {
        golesLocal: score.local,
        golesVisitante: score.visitante,
        penalesLocal,
        penalesVisitante,
        estado,
        tiempoJuego: estado === EstadoPartido.FINALIZADO ? 90 : minuto,
        observaciones,
        estadisticasLocal: toJsonInput(
          mergeDerivedCardStats(partido.resultado.estadisticasLocal, cards.local),
        ),
        estadisticasVisitante: toJsonInput(
          mergeDerivedCardStats(partido.resultado.estadisticasVisitante, cards.visitante),
        ),
      },
    });
    return;
  }

  await tx.resultado.create({
    data: {
      partidoId: partido.id,
      golesLocal: score.local,
      golesVisitante: score.visitante,
      penalesLocal,
      penalesVisitante,
      estado,
      tiempoJuego: estado === EstadoPartido.FINALIZADO ? 90 : minuto,
      observaciones,
      estadisticasLocal: toJsonInput(
        mergeDerivedCardStats(null, cards.local),
      ),
      estadisticasVisitante: toJsonInput(
        mergeDerivedCardStats(null, cards.visitante),
      ),
    },
  });
}

export async function createManualGoal(input: {
  partidoId: string;
  team: "LOCAL" | "VISITANTE";
  minute: number;
  playerId?: string;
  description?: string;
  userId: string;
}) {
  const partido = await prisma.partido.findUnique({
    where: { id: input.partidoId },
    include: {
      resultado: true,
      eventosLive: true,
    },
  });

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  const equipoId =
    input.team === "LOCAL" ? partido.seleccionLocalId : partido.seleccionVisitanteId;

  return prisma.$transaction(async (tx) => {
    const event = await tx.partidoEventoLive.create({
      data: {
        partidoId: partido.id,
        tipo: PartidoEventoLiveTipo.GOL,
        equipoId,
        jugadorId: input.playerId ?? null,
        minuto: input.minute,
        descripcion: input.description?.trim() || null,
        source: PartidoEventoLiveSource.MANUAL,
        confirmedManual: true,
        protected: true,
        createdById: input.userId,
      },
    });

    if (partido.resultado && input.playerId) {
      const currentLineup =
        input.team === "LOCAL"
          ? normalizeTeamLineup(partido.resultado.alineacionLocal as Prisma.JsonValue | null | undefined)
          : normalizeTeamLineup(
              partido.resultado.alineacionVisitante as Prisma.JsonValue | null | undefined,
            );

      const nextLineup = incrementGoalOnLineup(currentLineup, input.playerId);

      if (nextLineup) {
        await tx.resultado.update({
          where: { partidoId: partido.id },
          data:
            input.team === "LOCAL"
              ? { alineacionLocal: toJsonInput(nextLineup) }
              : { alineacionVisitante: toJsonInput(nextLineup) },
        });
      }
    }

    const partidoWithEvents = await tx.partido.findUniqueOrThrow({
      where: { id: partido.id },
      include: {
        resultado: true,
        eventosLive: true,
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        liveAudits: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    const nextEstado =
      partidoWithEvents.resultado?.estado === EstadoPartido.FINALIZADO
        ? EstadoPartido.FINALIZADO
        : EstadoPartido.EN_JUEGO;

    await ensureResultadoFromLive(
      tx,
      partidoWithEvents as MatchWithRelations,
      nextEstado,
      input.minute,
      buildObservaciones("manual", nextEstado, input.minute),
    );

    await registerLiveAudit(tx, {
      partidoId: partido.id,
      userId: input.userId,
      accion: "manual_goal_created",
      valorNuevo: {
        eventId: event.id,
        minute: input.minute,
        team: input.team,
        playerId: input.playerId ?? null,
      },
    });

    return event;
  });
}

export async function updateLiveMatchStatus(input: {
  partidoId: string;
  estado: EstadoPartido;
  minuto?: number | null;
  observacion?: string | null;
  userId: string;
}) {
  await prisma.$transaction(async (tx) => {
    const partido = await tx.partido.findUniqueOrThrow({
      where: { id: input.partidoId },
      include: {
        resultado: true,
        eventosLive: true,
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        liveAudits: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    await tx.partidoEventoLive.create({
      data: {
        partidoId: partido.id,
        tipo: PartidoEventoLiveTipo.ESTADO,
        minuto: input.minuto ?? null,
        descripcion: input.observacion ?? `Estado manual: ${input.estado}`,
        source: PartidoEventoLiveSource.MANUAL,
        confirmedManual: true,
        protected: true,
        createdById: input.userId,
      },
    });

    await ensureResultadoFromLive(
      tx,
      partido as MatchWithRelations,
      input.estado,
      input.minuto ?? null,
      input.observacion ?? buildObservaciones("manual", input.estado, input.minuto ?? null),
    );

    await registerLiveAudit(tx, {
      partidoId: partido.id,
      userId: input.userId,
      accion: "manual_status_changed",
      valorAnterior: {
        estado: partido.resultado?.estado ?? null,
        minuto: partido.resultado?.tiempoJuego ?? null,
      },
      valorNuevo: {
        estado: input.estado,
        minuto: input.minuto ?? null,
      },
    });
  });

  if (input.estado === EstadoPartido.FINALIZADO) {
    await recalculateRanking({
      source: "live-control",
      triggeredByUserId: input.userId,
      partidoId: input.partidoId,
      force: true,
      soloNoCalculados: false,
    });
  }
}

export async function createManualCard(input: {
  partidoId: string;
  team: "LOCAL" | "VISITANTE";
  minute: number;
  playerId: string;
  cardType: "AMARILLA" | "SEGUNDA_AMARILLA" | "ROJA_DIRECTA";
  description?: string;
  userId: string;
}) {
  const partido = await prisma.partido.findUnique({
    where: { id: input.partidoId },
    include: {
      resultado: true,
      eventosLive: true,
    },
  });

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  const equipoId =
    input.team === "LOCAL" ? partido.seleccionLocalId : partido.seleccionVisitanteId;

  return prisma.$transaction(async (tx) => {
    const eventsToCreate =
      input.cardType === "SEGUNDA_AMARILLA"
        ? [
            {
              tipo: PartidoEventoLiveTipo.TARJETA_AMARILLA,
              descripcion: input.description?.trim() || "Segunda amarilla",
            },
            {
              tipo: PartidoEventoLiveTipo.TARJETA_ROJA,
              descripcion: "Expulsion por segunda amarilla",
            },
          ]
        : [
            {
              tipo:
                input.cardType === "ROJA_DIRECTA"
                  ? PartidoEventoLiveTipo.TARJETA_ROJA
                  : PartidoEventoLiveTipo.TARJETA_AMARILLA,
              descripcion: input.description?.trim() || null,
            },
          ];

    const createdEvents = [];

    for (const item of eventsToCreate) {
      createdEvents.push(
        await tx.partidoEventoLive.create({
          data: {
            partidoId: partido.id,
            tipo: item.tipo,
            equipoId,
            jugadorId: input.playerId,
            minuto: input.minute,
            descripcion: item.descripcion,
            source: PartidoEventoLiveSource.MANUAL,
            confirmedManual: true,
            protected: true,
            createdById: input.userId,
          },
        }),
      );
    }

    const currentResult = partido.resultado;

    if (currentResult) {
      const currentLineup =
        input.team === "LOCAL"
          ? normalizeTeamLineup(currentResult.alineacionLocal as Prisma.JsonValue | null | undefined)
          : normalizeTeamLineup(
              currentResult.alineacionVisitante as Prisma.JsonValue | null | undefined,
            );

      const nextLineup = markCardOnLineup(currentLineup, input.playerId, input.cardType);

      if (nextLineup) {
        await tx.resultado.update({
          where: { partidoId: partido.id },
          data:
            input.team === "LOCAL"
              ? { alineacionLocal: toJsonInput(nextLineup) }
              : { alineacionVisitante: toJsonInput(nextLineup) },
        });
      }
    }

    const partidoWithEvents = await tx.partido.findUniqueOrThrow({
      where: { id: partido.id },
      include: {
        resultado: true,
        eventosLive: true,
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        liveAudits: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    const nextEstado =
      partidoWithEvents.resultado?.estado === EstadoPartido.FINALIZADO
        ? EstadoPartido.FINALIZADO
        : partidoWithEvents.resultado?.estado ?? EstadoPartido.EN_JUEGO;

    await ensureResultadoFromLive(
      tx,
      partidoWithEvents as MatchWithRelations,
      nextEstado,
      partidoWithEvents.resultado?.tiempoJuego ?? input.minute,
      partidoWithEvents.resultado?.observaciones ?? buildObservaciones("manual", nextEstado, input.minute),
    );

    await registerLiveAudit(tx, {
      partidoId: partido.id,
      userId: input.userId,
      accion: "manual_card_created",
      valorNuevo: {
        eventIds: createdEvents.map((event) => event.id),
        minute: input.minute,
        team: input.team,
        playerId: input.playerId,
        cardType: input.cardType,
      },
    });

    return createdEvents;
  });
}

export async function syncSingleMatchNow(partidoId: string, options?: Omit<SyncMatchOptions, "partidoId">) {
  const result = await syncLiveMatches({ ...options, partidoId });
  return result.items[0] ?? null;
}

export async function syncLiveMatches(options?: SyncMatchOptions) {
  const partidos = await prisma.partido.findMany({
    where: {
      activo: true,
      footballDataId: { not: null },
      ...(options?.partidoId ? { id: options.partidoId } : {}),
      OR: [
        { resultado: { is: null } },
        {
          resultado: {
            is: {
              estado: {
                in: [
                  EstadoPartido.PENDIENTE,
                  EstadoPartido.EN_JUEGO,
                  EstadoPartido.ENTRETIEMPO,
                ],
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
      eventosLive: {
        include: {
          jugador: true,
          createdBy: true,
        },
      },
      liveAudits: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
    orderBy: { fecha: "asc" },
  });

  const items: Array<{
    partidoId: string;
    footballDataId: number | null;
    action: "updated" | "skipped" | "error";
    message: string;
    createdEvents: number;
  }> = [];

  for (const partido of partidos) {
    try {
      const remote =
        options?.useMock || !partido.footballDataId
          ? buildMockRemoteLiveMatch(partido as MatchWithRelations)
          : await getLiveMatchDetailFromApi(partido.footballDataId);

      const estado = mapApiStatusToEstado(remote.status);
      const existingEvents = partido.eventosLive.map((event) => ({
        ...event,
        equipoId: event.equipoId ?? null,
        jugadorId: event.jugadorId ?? null,
        descripcion: event.descripcion ?? null,
        externalEventId: event.externalEventId ?? null,
        createdById: event.createdById ?? null,
      })) as LiveEventDTO[];

      const apiGoals = remote.goals ?? [];
      const reconciliation = reconcileLiveEvents(apiGoals, existingEvents);

      await prisma.$transaction(async (tx) => {
        for (const goal of reconciliation.toCreate) {
          await tx.partidoEventoLive.create({
            data: {
              partidoId: partido.id,
              tipo: PartidoEventoLiveTipo.GOL,
              equipoId: goal.equipoId,
              jugadorId: goal.jugadorId ?? null,
              minuto: goal.minuto ?? null,
              descripcion: goal.descripcion ?? null,
              source: PartidoEventoLiveSource.API,
              externalEventId: goal.externalEventId ?? null,
              confirmedManual: false,
              protected: false,
            },
          });
        }

        const partidoActualizado = await tx.partido.findUniqueOrThrow({
          where: { id: partido.id },
          include: {
            resultado: true,
            eventosLive: true,
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            liveAudits: {
              include: { user: true },
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        });

        await ensureResultadoFromLive(
          tx,
          partidoActualizado as MatchWithRelations,
          estado,
          estado === EstadoPartido.FINALIZADO ? 90 : remote.minute ?? null,
          buildObservaciones("api", estado, remote.minute ?? null),
          {
            local: remote.score?.fullTime?.home ?? null,
            visitante: remote.score?.fullTime?.away ?? null,
            penalesLocal: remote.score?.penalties?.home ?? null,
            penalesVisitante: remote.score?.penalties?.away ?? null,
          },
        );
      });

      items.push({
        partidoId: partido.id,
        footballDataId: partido.footballDataId,
        action: "updated",
        message: `${partido.seleccionLocal.nombre} vs ${partido.seleccionVisitante.nombre}: ${reconciliation.toCreate.length} eventos nuevos reconciliados.`,
        createdEvents: reconciliation.toCreate.length,
      });
    } catch (error) {
      items.push({
        partidoId: partido.id,
        footballDataId: partido.footballDataId,
        action: "error",
        message: error instanceof Error ? error.message : "Error interno",
        createdEvents: 0,
      });
    }
  }

  return {
    message: `Sincronizacion live completada. ${items.filter((item) => item.action === "updated").length} partidos actualizados.`,
    items,
  };
}

export async function listLiveControlMatches() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const classifyMatches = (matches: LiveControlMatch[]): LiveControlMatchesResponse => {
    const liveStates = new Set<EstadoPartido>([
      EstadoPartido.EN_JUEGO,
      EstadoPartido.ENTRETIEMPO,
    ]);
    const nonClosedStates = new Set<EstadoPartido>([
      EstadoPartido.PENDIENTE,
      EstadoPartido.EN_JUEGO,
      EstadoPartido.ENTRETIEMPO,
      EstadoPartido.SUSPENDIDO,
    ]);

    const live: LiveControlMatch[] = [];
    const proximos: LiveControlMatch[] = [];
    const noCerrados: LiveControlMatch[] = [];

    for (const match of matches) {
      const matchDate = new Date(match.fecha);
      const estado = match.liveSnapshot.estado;

      if (
        matchDate < start &&
        nonClosedStates.has(estado)
      ) {
        noCerrados.push(match);
        continue;
      }

      if (liveStates.has(estado)) {
        live.push(match);
        continue;
      }

      if (matchDate >= start) {
        proximos.push(match);
      }
    }

    return {
      all: matches,
      live,
      proximos,
      noCerrados,
    };
  };

  const mapMatches = (matches: Array<MatchWithRelations | (Prisma.PartidoGetPayload<{
    include: {
      fase: true;
      seleccionLocal: true;
      seleccionVisitante: true;
      resultado: true;
    };
  }> & { eventosLive?: []; liveAudits?: [] })>): LiveControlMatch[] =>
    matches.map((match) => {
      const eventosLive = "eventosLive" in match ? match.eventosLive ?? [] : [];
      const score =
        eventosLive.length > 0
          ? calculateScoreFromEvents(match as MatchWithRelations)
          : {
              local: match.resultado?.golesLocal ?? 0,
              visitante: match.resultado?.golesVisitante ?? 0,
            };
      const manualCount = eventosLive.filter(
        (event) => event.source === PartidoEventoLiveSource.MANUAL,
      ).length;
      const apiCount = eventosLive.filter(
        (event) => event.source === PartidoEventoLiveSource.API,
      ).length;
      const snapshot: MatchLiveSnapshot = {
        partidoId: match.id,
        estado: match.resultado?.estado ?? EstadoPartido.PENDIENTE,
        tiempoJuego: match.resultado?.tiempoJuego ?? null,
        score,
        source:
          manualCount > 0 && apiCount > 0
            ? "MIXTO"
            : manualCount > 0
              ? "MANUAL"
              : apiCount > 0
                ? "API"
                : "SIN_EVENTOS",
      };

      return {
        ...match,
        eventosLive,
        liveAudits: "liveAudits" in match ? match.liveAudits ?? [] : [],
        liveSnapshot: snapshot,
      } as LiveControlMatch;
    });

  try {
    const matches = await prisma.partido.findMany({
      where: {
        activo: true,
      },
      include: {
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        resultado: true,
        eventosLive: {
          include: {
            jugador: true,
            createdBy: true,
          },
          orderBy: [{ minuto: "asc" }, { createdAt: "asc" }],
        },
        liveAudits: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
      orderBy: { fecha: "asc" },
    });

    return classifyMatches(mapMatches(matches as MatchWithRelations[]));
  } catch (error) {
    if (!isMissingLiveControlInfraError(error)) {
      throw error;
    }

    const matches = await prisma.partido.findMany({
      where: {
        activo: true,
      },
      include: {
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        resultado: true,
      },
      orderBy: { fecha: "asc" },
    });

    return classifyMatches(mapMatches(matches.map((match) => ({
      ...match,
      eventosLive: [],
      liveAudits: [],
    }))));
  }
}

export async function cleanupDuplicateLiveGoals(partidoId: string, userId: string) {
  const events = await prisma.partidoEventoLive.findMany({
    where: {
      partidoId,
      tipo: PartidoEventoLiveTipo.GOL,
    },
    orderBy: [{ minuto: "asc" }, { createdAt: "asc" }],
  });

  const duplicates: string[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    const bucket = [
      event.equipoId ?? "none",
      event.jugadorId ?? "none",
      event.minuto ?? "none",
      event.source,
      event.externalEventId ?? "none",
    ].join("|");

    if (seen.has(bucket) && !event.protected && !event.confirmedManual) {
      duplicates.push(event.id);
      continue;
    }

    seen.add(bucket);
  }

  if (duplicates.length > 0) {
    await prisma.$transaction(async (tx) => {
      await tx.partidoEventoLive.deleteMany({
        where: { id: { in: duplicates } },
      });

      await registerLiveAudit(tx, {
        partidoId,
        userId,
        accion: "cleanup_duplicate_events",
        valorNuevo: { deletedIds: duplicates },
      });
    });
  }

  return {
    deletedCount: duplicates.length,
    deletedIds: duplicates,
  };
}

export async function validateMatchLiveConsistency(partidoId: string): Promise<LiveActionResponse> {
  const partido = await prisma.partido.findUnique({
    where: { id: partidoId },
    include: {
      resultado: true,
      eventosLive: true,
    },
  });

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  const calculated = calculateScoreFromEvents(partido as MatchWithRelations);
  const calculatedCards = calculateCardsFromEvents(partido as MatchWithRelations);
  const warnings: string[] = [];

  if (
    partido.resultado &&
    (partido.resultado.golesLocal !== calculated.local ||
      partido.resultado.golesVisitante !== calculated.visitante)
  ) {
    warnings.push("El marcador guardado en Resultado no coincide con el calculado desde eventos.");
  }

  const estadisticasLocal =
    partido.resultado?.estadisticasLocal &&
    typeof partido.resultado.estadisticasLocal === "object" &&
    !Array.isArray(partido.resultado.estadisticasLocal)
      ? (partido.resultado.estadisticasLocal as unknown as Partial<TeamStats>)
      : null;
  const estadisticasVisitante =
    partido.resultado?.estadisticasVisitante &&
    typeof partido.resultado.estadisticasVisitante === "object" &&
    !Array.isArray(partido.resultado.estadisticasVisitante)
      ? (partido.resultado.estadisticasVisitante as unknown as Partial<TeamStats>)
      : null;

  if (
    estadisticasLocal &&
    (estadisticasLocal.yellowCards ?? 0) !== calculatedCards.local.yellowCards
  ) {
    warnings.push("Las amarillas del local no coinciden con los eventos live.");
  }

  if (
    estadisticasLocal &&
    (estadisticasLocal.redCards ?? 0) !== calculatedCards.local.redCards
  ) {
    warnings.push("Las rojas del local no coinciden con los eventos live.");
  }

  if (
    estadisticasVisitante &&
    (estadisticasVisitante.yellowCards ?? 0) !== calculatedCards.visitante.yellowCards
  ) {
    warnings.push("Las amarillas del visitante no coinciden con los eventos live.");
  }

  if (
    estadisticasVisitante &&
    (estadisticasVisitante.redCards ?? 0) !== calculatedCards.visitante.redCards
  ) {
    warnings.push("Las rojas del visitante no coinciden con los eventos live.");
  }

  return {
    status: warnings.length > 0 ? "warning" : "ok",
    message: warnings.length > 0 ? "Se detectaron diferencias." : "Consistencia OK.",
    data: {
      resultado: partido.resultado
        ? {
            golesLocal: partido.resultado.golesLocal,
            golesVisitante: partido.resultado.golesVisitante,
          }
        : null,
      calculado: calculated,
      tarjetasCalculadas: calculatedCards,
      totalEventos: partido.eventosLive.length,
    },
    warnings,
    timestamp: new Date().toISOString(),
  };
}

export async function recalculateScoreFromEvents(partidoId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const partido = await tx.partido.findUniqueOrThrow({
      where: { id: partidoId },
      include: {
        resultado: true,
        eventosLive: true,
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        liveAudits: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    await ensureResultadoFromLive(
      tx,
      partido as MatchWithRelations,
      partido.resultado?.estado ?? EstadoPartido.PENDIENTE,
      partido.resultado?.tiempoJuego ?? null,
      partido.resultado?.observaciones ?? "Marcador recalculado desde eventos live.",
    );

    await registerLiveAudit(tx, {
      partidoId,
      userId,
      accion: "recalculate_score_from_events",
      valorNuevo: calculateScoreFromEvents(partido as MatchWithRelations),
    });
  });
}

export async function recalculatePointsForMatch(partidoId: string) {
  return recalculateRanking({
    source: "live-control",
    partidoId,
    force: true,
    soloNoCalculados: false,
  });
}

export async function recalculateRankingFromPredictions() {
  return recalculateRanking({
    source: "live-control",
    force: true,
    soloNoCalculados: false,
  });
}
