import type { FocusEvent, MouseEvent } from "react";

import type {
  JugadorSeleccion,
  JugadorSeleccionCreateInput,
} from "@/features/partidos/types/types";

import type { JugadorPlantelFormState } from "../types";

export function toInitialJugadorPlantelFormState(
  jugador: JugadorSeleccion | undefined,
  selectedSeleccionId?: string
): JugadorPlantelFormState {
  return {
    seleccionId: jugador?.seleccionId ?? selectedSeleccionId ?? "",
    nombre: jugador?.nombre ?? "",
    fotoUrl: jugador?.fotoUrl ?? "",
    numero:
      jugador?.numero === null || jugador?.numero === undefined
        ? ""
        : String(jugador.numero),
    posicion: jugador?.posicion ?? "A",
    edad:
      jugador?.edad === null || jugador?.edad === undefined
        ? ""
        : String(jugador.edad),
    estatura: jugador?.estatura ?? "",
    peso: jugador?.peso ?? "",
    nacionalidad: jugador?.nacionalidad ?? "",
    apariciones: String(jugador?.apariciones ?? 0),
    suplencias: String(jugador?.suplencias ?? 0),
    goles: String(jugador?.goles ?? 0),
    asistencias: String(jugador?.asistencias ?? 0),
    tiros: String(jugador?.tiros ?? 0),
    tirosAlArco: String(jugador?.tirosAlArco ?? 0),
    faltasCometidas: String(jugador?.faltasCometidas ?? 0),
    faltasSufridas: String(jugador?.faltasSufridas ?? 0),
    amarillas: String(jugador?.amarillas ?? 0),
    rojas: String(jugador?.rojas ?? 0),
    atajadas: String(jugador?.atajadas ?? 0),
    golesConcedidos: String(jugador?.golesConcedidos ?? 0),
  };
}

export function buildJugadorPlantelPayload(
  form: JugadorPlantelFormState
): JugadorSeleccionCreateInput {
  return {
    seleccionId: form.seleccionId,
    nombre: form.nombre.trim(),
    fotoUrl: emptyToNull(form.fotoUrl),
    numero: numberOrNull(form.numero),
    posicion: form.posicion,
    edad: numberOrNull(form.edad),
    estatura: emptyToNull(form.estatura),
    peso: emptyToNull(form.peso),
    nacionalidad: emptyToNull(form.nacionalidad),
    apariciones: numberOrZero(form.apariciones),
    suplencias: numberOrZero(form.suplencias),
    goles: numberOrZero(form.goles),
    asistencias: numberOrZero(form.asistencias),
    tiros: numberOrZero(form.tiros),
    tirosAlArco: numberOrZero(form.tirosAlArco),
    faltasCometidas: numberOrZero(form.faltasCometidas),
    faltasSufridas: numberOrZero(form.faltasSufridas),
    amarillas: numberOrZero(form.amarillas),
    rojas: numberOrZero(form.rojas),
    atajadas: numberOrZero(form.atajadas),
    golesConcedidos: numberOrZero(form.golesConcedidos),
  };
}

export function selectAllInputText(event: FocusEvent<HTMLInputElement>) {
  event.currentTarget.select();
}

export function preventMouseSelectionReset(event: MouseEvent<HTMLInputElement>) {
  event.preventDefault();
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function numberOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

function numberOrZero(value: string) {
  return Number(value || 0);
}
