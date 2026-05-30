import type { TeamStanding } from "./types";

function compareNullableAsc(a?: number | null, b?: number | null) {
  const left = a ?? Number.POSITIVE_INFINITY;
  const right = b ?? Number.POSITIVE_INFINITY;

  return left - right;
}

export function compareStandings(a: TeamStanding, b: TeamStanding) {
  if (b.puntos !== a.puntos) return b.puntos - a.puntos;
  if (b.diferenciaGol !== a.diferenciaGol) return b.diferenciaGol - a.diferenciaGol;
  if (b.golesFavor !== a.golesFavor) return b.golesFavor - a.golesFavor;

  const fairPlayDiff = compareNullableAsc(a.fairPlayScore, b.fairPlayScore);
  if (fairPlayDiff !== 0) return fairPlayDiff;

  const rankingDiff = compareNullableAsc(a.rankingFifa, b.rankingFifa);
  if (rankingDiff !== 0) return rankingDiff;

  return a.nombre.localeCompare(b.nombre, "es");
}
