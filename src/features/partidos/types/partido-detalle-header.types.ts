export type PartidoInfoParams = {
  fase?: string;
  grupo?: string;
  jornada?: string;
};

export type EquipoResumenProps = {
  nombre: string;
  escudoUrl?: string | null;
  align: "left" | "right";
};

export type PartidoDetalleHeaderProps = {
  partidoId?: string;
  local: string;
  visitante: string;
  marcador: string;
  seleccionLocalId?: string;
  seleccionVisitanteId?: string;
  escudoLocalUrl?: string | null;
  escudoVisitanteUrl?: string | null;
  competencia?: string;
  fechaTexto?: string;
  estado?: string;
  fase?: string;
  grupo?: string;
  jornada?: string;
  autoRefreshEnabled?: boolean;
  nextRefreshIn?: number;
  isRefreshing?: boolean;
  lastRefreshAt?: Date | null;
  onBack?: () => void;
};
