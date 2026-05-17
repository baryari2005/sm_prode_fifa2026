export type Goleador = {
  id: string;
  nombre: string;
  nacionalidad: string;
  posicion: string;
  seleccion: string;
  codigoSeleccion: string;
  escudo: string | null;
  goles: number;
  asistencias: number;
  penales: number;
  partidosJugados: number;
  source: "api" | "mock" | "db";
};
