import { EstadoPartido } from "@prisma/client";

import type {
  GoalDetail,
  MatchIncident,
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
  incidencias: MatchIncident[];
};

export type ResultadoSide = "local" | "visitante";

export type LineupSummary = {
  goals: number;
  yellowCards: number;
  redCards: number;
};
