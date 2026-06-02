import { axiosInstance } from "@/lib/axios";
import type {
  JugadorSeleccion,
  JugadorSeleccionCreateInput,
  JugadorSeleccionUpdateInput,
} from "@/features/partidos/types/types";

type PlantelResponse = {
  data?: JugadorSeleccion[];
};

export type PlantelImportSummary = {
  seleccionId: string;
  seleccionNombre?: string | null;
  coach?: string | null;
  imported: number;
  cleared: number;
  source: "file" | "api";
};

export type PlantelImportResult = {
  data: JugadorSeleccion[];
  summary: PlantelImportSummary;
};

export async function getPlantelBySeleccion(
  seleccionId: string
): Promise<JugadorSeleccion[]> {
  const res = await axiosInstance.get<PlantelResponse>(
    `/paises/${seleccionId}/plantel`
  );

  return res.data.data ?? [];
}

export async function createJugador(
  seleccionId: string,
  payload: JugadorSeleccionCreateInput
): Promise<JugadorSeleccion> {
  const res = await axiosInstance.post<JugadorSeleccion>(
    `/paises/${seleccionId}/plantel`,
    payload
  );

  return res.data;
}

export async function importPlantel(
  seleccionId: string,
  items: JugadorSeleccionCreateInput[]
): Promise<PlantelImportResult> {
  const res = await axiosInstance.post<{
    data: JugadorSeleccion[];
    meta?: {
      seleccionId?: string;
      imported?: number;
      cleared?: number;
    };
  }>(
    `/paises/${seleccionId}/plantel/import`,
    { items }
  );

  const data = res.data.data ?? [];

  return {
    data,
    summary: {
      seleccionId: res.data.meta?.seleccionId ?? seleccionId,
      imported: res.data.meta?.imported ?? data.length,
      cleared: res.data.meta?.cleared ?? 0,
      source: "file",
    },
  };
}

export async function importPlantelDesdeApi(
  seleccionId: string
): Promise<PlantelImportResult> {
  const res = await axiosInstance.post<{
    data: JugadorSeleccion[];
    meta?: {
      totalImported?: number;
      cleared?: number;
      seleccionId?: string;
      seleccionNombre?: string | null;
      coach?: string | null;
    };
  }>(
    `/paises/${seleccionId}/plantel/import-api`
  );

  const data = res.data.data ?? [];

  return {
    data,
    summary: {
      seleccionId: res.data.meta?.seleccionId ?? seleccionId,
      seleccionNombre: res.data.meta?.seleccionNombre ?? null,
      coach: res.data.meta?.coach ?? null,
      imported: res.data.meta?.totalImported ?? data.length,
      cleared: res.data.meta?.cleared ?? 0,
      source: "api",
    },
  };
}

export async function updateJugador(
  jugadorId: string,
  payload: JugadorSeleccionUpdateInput
): Promise<JugadorSeleccion> {
  const res = await axiosInstance.put<JugadorSeleccion>(
    `/plantel/${jugadorId}`,
    payload
  );

  return res.data;
}

export async function deleteJugador(jugadorId: string): Promise<void> {
  await axiosInstance.delete(`/plantel/${jugadorId}`);
}
