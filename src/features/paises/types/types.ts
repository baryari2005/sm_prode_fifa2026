export type Pais = {
  id: string;
  nombre: string;
  codigo: string; // ej: "ARG", "BRA", "ESP"
  footballDataTeamId?: number | null;
  bandera?: string; // emoji de bandera
  grupo?: string; // ej: "A", "B", "C"
  confederacion?: string; // ej: "CONMEBOL", "UEFA", "CAF"
  puntos?: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaisCreateInput = {
  nombre: string;
  codigo: string;
  footballDataTeamId?: number | null;
  bandera?: string;
  grupo?: string;
  confederacion?: string;
};

export type PaisUpdateInput = {
  nombre?: string;
  codigo?: string;
  footballDataTeamId?: number | null;
  bandera?: string;
  grupo?: string;
  confederacion?: string;
  activo?: boolean;
};

export type PaisListParams = {
  q: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
};
