import { applyAutoStarterPositions, createLineupPlayer } from "@/features/partidos/helpers/lineup-editor.helpers";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

export type QuickFormationGroup = {
  id: string;
  label: string;
  count: number;
  startIndex: number;
};

export type QuickLineupRole = "arquero" | "defensa" | "mediocampo" | "delantero" | "otro";

const GROUP_LABELS = ["Arquero", "Defensas", "Mediocampistas", "Delanteros", "Linea extra"];
const GOALKEEPER_CODES = new Set(["a", "arq", "gk", "por", "pt"]);
const DEFENDER_CODES = new Set([
  "d",
  "df",
  "def",
  "zc",
  "li",
  "ld",
  "lateral",
  "lateralizquierdo",
  "lateralderecho",
  "defensacentral",
  "defensorcentral",
  "carrilero",
  "carrileroizquierdo",
  "carrileroderecho",
]);
const MIDFIELDER_CODES = new Set([
  "m",
  "mc",
  "md",
  "mi",
  "mcd",
  "mco",
  "mf",
  "vol",
  "volante",
  "volantecentral",
  "volanteizquierdo",
  "volantederecho",
  "int",
  "interior",
]);
const FORWARD_CODES = new Set([
  "f",
  "fw",
  "cf",
  "dl",
  "dc",
  "sd",
  "ei",
  "ed",
  "ext",
  "extremo",
  "extremoizquierdo",
  "extremoderecho",
  "punta",
  "delanterocentro",
]);

function normalizeText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function resolveQuickLineupRole(posicion?: string | null): QuickLineupRole {
  const normalized = normalizeText(posicion);
  const compact = normalized.replace(/[.\-_/]/g, " ").replace(/\s+/g, " ").trim();
  const compactNoSpace = compact.replace(/\s+/g, "");

  if (
    GOALKEEPER_CODES.has(compact) ||
    GOALKEEPER_CODES.has(compactNoSpace) ||
    normalized.includes("arquero") ||
    normalized.includes("portero") ||
    normalized.includes("goalkeeper")
  ) {
    return "arquero";
  }

  if (
    DEFENDER_CODES.has(compact) ||
    DEFENDER_CODES.has(compactNoSpace) ||
    compact.startsWith("df") ||
    compact.startsWith("def") ||
    normalized.includes("def") ||
    normalized.includes("central") ||
    normalized.includes("lateral")
  ) {
    return "defensa";
  }

  if (
    MIDFIELDER_CODES.has(compact) ||
    MIDFIELDER_CODES.has(compactNoSpace) ||
    compact.startsWith("mc") ||
    compact.startsWith("md") ||
    compact.startsWith("mi") ||
    compact.startsWith("mcd") ||
    compact.startsWith("mco") ||
    normalized.includes("medio") ||
    normalized.includes("volante") ||
    normalized.includes("interior") ||
    normalized.includes("medioc")
  ) {
    return "mediocampo";
  }

  if (
    FORWARD_CODES.has(compact) ||
    FORWARD_CODES.has(compactNoSpace) ||
    compact.startsWith("dl") ||
    compact.startsWith("dc") ||
    compact.startsWith("sd") ||
    compact.startsWith("ei") ||
    compact.startsWith("ed") ||
    normalized.includes("del") ||
    normalized.includes("punta") ||
    normalized.includes("extremo") ||
    normalized.includes("wing") ||
    normalized.includes("ata")
  ) {
    return "delantero";
  }

  return "otro";
}

export function resolveExpectedRoleForGroup(group: QuickFormationGroup): QuickLineupRole {
  switch (group.startIndex) {
    case 0:
      return "arquero";
    case 1:
      return "defensa";
    default:
      if (group.label.toLowerCase().includes("medi")) return "mediocampo";
      if (group.label.toLowerCase().includes("del")) return "delantero";
      return "otro";
  }
}

export function buildQuickFormationGroups(formation?: string | null): QuickFormationGroup[] {
  if (!formation) {
    return [];
  }

  const parts = formation
    .split("-")
    .map((item) => Number(item.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (parts.length === 0) {
    return [];
  }

  const normalized = parts.reduce((sum, value) => sum + value, 0) === 10 ? [1, ...parts] : parts;
  let offset = 0;

  return normalized.map((count, index) => {
    const group: QuickFormationGroup = {
      id: `group-${index}`,
      label: GROUP_LABELS[index] ?? `Linea ${index + 1}`,
      count,
      startIndex: offset,
    };

    offset += count;
    return group;
  });
}

export function isQuickFormationValid(formation?: string | null) {
  return buildQuickFormationGroups(formation).reduce((sum, group) => sum + group.count, 0) === 11;
}

export function buildAssignmentsFromLineup(
  lineup: TeamLineup,
  groups: QuickFormationGroup[],
) {
  return Object.fromEntries(
    groups.map((group) => [
      group.id,
      lineup.titulares
        .slice(group.startIndex, group.startIndex + group.count)
        .map((player) => player.jugadorId),
    ]),
  ) as Record<string, string[]>;
}

export function buildLineupFromQuickAssignments(params: {
  formation: string;
  entrenador: string;
  squad: JugadorSeleccion[];
  assignments: Record<string, string[]>;
  groups: QuickFormationGroup[];
}) {
  const orderedStarterIds = params.groups.flatMap((group) =>
    (params.assignments[group.id] ?? []).slice(0, group.count),
  );

  const starters = orderedStarterIds
    .map((playerId) => params.squad.find((player) => player.id === playerId) ?? null)
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
