import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

import { buildAutoLineupPositions } from "@/features/partidos/lib/lineup-layout";

export type LineupGroup = "titulares" | "suplentes";

export type LineupPlayer = TeamLineup["titulares"][number];

export const MAX_STARTERS = 11;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function canAddStarter(currentStartersCount: number) {
  return currentStartersCount < MAX_STARTERS;
}

export function createLineupPlayer(
  player: JugadorSeleccion,
  type: LineupGroup
): LineupPlayer {
  return {
    jugadorId: player.id,
    nombre: player.nombre,
    numero: player.numero,
    posicion: player.posicion,
    x: type === "titulares" ? 50 : null,
    y: type === "titulares" ? 50 : null,
    goals: 0,
    yellow: false,
    red: false,
    substituted: false,
  };
}

export function applyAutoStarterPositions(
  players: LineupPlayer[],
  formation: string
): LineupPlayer[] {
  return buildAutoLineupPositions(players, formation, "top").map(
    ({ x, y, ...playerData }) => ({
      ...playerData,
      x,
      y,
    })
  );
}

export function reorderLineupPlayers(
  players: LineupPlayer[],
  draggedId: string,
  targetId: string,
  formation: string
): LineupPlayer[] {
  if (!draggedId || draggedId === targetId) {
    return players;
  }

  const current = [...players];

  const fromIndex = current.findIndex(
    (player) => player.jugadorId === draggedId
  );

  const toIndex = current.findIndex(
    (player) => player.jugadorId === targetId
  );

  if (fromIndex === -1 || toIndex === -1) {
    return players;
  }

  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);

  return applyAutoStarterPositions(current, formation);
}