import { DEFAULT_TEAM_STATS } from "@/features/partidos/types/fixture-details";

import type {
  MatchIncident,
  TeamLineup,
} from "@/features/partidos/types/fixture-details";

import type {
  Partido,
  Resultado,
} from "@/features/partidos/types/types";

export type TeamStats = typeof DEFAULT_TEAM_STATS;

export type PartidoDetalleEquipo = {
  id: string;
  nombre: string;
  codigo?: string | null;
  escudoUrl?: string | null;
};

export type PartidoDetalleViewModel = {
  partidoId: string;
  partido: Partido;
  resultado: Resultado | null;
  marcador: string;
  competencia: string;
  fechaTexto?: string;
  estado: string;
  fase?: string;
  grupo?: string;
  jornada?: string;

  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;

  statsLocal: TeamStats;
  statsVisitante: TeamStats;

  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
  incidencias?: MatchIncident[];
};
