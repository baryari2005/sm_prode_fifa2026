import { EstadoPartido } from "@prisma/client";

import type {
  GoalDetail,
  TeamLineup,
  TeamStats,
} from "@/features/partidos/types/fixture-details";

export type ResultadoFormState = {
  golesLocal: number;
  golesVisitante: number;
  penalesLocal: string;
  penalesVisitante: string;
  estado: EstadoPartido;
  tiempoJuego: string;
  observaciones: string;
  estadisticasLocal: TeamStats;
  estadisticasVisitante: TeamStats;
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  detalleGolesLocal: GoalDetail[];
  detalleGolesVisitante: GoalDetail[];
};

export type ResultadoSide = "local" | "visitante";

export type LineupSummary = {
  goals: number;
  yellowCards: number;
  redCards: number;
};