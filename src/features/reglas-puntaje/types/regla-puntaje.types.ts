export type FaseResumen = {
  id: number;
  nombre: string;
  orden?: number;
};

export type ReglaPuntaje = {
  id: string;
  faseId: number;
  puntosExacto: number;
  puntosParcial: number;
  puntosSinAcierto: number;
  puntosClasificadoPenales: number;
  bloqueada?: boolean;
};

export type ReglaPuntajeFormValues = {
  faseId: number | null;
  puntosExacto: number;
  puntosParcial: number;
  puntosSinAcierto: 0;
  puntosClasificadoPenales: number;
};
