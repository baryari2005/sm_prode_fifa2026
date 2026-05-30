import { compareStandings } from "./tieBreakers";
import type { QualifiedTeams, TeamStanding } from "./types";

export function obtenerMejoresTerceros(tablasPorGrupo: Record<string, TeamStanding[]>) {
  return Object.values(tablasPorGrupo)
    .map((tabla) => tabla.find((team) => team.posicionGrupo === 3) ?? null)
    .filter((team): team is TeamStanding => Boolean(team))
    .sort(compareStandings)
    .slice(0, 8);
}

export function obtenerClasificados(tablasPorGrupo: Record<string, TeamStanding[]>): QualifiedTeams {
  const primeros: TeamStanding[] = [];
  const segundos: TeamStanding[] = [];
  const terceros: TeamStanding[] = [];
  const eliminados: TeamStanding[] = [];

  for (const tabla of Object.values(tablasPorGrupo)) {
    tabla.forEach((team) => {
      if (team.posicionGrupo === 1) primeros.push(team);
      else if (team.posicionGrupo === 2) segundos.push(team);
      else if (team.posicionGrupo === 3) terceros.push(team);
      else eliminados.push(team);
    });
  }

  const mejoresTerceros = obtenerMejoresTerceros(tablasPorGrupo);
  const mejoresTercerosIds = new Set(mejoresTerceros.map((team) => team.seleccionId));

  return {
    primeros: primeros.sort((a, b) => a.grupo.localeCompare(b.grupo)),
    segundos: segundos.sort((a, b) => a.grupo.localeCompare(b.grupo)),
    terceros: terceros.sort((a, b) => a.grupo.localeCompare(b.grupo)),
    mejoresTerceros,
    eliminados: [
      ...eliminados,
      ...terceros.filter((team) => !mejoresTercerosIds.has(team.seleccionId)),
    ].sort((a, b) => a.grupo.localeCompare(b.grupo) || compareStandings(a, b)),
  };
}
