import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { GoalDetail, TeamLineup, TeamStats } from "../types/fixture-details";
import type { FixturePhaseSlug } from "../constants/fixture-phase-filter.constants";
import type {
  Fase,
  JugadorSeleccion,
  JugadorSeleccionCreateInput,
  JugadorSeleccionUpdateInput,
  Partido,
  PartidoCreateInput,
  PartidoUpdateInput,
  Resultado,
  ResultadoCreateInput,
  ResultadoUpdateInput,
  Seleccion,
} from "../types/types";
import {
  calcularTablaPosiciones,
  type PosicionEquipo,
} from "./tabla-posiciones.service";

function parseTeamStats(value: Prisma.JsonValue | null | undefined): TeamStats | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as unknown as TeamStats;
}

function parseTeamLineup(value: Prisma.JsonValue | null | undefined): TeamLineup | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as unknown as TeamLineup;
}

function parseGoalDetails(value: Prisma.JsonValue | null | undefined): GoalDetail[] | null {
  if (!Array.isArray(value)) return null;
  return value as unknown as GoalDetail[];
}

function toJsonInput(value: unknown) {
  return value === null || value === undefined
    ? Prisma.JsonNull
    : (value as Prisma.InputJsonValue);
}

function normalizePartido(partido: Partido): Partido {
  if (!partido.resultado) return partido;

  return {
    ...partido,
    resultado: {
      ...partido.resultado,
      estadisticasLocal: parseTeamStats(
        partido.resultado.estadisticasLocal as Prisma.JsonValue | null | undefined
      ),
      estadisticasVisitante: parseTeamStats(
        partido.resultado.estadisticasVisitante as Prisma.JsonValue | null | undefined
      ),
      alineacionLocal: parseTeamLineup(
        partido.resultado.alineacionLocal as Prisma.JsonValue | null | undefined
      ),
      alineacionVisitante: parseTeamLineup(
        partido.resultado.alineacionVisitante as Prisma.JsonValue | null | undefined
      ),
      detalleGolesLocal: parseGoalDetails(
        partido.resultado.detalleGolesLocal as Prisma.JsonValue | null | undefined
      ),
      detalleGolesVisitante: parseGoalDetails(
        partido.resultado.detalleGolesVisitante as Prisma.JsonValue | null | undefined
      ),
    },
  };
}

function normalizeResultado(resultado: Resultado): Resultado {
  return {
    ...resultado,
    estadisticasLocal: parseTeamStats(
      resultado.estadisticasLocal as Prisma.JsonValue | null | undefined
    ),
    estadisticasVisitante: parseTeamStats(
      resultado.estadisticasVisitante as Prisma.JsonValue | null | undefined
    ),
    alineacionLocal: parseTeamLineup(
      resultado.alineacionLocal as Prisma.JsonValue | null | undefined
    ),
    alineacionVisitante: parseTeamLineup(
      resultado.alineacionVisitante as Prisma.JsonValue | null | undefined
    ),
    detalleGolesLocal: parseGoalDetails(
      resultado.detalleGolesLocal as Prisma.JsonValue | null | undefined
    ),
    detalleGolesVisitante: parseGoalDetails(
      resultado.detalleGolesVisitante as Prisma.JsonValue | null | undefined
    ),
  };
}

export async function getPartidos(params?: {
  faseId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ items: Partido[]; total: number }> {
  const where: Prisma.PartidoWhereInput = {
    activo: true,
  };

  if (params?.faseId) {
    where.faseId = params.faseId;
  }

  if (params?.fechaDesde || params?.fechaHasta) {
    where.fecha = {
      ...(params.fechaDesde ? { gte: params.fechaDesde } : {}),
      ...(params.fechaHasta ? { lte: params.fechaHasta } : {}),
    };
  }

  const [items, total] = await Promise.all([
    prisma.partido.findMany({
      where,
      include: {
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        resultado: true,
      },
      orderBy: { fecha: "asc" },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
    }),
    prisma.partido.count({ where }),
  ]);

  return {
    items: items.map((item) => normalizePartido(item as unknown as Partido)),
    total,
  };
}

export async function getPartidoById(id: string): Promise<Partido | null> {
  const partido = await prisma.partido.findUnique({
    where: { id, activo: true },
    include: {
      fase: true,
      seleccionLocal: true,
      seleccionVisitante: true,
      resultado: true,
    },
  });

  return partido ? normalizePartido(partido as unknown as Partido) : null;
}

export async function createPartido(data: PartidoCreateInput): Promise<Partido> {
  const partido = await prisma.partido.create({
    data: {
      ...data,
      footballDataId: data.footballDataId ?? null,
      activo: true,
    },
    include: {
      fase: true,
      seleccionLocal: true,
      seleccionVisitante: true,
      resultado: true,
    },
  });

  return normalizePartido(partido as unknown as Partido);
}

export async function updatePartido(
  id: string,
  data: PartidoUpdateInput
): Promise<Partido> {
  const partido = await prisma.partido.update({
    where: { id },
    data,
    include: {
      fase: true,
      seleccionLocal: true,
      seleccionVisitante: true,
      resultado: true,
    },
  });

  return normalizePartido(partido as unknown as Partido);
}

export async function deletePartido(id: string): Promise<void> {
  await prisma.partido.update({
    where: { id },
    data: { activo: false },
  });
}

export async function getSelecciones(): Promise<Seleccion[]> {
  return prisma.seleccion.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });
}

export async function getFases(): Promise<Fase[]> {
  return prisma.fase.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });
}

export async function createResultado(
  data: ResultadoCreateInput
): Promise<Resultado> {
  const resultado = await prisma.resultado.create({
    data: {
      ...data,
      estadisticasLocal: toJsonInput(data.estadisticasLocal),
      estadisticasVisitante: toJsonInput(data.estadisticasVisitante),
      alineacionLocal: toJsonInput(data.alineacionLocal),
      alineacionVisitante: toJsonInput(data.alineacionVisitante),
      detalleGolesLocal: toJsonInput(data.detalleGolesLocal),
      detalleGolesVisitante: toJsonInput(data.detalleGolesVisitante),
    },
    include: {
      partido: {
        include: {
          fase: true,
          seleccionLocal: true,
          seleccionVisitante: true,
        },
      },
    },
  });

  return normalizeResultado(resultado as unknown as Resultado);
}

export async function updateResultado(
  partidoId: string,
  data: ResultadoUpdateInput
): Promise<Resultado> {
  const updateData: Prisma.ResultadoUpdateInput = {
    golesLocal: data.golesLocal,
    golesVisitante: data.golesVisitante,
    penalesLocal: data.penalesLocal,
    penalesVisitante: data.penalesVisitante,
    estado: data.estado,
    tiempoJuego: data.tiempoJuego,
    observaciones: data.observaciones,
  };

  if (Object.prototype.hasOwnProperty.call(data, "estadisticasLocal")) {
    updateData.estadisticasLocal = toJsonInput(data.estadisticasLocal);
  }

  if (Object.prototype.hasOwnProperty.call(data, "estadisticasVisitante")) {
    updateData.estadisticasVisitante = toJsonInput(data.estadisticasVisitante);
  }

  if (Object.prototype.hasOwnProperty.call(data, "alineacionLocal")) {
    updateData.alineacionLocal = toJsonInput(data.alineacionLocal);
  }

  if (Object.prototype.hasOwnProperty.call(data, "alineacionVisitante")) {
    updateData.alineacionVisitante = toJsonInput(data.alineacionVisitante);
  }

  if (Object.prototype.hasOwnProperty.call(data, "detalleGolesLocal")) {
    updateData.detalleGolesLocal = toJsonInput(data.detalleGolesLocal);
  }

  if (Object.prototype.hasOwnProperty.call(data, "detalleGolesVisitante")) {
    updateData.detalleGolesVisitante = toJsonInput(data.detalleGolesVisitante);
  }

  const resultado = await prisma.resultado.update({
    where: { partidoId },
    data: updateData,
    include: {
      partido: {
        include: {
          fase: true,
          seleccionLocal: true,
          seleccionVisitante: true,
        },
      },
    },
  });

  return normalizeResultado(resultado as unknown as Resultado);
}

export async function getResultadoByPartidoId(
  partidoId: string
): Promise<Resultado | null> {
  const resultado = await prisma.resultado.findUnique({
    where: { partidoId },
    include: {
      partido: {
        include: {
          fase: true,
          seleccionLocal: true,
          seleccionVisitante: true,
        },
      },
    },
  });

  return resultado ? normalizeResultado(resultado as unknown as Resultado) : null;
}

export async function getPreviousLineupForSelection(
  partidoId: string,
  seleccionId: string
): Promise<{ lineup: TeamLineup | null; partido: Partido | null }> {
  const currentPartido = await prisma.partido.findUnique({
    where: { id: partidoId },
    select: {
      id: true,
      fecha: true,
    },
  });

  if (!currentPartido) {
    return { lineup: null, partido: null };
  }

  const previousMatches = await prisma.partido.findMany({
    where: {
      id: { not: partidoId },
      activo: true,
      fecha: { lt: currentPartido.fecha },
      OR: [
        { seleccionLocalId: seleccionId },
        { seleccionVisitanteId: seleccionId },
      ],
      resultado: {
        isNot: null,
      },
    },
    include: {
      fase: true,
      seleccionLocal: true,
      seleccionVisitante: true,
      resultado: true,
    },
    orderBy: { fecha: "desc" },
    take: 10,
  });

  for (const match of previousMatches) {
    const normalized = normalizePartido(match as unknown as Partido);
    const isLocal = match.seleccionLocalId === seleccionId;
    const lineup = isLocal
      ? normalized.resultado?.alineacionLocal ?? null
      : normalized.resultado?.alineacionVisitante ?? null;

    if (lineup && (lineup.titulares.length > 0 || lineup.suplentes.length > 0)) {
      return {
        lineup,
        partido: normalized,
      };
    }
  }

  return { lineup: null, partido: null };
}

export async function listJugadoresBySeleccionId(
  seleccionId: string
): Promise<JugadorSeleccion[]> {
  return prisma.jugadorSeleccion.findMany({
    where: {
      seleccionId,
      activo: true,
    },
    orderBy: [{ posicion: "asc" }, { numero: "asc" }, { nombre: "asc" }],
  });
}

export async function listJugadoresBySeleccionIdPaginated(params: {
  seleccionId: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<{ items: JugadorSeleccion[]; total: number; pageCount: number }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize ?? 10));
  const search = params.search?.trim();

  const where: Prisma.JugadorSeleccionWhereInput = {
    seleccionId: params.seleccionId,
    activo: true,
    ...(search
      ? {
          OR: [
            { nombre: { contains: search, mode: "insensitive" } },
            { nacionalidad: { contains: search, mode: "insensitive" } },
            { posicion: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const sortByMap: Record<string, Prisma.JugadorSeleccionOrderByWithRelationInput> = {
    nombre: { nombre: params.sortDir ?? "asc" },
    numero: { numero: params.sortDir ?? "asc" },
    posicion: { posicion: params.sortDir ?? "asc" },
    edad: { edad: params.sortDir ?? "asc" },
    nacionalidad: { nacionalidad: params.sortDir ?? "asc" },
    apariciones: { apariciones: params.sortDir ?? "asc" },
    suplencias: { suplencias: params.sortDir ?? "asc" },
    goles: { goles: params.sortDir ?? "asc" },
    asistencias: { asistencias: params.sortDir ?? "asc" },
    tiros: { tiros: params.sortDir ?? "asc" },
    tirosAlArco: { tirosAlArco: params.sortDir ?? "asc" },
    faltasCometidas: { faltasCometidas: params.sortDir ?? "asc" },
    faltasSufridas: { faltasSufridas: params.sortDir ?? "asc" },
    amarillas: { amarillas: params.sortDir ?? "asc" },
    rojas: { rojas: params.sortDir ?? "asc" },
    atajadas: { atajadas: params.sortDir ?? "asc" },
    golesConcedidos: { golesConcedidos: params.sortDir ?? "asc" },
    createdAt: { createdAt: params.sortDir ?? "desc" },
  };

  const orderBy = sortByMap[params.sortBy ?? ""] ?? [{ posicion: "asc" }, { numero: "asc" }, { nombre: "asc" }];

  const [items, total] = await Promise.all([
    prisma.jugadorSeleccion.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.jugadorSeleccion.count({ where }),
  ]);

  return {
    items,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createJugadorSeleccion(
  data: JugadorSeleccionCreateInput
): Promise<JugadorSeleccion> {
  return prisma.jugadorSeleccion.create({
    data: {
      ...data,
      activo: true,
    },
  });
}

export async function replaceJugadoresSeleccion(
  seleccionId: string,
  items: JugadorSeleccionCreateInput[]
): Promise<{ cleared: number; created: JugadorSeleccion[] }> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.jugadorSeleccion.findMany({
      where: {
        seleccionId,
        activo: true,
      },
      select: {
        id: true,
      },
    });

    if (existing.length > 0) {
      await tx.jugadorSeleccion.updateMany({
        where: {
          seleccionId,
          activo: true,
        },
        data: {
          activo: false,
        },
      });
    }

    const created: JugadorSeleccion[] = [];

    for (const item of items) {
      created.push(
        await tx.jugadorSeleccion.create({
          data: {
            ...item,
            seleccionId,
            activo: true,
          },
        })
      );
    }

    return {
      cleared: existing.length,
      created,
    };
  });
}

export async function getJugadorSeleccionById(
  id: string
): Promise<JugadorSeleccion | null> {
  return prisma.jugadorSeleccion.findFirst({
    where: {
      id,
      activo: true,
    },
  });
}

export async function updateJugadorSeleccion(
  id: string,
  data: JugadorSeleccionUpdateInput
): Promise<JugadorSeleccion> {
  return prisma.jugadorSeleccion.update({
    where: { id },
    data,
  });
}

export async function deleteJugadorSeleccion(id: string): Promise<void> {
  await prisma.jugadorSeleccion.update({
    where: { id },
    data: { activo: false },
  });
}

const KNOCKOUT_PHASE_NAMES: Record<Exclude<FixturePhaseSlug, "grupos">, string> = {
  dieciseisavos: "Dieciseisavos de Final",
  octavos: "Octavos de Final",
  cuartos: "Cuartos de Final",
  semis: "Semifinal",
  "tercer-puesto": "Tercer Puesto",
  final: "Final",
};

type ResolvedSelection = {
  seleccionId: string;
  nombre: string;
};

function normalizeCruceText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseRuleOrigin(raw: string):
  | { type: "position"; position: number; groups: string[] }
  | { type: "winner"; partidoNumero: number }
  | { type: "loser"; partidoNumero: number }
  | { type: "unknown" } {
  const normalized = raw.trim();

  const positionMatch = normalized.match(
    /^([1-3])(?:º|°|Âº)?\s*Grupo\s+([A-Z](?:\/[A-Z])*)$/i
  );
  if (positionMatch) {
    return {
      type: "position",
      position: Number(positionMatch[1]),
      groups: positionMatch[2].split("/").map((group) => group.toUpperCase()),
    };
  }

  const winnerMatch = normalized.match(/^Ganador Partido (\d+)$/i);
  if (winnerMatch) {
    return { type: "winner", partidoNumero: Number(winnerMatch[1]) };
  }

  const loserMatch = normalized.match(/^Perdedor Partido (\d+)$/i);
  if (loserMatch) {
    return { type: "loser", partidoNumero: Number(loserMatch[1]) };
  }

  return { type: "unknown" };
}

function sortThirdPlaceCandidates(a: PosicionEquipo, b: PosicionEquipo) {
  if (b.puntos !== a.puntos) return b.puntos - a.puntos;
  if (b.diferencial !== a.diferencial) return b.diferencial - a.diferencial;
  if (b.golesAFavor !== a.golesAFavor) return b.golesAFavor - a.golesAFavor;
  return a.nombre.localeCompare(b.nombre);
}

function resolveFromPositions(
  raw: string,
  tabla: PosicionEquipo[]
): ResolvedSelection | null {
  const parsed = parseRuleOrigin(raw);
  if (parsed.type !== "position") return null;

  const candidates = tabla.filter(
    (item) =>
      item.posicion === parsed.position &&
      item.grupo &&
      parsed.groups.includes(item.grupo.toUpperCase())
  );

  if (candidates.length === 0) return null;

  const selected =
    parsed.position === 3 && parsed.groups.length > 1
      ? [...candidates].sort(sortThirdPlaceCandidates)[0]
      : candidates.find(
          (item) => item.grupo && item.grupo.toUpperCase() === parsed.groups[0]
        ) ?? candidates[0];

  if (!selected) return null;

  return {
    seleccionId: selected.seleccionId,
    nombre: selected.nombre,
  };
}

function resolveFromMatchResult(
  raw: string,
  partidosByNumero: Map<number, Partido>
): ResolvedSelection | null {
  const parsed = parseRuleOrigin(raw);
  if (parsed.type !== "winner" && parsed.type !== "loser") return null;

  const partido = partidosByNumero.get(parsed.partidoNumero);
  const resultado = partido?.resultado;

  if (!partido || !resultado || resultado.estado !== "FINALIZADO") {
    return null;
  }

  const localWon =
    resultado.golesLocal > resultado.golesVisitante ||
    (resultado.golesLocal === resultado.golesVisitante &&
      (resultado.penalesLocal ?? -1) > (resultado.penalesVisitante ?? -1));
  const visitanteWon =
    resultado.golesVisitante > resultado.golesLocal ||
    (resultado.golesVisitante === resultado.golesLocal &&
      (resultado.penalesVisitante ?? -1) > (resultado.penalesLocal ?? -1));

  if (!localWon && !visitanteWon) {
    return null;
  }

  const winner = localWon
    ? {
        seleccionId: partido.seleccionLocalId,
        nombre: partido.seleccionLocal?.nombre ?? "Local",
      }
    : {
        seleccionId: partido.seleccionVisitanteId,
        nombre: partido.seleccionVisitante?.nombre ?? "Visitante",
      };

  const loser = localWon
    ? {
        seleccionId: partido.seleccionVisitanteId,
        nombre: partido.seleccionVisitante?.nombre ?? "Visitante",
      }
    : {
        seleccionId: partido.seleccionLocalId,
        nombre: partido.seleccionLocal?.nombre ?? "Local",
      };

  return parsed.type === "winner" ? winner : loser;
}

export async function generateKnockoutPartidosForPhase(
  phaseSlug: Exclude<FixturePhaseSlug, "grupos">
) {
  const phaseName = KNOCKOUT_PHASE_NAMES[phaseSlug];
  const targetPhase = await prisma.fase.findFirst({
    where: { nombre: phaseName, activo: true },
  });

  if (!targetPhase) {
    throw new Error(`No se encontró la fase ${phaseName}`);
  }

  const [reglas, allPartidos, selecciones] = await Promise.all([
    prisma.reglaCruce.findMany({
      where: {
        activo: true,
        faseId: targetPhase.id,
      },
      include: { fase: true },
      orderBy: [{ orden: "asc" }, { partidoNumero: "asc" }],
    }),
    prisma.partido.findMany({
      where: { activo: true },
      include: {
        fase: true,
        seleccionLocal: true,
        seleccionVisitante: true,
        resultado: true,
      },
      orderBy: [{ fecha: "asc" }, { createdAt: "asc" }],
    }),
    prisma.seleccion.findMany({
      where: { activo: true },
    }),
  ]);

  const tabla = calcularTablaPosiciones(
    allPartidos.filter(
      (partido) =>
        normalizeCruceText(partido.fase?.nombre) ===
        normalizeCruceText("Fase de Grupos")
    ) as unknown as Partido[],
    selecciones as Seleccion[]
  );

  const knockoutPhaseNames = new Set(Object.values(KNOCKOUT_PHASE_NAMES));
  const activeKnockoutMatches = allPartidos.filter((partido) =>
    knockoutPhaseNames.has(partido.fase?.nombre ?? "")
  ) as unknown as Partido[];

  const previousRules = await prisma.reglaCruce.findMany({
    where: { activo: true },
    include: { fase: true },
    orderBy: [{ orden: "asc" }, { partidoNumero: "asc" }],
  });

  const existingByRuleNumber = new Map<number, Partido>();

  for (const rule of previousRules) {
    const phaseMatches = activeKnockoutMatches
      .filter((partido) => partido.faseId === rule.faseId)
      .sort(
        (a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime() ||
          a.createdAt.getTime() - b.createdAt.getTime()
      );

    const phaseRules = previousRules.filter((item) => item.faseId === rule.faseId);
    phaseRules.forEach((phaseRule, index) => {
      const partido = phaseMatches[index];
      if (partido) {
        existingByRuleNumber.set(phaseRule.partidoNumero, partido);
      }
    });
  }

  const generatedPayloads = reglas
    .map((regla) => {
      const local =
        resolveFromPositions(regla.localOrigen, tabla) ??
        resolveFromMatchResult(regla.localOrigen, existingByRuleNumber);
      const visitante =
        resolveFromPositions(regla.visitanteOrigen, tabla) ??
        resolveFromMatchResult(regla.visitanteOrigen, existingByRuleNumber);

      if (!local || !visitante) {
        return null;
      }

      return {
        regla,
        data: {
          fecha: regla.fecha ?? new Date(),
          estadio: regla.estadio ?? null,
          ciudad: null,
          faseId: targetPhase.id,
          seleccionLocalId: local.seleccionId,
          seleccionVisitanteId: visitante.seleccionId,
          footballDataId: null,
        },
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const currentPhaseMatches = activeKnockoutMatches
    .filter((partido) => partido.faseId === targetPhase.id)
    .sort(
      (a, b) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime() ||
        a.createdAt.getTime() - b.createdAt.getTime()
    );

  const updated: Partido[] = [];

  await prisma.$transaction(async (tx) => {
    for (let index = 0; index < generatedPayloads.length; index += 1) {
      const payload = generatedPayloads[index];
      const existing = currentPhaseMatches[index];

      if (existing) {
        const partido = await tx.partido.update({
          where: { id: existing.id },
          data: payload.data,
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        });
        updated.push(normalizePartido(partido as unknown as Partido));
      } else {
        const partido = await tx.partido.create({
          data: {
            ...payload.data,
            activo: true,
          },
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        });
        updated.push(normalizePartido(partido as unknown as Partido));
      }
    }

    const extras = currentPhaseMatches.slice(generatedPayloads.length);
    for (const extra of extras) {
      await tx.partido.update({
        where: { id: extra.id },
        data: { activo: false },
      });
    }
  });

  return {
    generated: updated,
    generatedCount: updated.length,
    skippedCount: reglas.length - updated.length,
    phaseName,
  };
}
