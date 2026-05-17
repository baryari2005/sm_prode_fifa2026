import type { StatsField } from "./types";

export const POSITION_OPTIONS = [
  { value: "A", label: "A - Arquero" },
  { value: "D", label: "D - Defensor" },
  { value: "M", label: "M - Mediocampo" },
  { value: "MO", label: "MO - Mediocampista Ofensivo" },
  { value: "MC", label: "MC - Mediocampista Central" },
  { value: "MD", label: "MD - Mediocampista Defensivo" },
  { value: "ED", label: "ED - Extremo Derecho" },
  { value: "EI", label: "EI - Extremo Izquierdo" },
  { value: "LI", label: "LI - Lateral Izquierdo" },
  { value: "LD", label: "LD - Lateral Derecho" },
  { value: "DC", label: "DC - Central" },
  { value: "FC", label: "FC - Delantero Central" },
  { value: "F", label: "F - Delantero" },
] as const;

export const STATS_FIELDS: StatsField[] = [
  { key: "apariciones", shortLabel: "AP", label: "Apariciones" },
  { key: "suplencias", shortLabel: "SUB", label: "Suplencias" },
  { key: "goles", shortLabel: "G", label: "Goles" },
  { key: "asistencias", shortLabel: "A", label: "Asistencias" },
  { key: "tiros", shortLabel: "TT", label: "Tiros totales" },
  { key: "tirosAlArco", shortLabel: "TM", label: "Tiros al arco" },
  { key: "faltasCometidas", shortLabel: "FC", label: "Faltas cometidas" },
  { key: "faltasSufridas", shortLabel: "FS", label: "Faltas sufridas" },
  { key: "amarillas", shortLabel: "TA", label: "Tarjetas amarillas" },
  { key: "rojas", shortLabel: "TR", label: "Tarjetas rojas" },
  { key: "atajadas", shortLabel: "ATAJ", label: "Atajadas" },
  { key: "golesConcedidos", shortLabel: "GA", label: "Goles concedidos" },
];

export const MAX_PHOTO_BYTES = 500 * 1024;
