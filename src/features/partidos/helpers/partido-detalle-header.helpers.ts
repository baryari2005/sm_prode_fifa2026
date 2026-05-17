import type { PartidoInfoParams } from "../types/partido-detalle-header.types";

export function buildPartidoInfo({ fase, grupo, jornada }: PartidoInfoParams) {
  return [fase, grupo, jornada].filter(Boolean).join(" · ");
}

export function getEquipoInitials(nombre: string) {
  const words = nombre.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "?";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}