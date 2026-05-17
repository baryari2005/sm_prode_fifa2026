import type { JugadorSeleccion } from "@/features/partidos/types/types";

export type SeleccionOption = {
  id: string;
  nombre: string;
  codigo?: string | null;
  bandera?: string | null;
};

export type JugadorPlantelFormMode = "create" | "edit";

export type JugadorPlantelFormState = {
  seleccionId: string;
  nombre: string;
  fotoUrl: string;
  numero: string;
  posicion: string;
  edad: string;
  estatura: string;
  peso: string;
  nacionalidad: string;
  apariciones: string;
  suplencias: string;
  goles: string;
  asistencias: string;
  tiros: string;
  tirosAlArco: string;
  faltasCometidas: string;
  faltasSufridas: string;
  amarillas: string;
  rojas: string;
  atajadas: string;
  golesConcedidos: string;
};

export type JugadorPlantelFormProps = {
  mode: JugadorPlantelFormMode;
  jugador?: JugadorSeleccion;
  selecciones: SeleccionOption[];
  selectedSeleccionId?: string;
  onSuccess?: (seleccionId: string) => void;
};

export type JugadorPlantelFormField = keyof JugadorPlantelFormState;

export type StatsFieldKey = keyof Pick<
  JugadorPlantelFormState,
  | "apariciones"
  | "suplencias"
  | "goles"
  | "asistencias"
  | "tiros"
  | "tirosAlArco"
  | "faltasCometidas"
  | "faltasSufridas"
  | "amarillas"
  | "rojas"
  | "atajadas"
  | "golesConcedidos"
>;

export type StatsField = {
  key: StatsFieldKey;
  shortLabel: string;
  label: string;
};
