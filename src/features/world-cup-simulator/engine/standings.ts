import { compareStandings } from "./tieBreakers";
import type { SimulatorMatch, TeamStanding } from "./types";

function buildStanding(match: SimulatorMatch, side: "local" | "visitante"): TeamStanding {
  const team = side === "local" ? match.local : match.visitante;

  return {
    seleccionId: team.id,
    nombre: team.nombre,
    codigo: team.codigo ?? null,
    banderaUrl: team.banderaUrl ?? null,
    grupo: match.grupo,
    puntos: 0,
    partidosJugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    golesFavor: 0,
    golesContra: 0,
    diferenciaGol: 0,
    rankingFifa: team.rankingFifa ?? null,
    fairPlayScore: team.fairPlayScore ?? null,
  };
}

export function ordenarTablaGrupo(standings: TeamStanding[]): TeamStanding[] {
  return [...standings]
    .sort(compareStandings)
    .map((standing, index) => ({
      ...standing,
      posicionGrupo: index + 1,
    }));
}

export function calcularTablaGrupo(matches: SimulatorMatch[]): TeamStanding[] {
  const table = new Map<string, TeamStanding>();

  for (const match of matches) {
    if (!table.has(match.local.id)) {
      table.set(match.local.id, buildStanding(match, "local"));
    }

    if (!table.has(match.visitante.id)) {
      table.set(match.visitante.id, buildStanding(match, "visitante"));
    }

    if (match.golesLocal === null || match.golesVisitante === null) {
      continue;
    }

    const local = table.get(match.local.id);
    const visitante = table.get(match.visitante.id);

    if (!local || !visitante) continue;

    local.partidosJugados += 1;
    visitante.partidosJugados += 1;

    local.golesFavor += match.golesLocal;
    local.golesContra += match.golesVisitante;
    visitante.golesFavor += match.golesVisitante;
    visitante.golesContra += match.golesLocal;

    if (match.golesLocal > match.golesVisitante) {
      local.ganados += 1;
      local.puntos += 3;
      visitante.perdidos += 1;
    } else if (match.golesLocal < match.golesVisitante) {
      visitante.ganados += 1;
      visitante.puntos += 3;
      local.perdidos += 1;
    } else {
      local.empatados += 1;
      visitante.empatados += 1;
      local.puntos += 1;
      visitante.puntos += 1;
    }

    local.diferenciaGol = local.golesFavor - local.golesContra;
    visitante.diferenciaGol = visitante.golesFavor - visitante.golesContra;
  }

  return ordenarTablaGrupo(Array.from(table.values()));
}

export function calcularTablasPorGrupo(matches: SimulatorMatch[]) {
  const grouped = new Map<string, SimulatorMatch[]>();

  for (const match of matches) {
    const current = grouped.get(match.grupo) ?? [];
    current.push(match);
    grouped.set(match.grupo, current);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce<Record<string, TeamStanding[]>>((acc, [grupo, groupMatches]) => {
      acc[grupo] = calcularTablaGrupo(groupMatches);
      return acc;
    }, {});
}
