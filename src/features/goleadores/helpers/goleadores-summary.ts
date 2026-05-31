import type { Goleador } from "@/features/goleadores/types/types";

type SourceType = "api" | "mock" | "db" | null;

export type GoleadoresSummary = {
  total: number;
  sourceLabel: string;
  maximoGoleador: string;
  maximoDetalle: string;
  seleccionesRepresentadas: number;
};

export function buildGoleadoresSummary(
  goleadores: Goleador[],
  source: SourceType,
): GoleadoresSummary {
  const total = goleadores.length;
  const sourceLabel =
    source === "api" ? "API" : source === "db" ? "Base" : source === "mock" ? "Mock" : "Sin carga";
  const seleccionesRepresentadas = new Set(
    goleadores
      .map((goleador) => goleador.codigoSeleccion?.trim() || goleador.seleccion?.trim())
      .filter(Boolean),
  ).size;

  const maximo = goleadores.reduce<Goleador | null>((current, goleador) => {
    if (!current) return goleador;
    if (goleador.goles > current.goles) return goleador;
    if (goleador.goles === current.goles && goleador.nombre.localeCompare(current.nombre) < 0) {
      return goleador;
    }
    return current;
  }, null);

  return {
    total,
    sourceLabel,
    maximoGoleador: maximo?.nombre ?? "Sin datos",
    maximoDetalle: maximo ? `${maximo.goles} gol${maximo.goles === 1 ? "" : "es"}` : "Esperando carga",
    seleccionesRepresentadas,
  };
}
