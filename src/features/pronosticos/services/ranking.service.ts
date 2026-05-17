import type { AciertoTipo } from "@prisma/client";
import type { Fase, Resultado, Seleccion } from "@/features/partidos/types/types";

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

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPronosticosRanking() {
  const res = await fetch("/api/pronosticos/ranking", {
    method: "GET",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as RankingResponse;

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar el ranking");
  }

  return {
    miRanking: data.data?.miRanking ?? null,
    ranking: data.data?.ranking ?? [],
    historial: data.data?.historial ?? [],
  };
}
