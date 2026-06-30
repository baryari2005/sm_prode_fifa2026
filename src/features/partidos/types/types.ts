import { AciertoTipo, EstadoPartido } from "@prisma/client";
import type {
  GoalDetail,
  MatchIncident,
  TeamLineup,
  TeamStats,
} from "./fixture-details";

export type Seleccion = {
  id: string;
  nombre: string;
  codigo: string;
  bandera: string | null;
  grupo: string | null;
  confederacion: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Fase = {
  id: number;
  nombre: string;
  orden: number;
  descripcion: string | null;
  grupo?: string | null;
  grupoNombre?: string | null;
  grupoCodigo?: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Partido = {
  id: string;
  footballDataId: number | null;
  fecha: Date;
  estadio: string | null;
  ciudad: string | null;

  faseId: number;
  seleccionLocalId: string;
  seleccionVisitanteId: string;

  fase?: Fase;
  seleccionLocal?: Seleccion;
  seleccionVisitante?: Seleccion;

  resultado?: Resultado | null;

  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Resultado = {
  id: string;
  partidoId: string;

  partido?: Partido;

  golesLocal: number;
  golesVisitante: number;

  penalesLocal: number | null;
  penalesVisitante: number | null;

  estado: EstadoPartido;

  tiempoJuego: number | null;
  observaciones: string | null;
  estadisticasLocal?: TeamStats | null;
  estadisticasVisitante?: TeamStats | null;
  alineacionLocal?: TeamLineup | null;
  alineacionVisitante?: TeamLineup | null;
  detalleGolesLocal?: GoalDetail[] | null;
  detalleGolesVisitante?: GoalDetail[] | null;
  incidencias?: MatchIncident[] | null;

  createdAt: Date;
  updatedAt: Date;
};

export type JugadorSeleccion = {
  id: string;
  seleccionId: string;
  nombre: string;
  fotoUrl: string | null;
  numero: number | null;
  posicion: string;
  edad: number | null;
  estatura: string | null;
  peso: string | null;
  nacionalidad: string | null;
  apariciones: number;
  suplencias: number;
  goles: number;
  asistencias: number;
  tiros: number;
  tirosAlArco: number;
  faltasCometidas: number;
  faltasSufridas: number;
  amarillas: number;
  rojas: number;
  atajadas: number;
  golesConcedidos: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PrediccionPartido = {
  id: string;
  usuarioId: string;
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
  equipoClasificadoId: string | null;
  puntosOtorgados: number;
  aciertoTipo: AciertoTipo | null;
  calculadoAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RankingUsuario = {
  id: string;
  usuarioId: string;
  puntosTotales: number;
  aciertosExactos: number;
  aciertosTendencia: number;
  partidosPronosticados: number;
  partidosCalificados: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RankingUsuarioFase = {
  id: string;
  usuarioId: string;
  faseId: number;
  puntosTotales: number;
  aciertosExactos: number;
  aciertosTendencia: number;
  partidosPronosticados: number;
  partidosCalificados: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PartidoCreateInput = {
  footballDataId?: number | null;
  fecha: Date;
  estadio: string | null;
  ciudad: string | null;
  faseId: number;
  seleccionLocalId: string;
  seleccionVisitanteId: string;
};

export type PartidoUpdateInput = {
  footballDataId?: number | null;
  fecha?: Date;
  estadio?: string | null;
  ciudad?: string | null;
  faseId?: number;
  seleccionLocalId?: string;
  seleccionVisitanteId?: string;
  activo?: boolean;
};

export type ResultadoCreateInput = {
  partidoId: string;
  golesLocal?: number;
  golesVisitante?: number;
  penalesLocal?: number | null;
  penalesVisitante?: number | null;
  estado?: EstadoPartido;
  tiempoJuego?: number | null;
  observaciones?: string | null;
  estadisticasLocal?: TeamStats | null;
  estadisticasVisitante?: TeamStats | null;
  alineacionLocal?: TeamLineup | null;
  alineacionVisitante?: TeamLineup | null;
  detalleGolesLocal?: GoalDetail[] | null;
  detalleGolesVisitante?: GoalDetail[] | null;
  incidencias?: MatchIncident[] | null;
};

export type ResultadoUpdateInput = {
  golesLocal?: number;
  golesVisitante?: number;
  penalesLocal?: number | null;
  penalesVisitante?: number | null;
  estado?: EstadoPartido;
  tiempoJuego?: number | null;
  observaciones?: string | null;
  estadisticasLocal?: TeamStats | null;
  estadisticasVisitante?: TeamStats | null;
  alineacionLocal?: TeamLineup | null;
  alineacionVisitante?: TeamLineup | null;
  detalleGolesLocal?: GoalDetail[] | null;
  detalleGolesVisitante?: GoalDetail[] | null;
  incidencias?: MatchIncident[] | null;
};

export type JugadorSeleccionCreateInput = {
  seleccionId: string;
  nombre: string;
  fotoUrl?: string | null;
  numero?: number | null;
  posicion: string;
  edad?: number | null;
  estatura?: string | null;
  peso?: string | null;
  nacionalidad?: string | null;
  apariciones?: number;
  suplencias?: number;
  goles?: number;
  asistencias?: number;
  tiros?: number;
  tirosAlArco?: number;
  faltasCometidas?: number;
  faltasSufridas?: number;
  amarillas?: number;
  rojas?: number;
  atajadas?: number;
  golesConcedidos?: number;
};

export type JugadorSeleccionUpdateInput = Partial<
  Omit<JugadorSeleccionCreateInput, "seleccionId">
> & {
  activo?: boolean;
};

export type ReglaCruce = {
  id: string;
  nombre: string;
  faseId: number;
  fase?: Fase;
  partidoNumero: number;
  localOrigen: string;
  visitanteOrigen: string;
  estadio: string | null;
  fecha: Date | null;
  hora: string | null;
  orden: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ReglaCruceCreateInput = {
  nombre: string;
  faseId: number;
  partidoNumero: number;
  localOrigen: string;
  visitanteOrigen: string;
  estadio?: string | null;
  fecha?: Date | null;
  hora?: string | null;
  orden?: number;
};

export type ReglaCruceUpdateInput = {
  nombre?: string;
  faseId?: number;
  partidoNumero?: number;
  localOrigen?: string;
  visitanteOrigen?: string;
  estadio?: string | null;
  fecha?: Date | null;
  hora?: string | null;
  orden?: number;
  activo?: boolean;
};
