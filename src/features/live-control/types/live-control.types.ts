import type {
  EstadoPartido,
  PartidoEventoLiveSource,
  PartidoEventoLiveTipo,
} from "@prisma/client";
import type { TeamStats } from "@/features/partidos/types/fixture-details";

export type LiveEventDTO = {
  id: string;
  partidoId: string;
  tipo: PartidoEventoLiveTipo;
  equipoId: string | null;
  jugadorId: string | null;
  minuto: number | null;
  descripcion: string | null;
  source: PartidoEventoLiveSource;
  externalEventId: string | null;
  confirmedManual: boolean;
  protected: boolean;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiGoalCandidate = {
  partidoId: string;
  equipoId: string | null;
  jugadorId?: string | null;
  minuto?: number | null;
  descripcion?: string | null;
  externalEventId?: string | null;
};

export type LiveScore = {
  local: number;
  visitante: number;
};

export type MatchLiveSnapshot = {
  partidoId: string;
  estado: EstadoPartido;
  tiempoJuego: number | null;
  score: LiveScore;
  source: "API" | "MANUAL" | "MIXTO" | "SIN_EVENTOS";
};

export type LiveActionResponse = {
  status: "ok" | "warning" | "error";
  message: string;
  data?: unknown;
  warnings?: string[];
  errors?: string[];
  timestamp: string;
};

export type LiveAuditEntry = {
  id: string;
  userId: string;
  accion: string;
  createdAt: string | Date;
  user?: {
    email?: string | null;
  } | null;
};

export type LiveControlMatch = {
  id: string;
  fecha: string | Date;
  fase?: {
    nombre?: string | null;
  } | null;
  seleccionLocalId: string;
  seleccionVisitanteId: string;
  seleccionLocal?: {
    nombre?: string | null;
  } | null;
  seleccionVisitante?: {
    nombre?: string | null;
  } | null;
  eventosLive: Array<{
    id: string;
    tipo: PartidoEventoLiveTipo;
    minuto: number | null;
    descripcion: string | null;
    source: PartidoEventoLiveSource;
  }>;
  liveAudits: LiveAuditEntry[];
  liveSnapshot: MatchLiveSnapshot;
  resultado?: {
    estadisticasLocal?: TeamStats | null;
    estadisticasVisitante?: TeamStats | null;
  } | null;
};

export type LiveControlMatchesResponse = {
  all: LiveControlMatch[];
  live: LiveControlMatch[];
  proximos: LiveControlMatch[];
  noCerrados: LiveControlMatch[];
};
