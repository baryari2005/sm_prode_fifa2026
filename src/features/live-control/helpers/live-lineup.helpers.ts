import { applyAutoStarterPositions, createLineupPlayer } from "@/features/partidos/helpers/lineup-editor.helpers";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

export type FormationSlot = {
  id: string;
  lineIndex: number;
  slotIndex: number;
  label: string;
};

const FORMATION_LABELS = {
  0: "Arquero",
  1: "Defensa",
  2: "Mediocampo",
  3: "Ataque",
  4: "Ataque",
} as const;

export function buildFormationSlots(formation: string): FormationSlot[] {
  const parts = formation
    .split("-")
    .map((item) => Number(item.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (parts.length === 0) {
    return [];
  }

  const normalizedRows =
    parts.reduce((sum, current) => sum + current, 0) === 10 ? [1, ...parts] : parts;

  return normalizedRows.flatMap((count, lineIndex) =>
    Array.from({ length: count }, (_, slotIndex) => ({
      id: `${lineIndex}-${slotIndex}`,
      lineIndex,
      slotIndex,
      label:
        lineIndex === 0
          ? "Arquero"
          : `${FORMATION_LABELS[lineIndex as keyof typeof FORMATION_LABELS] ?? "Linea"} ${slotIndex + 1}`,
    })),
  );
}

export function buildSuggestedLineupFromSlots(params: {
  formation: string;
  slotAssignments: Record<string, string>;
  squad: JugadorSeleccion[];
  entrenador: string;
}): TeamLineup {
  const slots = buildFormationSlots(params.formation);
  const usedPlayerIds = new Set<string>();
  const starters = slots
    .map((slot) => {
      const playerId = params.slotAssignments[slot.id];

      if (!playerId || usedPlayerIds.has(playerId)) {
        return null;
      }

      const player = params.squad.find((item) => item.id === playerId) ?? null;

      if (player) {
        usedPlayerIds.add(player.id);
      }

      return player;
    })
    .filter((player): player is JugadorSeleccion => Boolean(player))
    .map((player) => createLineupPlayer(player, "titulares"));

  const starterIds = new Set(starters.map((player) => player.jugadorId));
  const substitutes = params.squad
    .filter((player) => !starterIds.has(player.id))
    .map((player) => createLineupPlayer(player, "suplentes"));

  return {
    formacion: params.formation,
    entrenador: params.entrenador,
    titulares: applyAutoStarterPositions(starters, params.formation),
    suplentes: substitutes,
  };
}

export function isValidFormation(formation: string) {
  const slots = buildFormationSlots(formation);
  return slots.length === 11;
}
