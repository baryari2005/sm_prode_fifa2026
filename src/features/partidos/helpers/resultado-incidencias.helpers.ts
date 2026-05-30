import type {
  GoalDetail,
  MatchIncident,
  TeamLineup,
  TeamStats,
} from "@/features/partidos/types/fixture-details";
import type { Resultado } from "@/features/partidos/types/types";

function createIncidentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `incident-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildGoalIncidenciasFromLegacy(
  goals: GoalDetail[] | null | undefined,
  equipo: "local" | "visitante"
): MatchIncident[] {
  return (goals ?? []).map((goal, index) => ({
    id: `${equipo}-gol-${goal.jugadorId}-${goal.minuto}-${index}`,
    tipo: "gol",
    minuto: goal.minuto,
    equipo,
    jugadorId: goal.jugadorId,
    jugadorNombre: goal.nombre,
    descripcion: goal.penal ? "Gol de penal" : "Gol convertido",
    penal: goal.penal,
    createdAt: null,
  }));
}

export function buildIncidenciasFromResultado(resultado: Resultado | null): MatchIncident[] {
  if (resultado?.incidencias?.length) {
    return resultado.incidencias;
  }

  if (!resultado) {
    return [];
  }

  return [
    ...buildGoalIncidenciasFromLegacy(resultado.detalleGolesLocal, "local"),
    ...buildGoalIncidenciasFromLegacy(resultado.detalleGolesVisitante, "visitante"),
  ].sort((a, b) => a.minuto - b.minuto);
}

function cloneLineup(lineup: TeamLineup): TeamLineup {
  return {
    ...lineup,
    titulares: lineup.titulares.map((player) => ({
      ...player,
      goals: 0,
      yellow: false,
      red: false,
      substituted: false,
    })),
    suplentes: lineup.suplentes.map((player) => ({
      ...player,
      goals: 0,
      yellow: false,
      red: false,
      substituted: false,
    })),
  };
}

function updatePlayerInLineup(
  lineup: TeamLineup,
  jugadorId: string | null | undefined,
  updater: (player: TeamLineup["titulares"][number]) => TeamLineup["titulares"][number]
) {
  if (!jugadorId) return lineup;

  const updatePlayers = (players: TeamLineup["titulares"]) =>
    players.map((player) => (player.jugadorId === jugadorId ? updater(player) : player));

  return {
    ...lineup,
    titulares: updatePlayers(lineup.titulares),
    suplentes: updatePlayers(lineup.suplentes),
  };
}

export function deriveResultadoFieldsFromIncidencias(params: {
  incidencias: MatchIncident[];
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  estadisticasLocal: TeamStats;
  estadisticasVisitante: TeamStats;
}) {
  const detalleGolesLocal: GoalDetail[] = [];
  const detalleGolesVisitante: GoalDetail[] = [];

  let alineacionLocal = cloneLineup(params.alineacionLocal);
  let alineacionVisitante = cloneLineup(params.alineacionVisitante);

  const estadisticasLocal: TeamStats = {
    ...params.estadisticasLocal,
    yellowCards: 0,
    redCards: 0,
  };
  const estadisticasVisitante: TeamStats = {
    ...params.estadisticasVisitante,
    yellowCards: 0,
    redCards: 0,
  };

  for (const incidencia of params.incidencias) {
    if (incidencia.tipo === "gol" && incidencia.equipo !== "general" && incidencia.jugadorId) {
      const detail: GoalDetail = {
        jugadorId: incidencia.jugadorId,
        nombre: incidencia.jugadorNombre ?? "Jugador",
        minuto: incidencia.minuto,
        penal: Boolean(incidencia.penal),
      };

      if (incidencia.equipo === "local") {
        detalleGolesLocal.push(detail);
        alineacionLocal = updatePlayerInLineup(alineacionLocal, incidencia.jugadorId, (player) => ({
          ...player,
          goals: (player.goals ?? 0) + 1,
        }));
      } else {
        detalleGolesVisitante.push(detail);
        alineacionVisitante = updatePlayerInLineup(alineacionVisitante, incidencia.jugadorId, (player) => ({
          ...player,
          goals: (player.goals ?? 0) + 1,
        }));
      }
    }

    if (incidencia.tipo === "tarjeta_amarilla" && incidencia.equipo !== "general") {
      if (incidencia.equipo === "local") {
        estadisticasLocal.yellowCards += 1;
        alineacionLocal = updatePlayerInLineup(alineacionLocal, incidencia.jugadorId, (player) => ({
          ...player,
          yellow: true,
        }));
      } else {
        estadisticasVisitante.yellowCards += 1;
        alineacionVisitante = updatePlayerInLineup(alineacionVisitante, incidencia.jugadorId, (player) => ({
          ...player,
          yellow: true,
        }));
      }
    }

    if (incidencia.tipo === "tarjeta_roja" && incidencia.equipo !== "general") {
      if (incidencia.equipo === "local") {
        estadisticasLocal.redCards += 1;
        alineacionLocal = updatePlayerInLineup(alineacionLocal, incidencia.jugadorId, (player) => ({
          ...player,
          red: true,
        }));
      } else {
        estadisticasVisitante.redCards += 1;
        alineacionVisitante = updatePlayerInLineup(alineacionVisitante, incidencia.jugadorId, (player) => ({
          ...player,
          red: true,
        }));
      }
    }

    if (incidencia.tipo === "cambio" && incidencia.equipo !== "general") {
      if (incidencia.equipo === "local") {
        alineacionLocal = updatePlayerInLineup(alineacionLocal, incidencia.jugadorSaleId, (player) => ({
          ...player,
          substituted: true,
        }));
      } else {
        alineacionVisitante = updatePlayerInLineup(alineacionVisitante, incidencia.jugadorSaleId, (player) => ({
          ...player,
          substituted: true,
        }));
      }
    }
  }

  return {
    incidencias: params.incidencias,
    detalleGolesLocal: detalleGolesLocal.sort((a, b) => a.minuto - b.minuto),
    detalleGolesVisitante: detalleGolesVisitante.sort((a, b) => a.minuto - b.minuto),
    golesLocal: detalleGolesLocal.length,
    golesVisitante: detalleGolesVisitante.length,
    alineacionLocal,
    alineacionVisitante,
    estadisticasLocal,
    estadisticasVisitante,
  };
}

export function createMatchIncident(input: Omit<MatchIncident, "id" | "createdAt">): MatchIncident {
  return {
    ...input,
    id: createIncidentId(),
    createdAt: new Date().toISOString(),
  };
}
