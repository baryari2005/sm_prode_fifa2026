import { EstadoPartido } from "@prisma/client";

import {
  DEFAULT_TEAM_LINEUP,
  DEFAULT_TEAM_STATS,
} from "@/features/partidos/types/fixture-details";

import type {
  TeamLineup,
} from "@/features/partidos/types/fixture-details";

import type { Resultado } from "@/features/partidos/types/types";

import type {
  LineupSummary,
  ResultadoFormState,
  ResultadoSide,
} from "@/features/partidos/types/resultado-manual.types";

export function createInitialState(
  resultado: Resultado | null
): ResultadoFormState {
  return {
    golesLocal: resultado?.golesLocal ?? 0,
    golesVisitante: resultado?.golesVisitante ?? 0,

    penalesLocal:
      resultado?.penalesLocal === null || resultado?.penalesLocal === undefined
        ? ""
        : String(resultado.penalesLocal),

    penalesVisitante:
      resultado?.penalesVisitante === null ||
      resultado?.penalesVisitante === undefined
        ? ""
        : String(resultado.penalesVisitante),

    estado: resultado?.estado ?? EstadoPartido.PENDIENTE,

    tiempoJuego:
      resultado?.tiempoJuego === null || resultado?.tiempoJuego === undefined
        ? ""
        : String(resultado.tiempoJuego),

    observaciones: resultado?.observaciones ?? "",

    estadisticasLocal: resultado?.estadisticasLocal ?? {
      ...DEFAULT_TEAM_STATS,
    },

    estadisticasVisitante: resultado?.estadisticasVisitante ?? {
      ...DEFAULT_TEAM_STATS,
    },

    alineacionLocal: resultado?.alineacionLocal ?? {
      ...DEFAULT_TEAM_LINEUP,
      titulares: [],
      suplentes: [],
    },

    alineacionVisitante: resultado?.alineacionVisitante ?? {
      ...DEFAULT_TEAM_LINEUP,
      titulares: [],
      suplentes: [],
    },

    detalleGolesLocal: resultado?.detalleGolesLocal ?? [],
    detalleGolesVisitante: resultado?.detalleGolesVisitante ?? [],
  };
}

export function summarizeLineup(lineup: TeamLineup): LineupSummary {
  const allPlayers = [...lineup.titulares, ...lineup.suplentes];

  return allPlayers.reduce<LineupSummary>(
    (acc, player) => ({
      goals: acc.goals + (player.goals ?? 0),
      yellowCards: acc.yellowCards + (player.yellow ? 1 : 0),
      redCards: acc.redCards + (player.red ? 1 : 0),
    }),
    {
      goals: 0,
      yellowCards: 0,
      redCards: 0,
    }
  );
}

export function applyLineupTotals(
  current: ResultadoFormState,
  side: ResultadoSide,
  lineup: TeamLineup
): ResultadoFormState {
  const summary = summarizeLineup(lineup);

  if (side === "local") {
    return {
      ...current,
      golesLocal: summary.goals,
      alineacionLocal: lineup,
      estadisticasLocal: {
        ...current.estadisticasLocal,
        yellowCards: summary.yellowCards,
        redCards: summary.redCards,
      },
    };
  }

  return {
    ...current,
    golesVisitante: summary.goals,
    alineacionVisitante: lineup,
    estadisticasVisitante: {
      ...current.estadisticasVisitante,
      yellowCards: summary.yellowCards,
      redCards: summary.redCards,
    },
  };
}