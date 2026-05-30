import type { Pais } from "../types/types";

export type PaisGroup = {
  groupLabel: string;
  groupKey: string;
  items: Pais[];
};

export function groupPaisesByGrupo(paises: Pais[]): PaisGroup[] {
  const grouped = new Map<string, Pais[]>();

  for (const pais of paises) {
    const rawGroup = pais.grupo?.trim();
    const key = rawGroup ? rawGroup.toUpperCase() : "SIN_GRUPO";

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)?.push(pais);
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => {
      if (left === "SIN_GRUPO") return 1;
      if (right === "SIN_GRUPO") return -1;
      return left.localeCompare(right);
    })
    .map(([groupKey, items]) => ({
      groupKey,
      groupLabel: groupKey === "SIN_GRUPO" ? "Sin grupo" : `Grupo ${groupKey}`,
      items: [...items].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    }));
}

export function buildPaisesOverviewSummary(paises: Pais[]) {
  const confederaciones = new Set(
    paises.map((pais) => pais.confederacion?.trim()).filter(Boolean),
  );
  const conGrupo = paises.filter((pais) => Boolean(pais.grupo?.trim())).length;
  const activas = paises.filter((pais) => pais.activo).length;

  return {
    activas,
    confederaciones: confederaciones.size,
    conGrupo,
    total: paises.length,
  };
}
