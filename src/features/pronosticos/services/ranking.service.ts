import type { AciertoTipo } from "@prisma/client";
import type { Fase, Resultado, Seleccion } from "@/features/partidos/types/types";
import { axiosInstance } from "@/lib/axios";

export type RankingScope = "grupos" | "dieciseisavos" | "eliminatorias";

export type RankingRowDTO = {
  posicion: number | null;
  usuarioId: string;
  nombre: string;
  avatarUrl: string | null;
  isPublicParticipant?: boolean;
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
    fase?: {
      id: number;
      nombre: string;
      orden: number;
    } | null;
    miRanking?: RankingRowDTO;
    ranking?: RankingRowDTO[];
    historial?: HistorialPronosticoDTO[];
  };
  message?: string;
};

export async function getPronosticosRanking(params?: {
  faseId?: number | null;
  scope?: RankingScope;
}) {
  const response = await axiosInstance.get<RankingResponse>("/pronosticos/ranking", {
    headers: {
      "Cache-Control": "no-cache",
    },
    params:
      params?.faseId || params?.scope
        ? {
            ...(params.faseId ? { faseId: params.faseId } : {}),
            ...(params.scope ? { scope: params.scope } : {}),
          }
        : undefined,
  });

  const data = response.data;

  return {
    fase: data.data?.fase ?? null,
    miRanking: data.data?.miRanking ?? null,
    ranking: data.data?.ranking ?? [],
    historial: data.data?.historial ?? [],
  };
}
