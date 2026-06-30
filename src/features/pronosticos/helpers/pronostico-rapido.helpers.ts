import { getGrupoNombre } from "@/features/partidos/utils/partidos-ui.helpers";

import type {
  PartidoPronosticoRapido,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

export function getGrupoFilterValue(partido: PartidoPronosticoRapido) {
  const grupoNombre = getGrupoNombre(partido);

  if (!grupoNombre) return null;

  return grupoNombre.replace(/^grupo\s+/i, "").trim();
}

export function getInitialPredictionValue(
  partido: PartidoPronosticoRapido
): PronosticoRapidoValue {
  const pronostico =
    partido.miPrediccion ?? partido.pronostico ?? partido.prediccion ?? null;

  return {
    golesLocal:
      pronostico?.golesLocal !== null && pronostico?.golesLocal !== undefined
        ? String(pronostico.golesLocal)
        : "",
    golesVisitante:
      pronostico?.golesVisitante !== null &&
      pronostico?.golesVisitante !== undefined
        ? String(pronostico.golesVisitante)
        : "",
    equipoClasificadoId: pronostico?.equipoClasificadoId ?? null,
  };
}

export function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export function valuesAreEqual(
  current?: PronosticoRapidoValue,
  initial?: PronosticoRapidoValue
) {
  return (
    current?.golesLocal === initial?.golesLocal &&
    current?.golesVisitante === initial?.golesVisitante &&
    current?.equipoClasificadoId === initial?.equipoClasificadoId
  );
}

export function isEmptyPrediction(value: PronosticoRapidoValue) {
  return value.golesLocal.trim() === "" && value.golesVisitante.trim() === "";
}

export function isPartialPrediction(value: PronosticoRapidoValue) {
  const localEmpty = value.golesLocal.trim() === "";
  const visitanteEmpty = value.golesVisitante.trim() === "";

  return localEmpty !== visitanteEmpty;
}
