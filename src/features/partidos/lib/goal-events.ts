import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

export type GoalCelebrationEvent = {
  id: string;
  partidoId: string;
  kind: "GOAL" | "KICKOFF" | "HALFTIME" | "FINAL";
  equipo?: "LOCAL" | "VISITANTE";
  seleccionNombre?: string;
  bandera?: string | null;
  codigo?: string | null;
  golesAntes?: number;
  golesAhora?: number;
  cantidadGolesNuevos?: number;
  localNombre: string;
  visitanteNombre: string;
  localBandera?: string | null;
  localCodigo?: string | null;
  visitanteBandera?: string | null;
  visitanteCodigo?: string | null;
};

function getSafeGoals(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function buildGoalEvent(
  partido: PartidoConRelaciones,
  equipo: "LOCAL" | "VISITANTE",
  golesAntes: number,
  golesAhora: number,
): GoalCelebrationEvent {
  const seleccion =
    equipo === "LOCAL" ? partido.seleccionLocal : partido.seleccionVisitante;

  return {
    id: `${partido.id}:GOAL:${equipo}:${golesAhora}`,
    partidoId: partido.id,
    kind: "GOAL",
    equipo,
    seleccionNombre:
      seleccion?.nombre ?? (equipo === "LOCAL" ? "Local" : "Visitante"),
    bandera: seleccion?.bandera ?? null,
    codigo: seleccion?.codigo ?? null,
    golesAntes,
    golesAhora,
    cantidadGolesNuevos: golesAhora - golesAntes,
    localNombre: partido.seleccionLocal?.nombre ?? "Local",
    visitanteNombre: partido.seleccionVisitante?.nombre ?? "Visitante",
    localBandera: partido.seleccionLocal?.bandera ?? null,
    localCodigo: partido.seleccionLocal?.codigo ?? null,
    visitanteBandera: partido.seleccionVisitante?.bandera ?? null,
    visitanteCodigo: partido.seleccionVisitante?.codigo ?? null,
  };
}

function buildStateEvent(
  partido: PartidoConRelaciones,
  kind: "KICKOFF" | "HALFTIME" | "FINAL",
): GoalCelebrationEvent {
  return {
    id: `${partido.id}:${kind}`,
    partidoId: partido.id,
    kind,
    localNombre: partido.seleccionLocal?.nombre ?? "Local",
    visitanteNombre: partido.seleccionVisitante?.nombre ?? "Visitante",
    localBandera: partido.seleccionLocal?.bandera ?? null,
    localCodigo: partido.seleccionLocal?.codigo ?? null,
    visitanteBandera: partido.seleccionVisitante?.bandera ?? null,
    visitanteCodigo: partido.seleccionVisitante?.codigo ?? null,
  };
}

export function detectGoalEvents(
  previousPartidos: PartidoConRelaciones[],
  nextPartidos: PartidoConRelaciones[],
): GoalCelebrationEvent[] {
  if (previousPartidos.length === 0 || nextPartidos.length === 0) {
    return [];
  }

  const previousById = new Map(
    previousPartidos.map((partido) => [partido.id, partido] as const),
  );

  const events: GoalCelebrationEvent[] = [];

  nextPartidos.forEach((partido) => {
    const previous = previousById.get(partido.id);

    if (!previous || !partido.resultado) {
      return;
    }

    const previousEstado = previous.resultado?.estado ?? null;
    const nextEstado = partido.resultado?.estado ?? null;
    const previousTiempoJuego = getSafeGoals(previous.resultado?.tiempoJuego);
    const nextTiempoJuego = getSafeGoals(partido.resultado?.tiempoJuego);

    if (previousEstado !== "EN_JUEGO" && nextEstado === "EN_JUEGO") {
      events.push(buildStateEvent(partido, "KICKOFF"));
    }

    if (
      (nextEstado === "ENTRETIEMPO" && previousEstado !== "ENTRETIEMPO") ||
      (nextEstado === "EN_JUEGO" &&
        previousTiempoJuego < 45 &&
        nextTiempoJuego >= 45)
    ) {
      events.push(buildStateEvent(partido, "HALFTIME"));
    }

    if (previousEstado !== "FINALIZADO" && nextEstado === "FINALIZADO") {
      events.push(buildStateEvent(partido, "FINAL"));
    }

    if (!previous.resultado) {
      return;
    }

    const golesLocalAntes = getSafeGoals(previous.resultado.golesLocal);
    const golesLocalAhora = getSafeGoals(partido.resultado.golesLocal);
    const golesVisitanteAntes = getSafeGoals(previous.resultado.golesVisitante);
    const golesVisitanteAhora = getSafeGoals(partido.resultado.golesVisitante);

    if (golesLocalAhora > golesLocalAntes) {
      events.push(
        buildGoalEvent(partido, "LOCAL", golesLocalAntes, golesLocalAhora),
      );
    }

    if (golesVisitanteAhora > golesVisitanteAntes) {
      events.push(
        buildGoalEvent(
          partido,
          "VISITANTE",
          golesVisitanteAntes,
          golesVisitanteAhora,
        ),
      );
    }
  });

  return events;
}
