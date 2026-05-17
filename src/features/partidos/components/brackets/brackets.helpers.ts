import type { ReglaCruce } from "@/features/partidos/types/types";

export function sortReglasCruce(reglas: ReglaCruce[]) {
  return [...reglas].sort((a, b) => {
    if (a.fase?.orden !== b.fase?.orden) {
      return (a.fase?.orden ?? 0) - (b.fase?.orden ?? 0);
    }

    if (a.fecha && b.fecha) {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    }

    return a.partidoNumero - b.partidoNumero;
  });
}

export function groupReglasByFase(reglas: ReglaCruce[]) {
  const fasesMap = new Map<string, ReglaCruce[]>();

  reglas.forEach((regla) => {
    const faseNombre = regla.fase?.nombre || "Sin fase";
    const reglasPorFase = fasesMap.get(faseNombre) || [];

    reglasPorFase.push(regla);
    fasesMap.set(faseNombre, reglasPorFase);
  });

  return Array.from(fasesMap.entries()).map(([faseNombre, reglas]) => ({
    faseNombre,
    reglas,
  }));
}