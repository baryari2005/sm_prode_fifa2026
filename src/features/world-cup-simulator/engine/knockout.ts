import {
  resolveThirdPlaceAssignments,
  type ThirdPlaceAssignment,
} from "./thirdPlaceCombinations";
import type {
  KnockoutMatch,
  KnockoutRound,
  QualifiedTeams,
  TeamStanding,
} from "./types";

type Round32Template = {
  id: string;
  orden: number;
  fifaMatchNumber: string;
  localRef: string;
  visitanteRef: string;
};

const ROUND_OF_32_TEMPLATE: Round32Template[] = [
  { id: "R32-1", orden: 1, fifaMatchNumber: "73", localRef: "2A", visitanteRef: "2B" },
  { id: "R32-2", orden: 2, fifaMatchNumber: "74", localRef: "1E", visitanteRef: "3A/B/C/D/F" },
  { id: "R32-3", orden: 3, fifaMatchNumber: "75", localRef: "1F", visitanteRef: "2C" },
  { id: "R32-4", orden: 4, fifaMatchNumber: "76", localRef: "1C", visitanteRef: "2F" },
  { id: "R32-5", orden: 5, fifaMatchNumber: "77", localRef: "1I", visitanteRef: "3C/D/F/G/H" },
  { id: "R32-6", orden: 6, fifaMatchNumber: "78", localRef: "2E", visitanteRef: "2I" },
  { id: "R32-7", orden: 7, fifaMatchNumber: "79", localRef: "1A", visitanteRef: "3C/E/F/H/I" },
  { id: "R32-8", orden: 8, fifaMatchNumber: "80", localRef: "1L", visitanteRef: "3E/H/I/J/K" },
  { id: "R32-9", orden: 9, fifaMatchNumber: "81", localRef: "1D", visitanteRef: "3B/E/F/I/J" },
  { id: "R32-10", orden: 10, fifaMatchNumber: "82", localRef: "1G", visitanteRef: "3A/E/H/I/J" },
  { id: "R32-11", orden: 11, fifaMatchNumber: "83", localRef: "2K", visitanteRef: "2L" },
  { id: "R32-12", orden: 12, fifaMatchNumber: "84", localRef: "1H", visitanteRef: "2J" },
  { id: "R32-13", orden: 13, fifaMatchNumber: "85", localRef: "1B", visitanteRef: "3E/F/G/I/J" },
  { id: "R32-14", orden: 14, fifaMatchNumber: "86", localRef: "1J", visitanteRef: "2H" },
  { id: "R32-15", orden: 15, fifaMatchNumber: "87", localRef: "1K", visitanteRef: "3D/E/I/J/L" },
  { id: "R32-16", orden: 16, fifaMatchNumber: "88", localRef: "2D", visitanteRef: "2G" },
];

export function getRoundLabel(ronda: KnockoutRound) {
  switch (ronda) {
    case "ROUND_OF_32":
      return "32avos";
    case "ROUND_OF_16":
      return "Octavos";
    case "QUARTER_FINAL":
      return "Cuartos";
    case "SEMI_FINAL":
      return "Semifinal";
    case "THIRD_PLACE":
      return "Tercer puesto";
    case "FINAL":
      return "Final";
  }
}

function findByRef(ref: string, qualifiedTeams: QualifiedTeams) {
  const position = Number(ref[0]);
  const group = ref.slice(1).toUpperCase();

  if (position === 1) {
    return qualifiedTeams.primeros.find((team) => team.grupo === group) ?? null;
  }

  if (position === 2) {
    return qualifiedTeams.segundos.find((team) => team.grupo === group) ?? null;
  }

  if (position === 3) {
    return qualifiedTeams.mejoresTerceros.find((team) => team.grupo === group) ?? null;
  }

  return null;
}

function resolveThirdPlaceRef(
  ref: string,
  qualifiedTeams: QualifiedTeams,
  assignments: ThirdPlaceAssignment | null,
) {
  const possibleGroups = ref
    .replace(/^3/i, "")
    .split("/")
    .map((group) => group.toUpperCase());

  const fifaMatchNumber = ROUND_OF_32_TEMPLATE.find((item) => item.visitanteRef === ref)?.fifaMatchNumber;
  const chosenGroup = fifaMatchNumber
    ? assignments?.[fifaMatchNumber as keyof ThirdPlaceAssignment]
    : undefined;

  if (chosenGroup) {
    return findByRef(`3${chosenGroup}`, qualifiedTeams);
  }

  if (possibleGroups.length === 1) {
    return findByRef(`3${possibleGroups[0]}`, qualifiedTeams);
  }

  return null;
}

export function getCombinationKey(mejoresTerceros: TeamStanding[]) {
  return mejoresTerceros
    .map((team) => team.grupo)
    .sort()
    .join("-");
}

export function generarCruces32avos(qualifiedTeams: QualifiedTeams): KnockoutMatch[] {
  const assignments = resolveThirdPlaceAssignments(
    qualifiedTeams.mejoresTerceros.map((team) => team.grupo).sort(),
  );

  return ROUND_OF_32_TEMPLATE.map((template) => {
    const localTeam = findByRef(template.localRef, qualifiedTeams);
    const visitanteTeam = template.visitanteRef.startsWith("3")
      ? resolveThirdPlaceRef(template.visitanteRef, qualifiedTeams, assignments)
      : findByRef(template.visitanteRef, qualifiedTeams);

    return {
      id: template.id,
      ronda: "ROUND_OF_32",
      orden: template.orden,
      local: { slot: template.localRef, team: localTeam },
      visitante: { slot: template.visitanteRef, team: visitanteTeam },
      golesLocal: null,
      golesVisitante: null,
      penaltyWinner: null,
      ganador: null,
    };
  });
}

export function getWinner(match: KnockoutMatch) {
  if (!match.local.team || !match.visitante.team) return null;
  if (match.golesLocal == null || match.golesVisitante == null) return null;

  if (match.golesLocal > match.golesVisitante) return match.local.team;
  if (match.golesVisitante > match.golesLocal) return match.visitante.team;
  if (match.penaltyWinner === "local") return match.local.team;
  if (match.penaltyWinner === "visitante") return match.visitante.team;

  return null;
}

export function getLoser(match: KnockoutMatch) {
  const winner = getWinner(match);

  if (!winner || !match.local.team || !match.visitante.team) return null;
  return winner.seleccionId === match.local.team.seleccionId
    ? match.visitante.team
    : match.local.team;
}

function nextRoundFor(currentRound: KnockoutRound): KnockoutRound | null {
  if (currentRound === "ROUND_OF_32") return "ROUND_OF_16";
  if (currentRound === "ROUND_OF_16") return "QUARTER_FINAL";
  if (currentRound === "QUARTER_FINAL") return "SEMI_FINAL";
  if (currentRound === "SEMI_FINAL") return "FINAL";
  return null;
}

export function generarSiguienteRonda(matches: KnockoutMatch[]): KnockoutMatch[] {
  if (matches.length === 0) return [];

  const currentRound = matches[0].ronda;
  const nextRound = nextRoundFor(currentRound);
  if (!nextRound) return [];

  const next: KnockoutMatch[] = [];

  for (let index = 0; index < matches.length; index += 2) {
    const localSource = matches[index];
    const visitanteSource = matches[index + 1];
    const order = index / 2 + 1;

    next.push({
      id: `${nextRound}-${order}`,
      ronda: nextRound,
      orden: order,
      local: {
        slot: `Ganador ${localSource.id}`,
        team: getWinner(localSource),
      },
      visitante: {
        slot: `Ganador ${visitanteSource.id}`,
        team: visitanteSource ? getWinner(visitanteSource) : null,
      },
      golesLocal: null,
      golesVisitante: null,
      penaltyWinner: null,
      ganador: null,
    });
  }

  return next;
}

export function generarTercerPuesto(semiFinals: KnockoutMatch[]): KnockoutMatch[] {
  if (semiFinals.length !== 2) return [];

  return [
    {
      id: "THIRD_PLACE-1",
      ronda: "THIRD_PLACE",
      orden: 1,
      local: {
        slot: `Perdedor ${semiFinals[0].id}`,
        team: getLoser(semiFinals[0]),
      },
      visitante: {
        slot: `Perdedor ${semiFinals[1].id}`,
        team: getLoser(semiFinals[1]),
      },
      golesLocal: null,
      golesVisitante: null,
      penaltyWinner: null,
      ganador: null,
    },
  ];
}

export function obtenerCampeon(matches: KnockoutMatch[]) {
  const final = matches.find((match) => match.ronda === "FINAL");
  return final ? getWinner(final) : null;
}
