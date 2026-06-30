import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

export type PronosticoRapidoValue = {
  golesLocal: string;
  golesVisitante: string;
  equipoClasificadoId: string | null;
};

export type PronosticoRapidoField = keyof PronosticoRapidoValue;

export type PronosticoRapidoErrors = Record<string, string>;

export type PronosticoExistente = {
  golesLocal: number | null;
  golesVisitante: number | null;
  equipoClasificadoId?: string | null;
};

export type PartidoPronosticoRapido = PartidoConRelaciones & {
  pronostico?: PronosticoExistente | null;
  prediccion?: PronosticoExistente | null;
  miPrediccion?: PronosticoExistente | null;
};

export type PronosticoRapidoDateGroup = {
  key: string;
  titulo: string;
  partidos: PartidoConRelaciones[];
};

export type PhaseFilterValue = string | null;
