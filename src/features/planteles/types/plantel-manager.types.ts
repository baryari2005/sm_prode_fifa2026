export type SeleccionResumen = {
  id: string;
  nombre: string;
  codigo?: string | null;
  bandera?: string | null;
  footballDataTeamId?: number | null;
  grupo?: string | null;
  confederacion?: string | null;
  activo?: boolean;
};

export type PaginatedResponse<T> = {
  data?: T[];
};

export type PlantelManagerProps = {
  initialSeleccionId?: string;
  standalone?: boolean;
  canCreate?: boolean;
};

export type PlantelStats = {
  totalJugadores: number;
  totalArqueros: number;
  totalCampo: number;
};

export type PlantelImportReportItem = {
  seleccionId: string;
  seleccionNombre: string;
  imported: number;
  cleared: number;
  source: "file" | "api";
};

export type PlantelImportReport = {
  title: string;
  description: string;
  items: PlantelImportReportItem[];
};

export type PlantelManagerState = {
  selecciones: SeleccionResumen[];
  selectedSeleccionId: string;
  selectedSeleccion: SeleccionResumen | null;
  refreshToken: number;
  loadingInitial: boolean;
  importing: boolean;
  importingApi: boolean;
  importingAllApi: boolean;
  stats: PlantelStats;
  importReport?: PlantelImportReport | null;
};
