import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import type { LiveControlMatchesResponse } from "@/features/live-control/types/live-control.types";

type TeamSide = "LOCAL" | "VISITANTE";

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export async function getLiveControlMatches() {
  try {
    const response = await axiosInstance.get("/admin/live-control/matches", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    return (response.data.data ?? {
      live: [],
      proximos: [],
      noCerrados: [],
    }) as LiveControlMatchesResponse;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "No se pudo cargar el panel Live Control."),
    );
  }
}

export async function postManualGoal(
  partidoId: string,
  payload: {
    team: TeamSide;
    minute: number;
    playerId?: string;
    description?: string;
  },
) {
  try {
    const response = await axiosInstance.post(
      `/admin/live-control/matches/${partidoId}/goal`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No se pudo cargar el gol manual."));
  }
}

export async function patchLiveStatus(
  partidoId: string,
  payload: {
    estado: string;
    minuto?: number | null;
    observacion?: string | null;
  },
) {
  try {
    const response = await axiosInstance.patch(
      `/admin/live-control/matches/${partidoId}/status`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No se pudo actualizar el estado live."));
  }
}

export async function syncMatchNow(partidoId: string) {
  try {
    const response = await axiosInstance.post(
      `/admin/live-control/matches/${partidoId}/sync-now`,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No se pudo sincronizar el partido."));
  }
}

export async function syncAllLiveNow() {
  try {
    const response = await axiosInstance.post("/admin/live-control/sync-now");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No se pudo ejecutar la sincronización live."));
  }
}

export async function runLiveTool(payload: {
  action: string;
  partidoId?: string;
  payload?: Record<string, unknown>;
}) {
  try {
    const response = await axiosInstance.post("/admin/live-control/tools", payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "No se pudo ejecutar la acción técnica."));
  }
}
