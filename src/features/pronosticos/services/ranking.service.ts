import type { AciertoTipo } from "@prisma/client";
import type { Fase, Resultado, Seleccion } from "@/features/partidos/types/types";
import { axiosInstance } from "@/lib/axios";

export type RankingRowDTO = {
  posicion: number | null;
  usuarioId: string;
  nombre: string;
  avatarUrl: string | null;
  puntosTotales: number;
  aciertosExactos: number;
  aciertosTendencia: number;
  partidosPronosticados: number;
  partidosCalificados: number;
  updatedAt: string | null | Date;
};

export type HistorialPronosticoDTO = {
  id: string;
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
  puntosOtorgados: number;
  aciertoTipo: AciertoTipo | null;
  calculadoAt: string | null | Date;
  partido: {
    id: string;
    fecha: string | Date;
    fase: Fase | null;
    seleccionLocal: Seleccion | null;
    seleccionVisitante: Seleccion | null;
    resultado: Resultado | null;
  };
};

type RankingResponse = {
  data?: {
    miRanking?: RankingRowDTO;
    ranking?: RankingRowDTO[];
    historial?: HistorialPronosticoDTO[];
  };
  message?: string;
};

export async function getPronosticosRanking() {
  const response = await axiosInstance.get<RankingResponse>("/pronosticos/ranking", {
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  const data = response.data;

  return {
    miRanking: data.data?.miRanking ?? null,
    ranking: data.data?.ranking ?? [],
    historial: data.data?.historial ?? [],
  };
}
