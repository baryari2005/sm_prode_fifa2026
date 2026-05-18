import { axiosInstance } from "@/lib/axios";

import {
  FaseResumen,
  ReglaPuntaje,
  ReglaPuntajeFormValues,
} from "../types/regla-puntaje.types";

export async function getFases() {
  const { data } = await axiosInstance.get<FaseResumen[]>("/fases");
  return data;
}

export async function getReglaPuntaje(params: { faseId: number }) {
  const { data } = await axiosInstance.get<ReglaPuntaje | null>(
    "/reglas-puntaje",
    { params }
  );

  return data;
}

export async function guardarReglaPuntaje(values: ReglaPuntajeFormValues) {
  const { data } = await axiosInstance.post<ReglaPuntaje>(
    "/reglas-puntaje",
    values
  );

  return data;
}