import axios from "axios";
import { axiosInstance } from "@/lib/axios";
import type {
  Partido,
  Resultado,
  ResultadoCreateInput,
  ResultadoUpdateInput,
} from "@/features/partidos/types/types";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";

type PreviousLineupResponse = {
  local: {
    lineup: TeamLineup | null;
    partido: Partido | null;
  };
  visitante: {
    lineup: TeamLineup | null;
    partido: Partido | null;
  };
};

export async function getPartidoDetalle(partidoId: string): Promise<Partido> {
  const res = await axiosInstance.get<Partido>(`/partidos/${partidoId}`);
  return res.data;
}

export async function getResultado(partidoId: string): Promise<Resultado | null> {
  try {
    const res = await axiosInstance.get<Resultado>(
      `/partidos/resultados?partidoId=${partidoId}`
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function saveResultado(
  current: Resultado | null,
  payload: ResultadoCreateInput | (ResultadoUpdateInput & { partidoId: string })
): Promise<Resultado> {
  if (current) {
    const res = await axiosInstance.put<Resultado>("/partidos/resultados", payload);
    return res.data;
  }

  const res = await axiosInstance.post<Resultado>("/partidos/resultados", payload);
  return res.data;
}

export async function getPreviousLineups(partidoId: string) {
  const res = await axiosInstance.get<PreviousLineupResponse>(
    `/partidos/${partidoId}/formaciones-base`
  );

  return res.data;
}
