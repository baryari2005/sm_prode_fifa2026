"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  getPronosticosRanking,
  HistorialPronosticoDTO,
  RankingRowDTO,
} from "@/features/pronosticos/services/ranking.service";

export function useRankingPage() {
  const [miRanking, setMiRanking] = useState<RankingRowDTO | null>(null);
  const [ranking, setRanking] = useState<RankingRowDTO[]>([]);
  const [historial, setHistorial] = useState<HistorialPronosticoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPronosticosRanking();
      setMiRanking(data.miRanking);
      setRanking(data.ranking);
      setHistorial(data.historial);
    } catch (error) {
      console.error("Error cargando ranking:", error);
      toast.error("No se pudo cargar el ranking del prode");
      setMiRanking(null);
      setRanking([]);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    miRanking,
    ranking,
    historial,
    loading,
    loadData,
  };
}
