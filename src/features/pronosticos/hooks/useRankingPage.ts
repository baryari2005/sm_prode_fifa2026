"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { Fase } from "@/features/partidos/types/types";
import {
  getPronosticosRanking,
  HistorialPronosticoDTO,
  RankingRowDTO,
} from "@/features/pronosticos/services/ranking.service";

export function useRankingPage() {
  const [fases, setFases] = useState<Fase[]>([]);
  const [scope, setScope] = useState<"grupos" | "eliminatorias">("grupos");
  const [rankingInitialized, setRankingInitialized] = useState(false);
  const [faseActual, setFaseActual] = useState<Pick<Fase, "id" | "nombre" | "orden"> | null>(null);
  const [miRanking, setMiRanking] = useState<RankingRowDTO | null>(null);
  const [ranking, setRanking] = useState<RankingRowDTO[]>([]);
  const [historial, setHistorial] = useState<HistorialPronosticoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFases = useCallback(async () => {
    const [fasesResponse, faseActivaResponse] = await Promise.all([
      fetch("/api/fases", {
        cache: "no-store",
      }),
      fetch("/api/fases/activa", {
        cache: "no-store",
      }),
    ]);

    const fasesData = (await fasesResponse.json()) as Array<
      Pick<Fase, "id" | "nombre" | "orden">
    > | {
      message?: string;
    };
    const faseActivaData = (await faseActivaResponse.json()) as Pick<
      Fase,
      "id" | "nombre" | "orden"
    > | null | {
      message?: string;
    };

    if (!fasesResponse.ok || !Array.isArray(fasesData)) {
      throw new Error(
        !Array.isArray(fasesData) && fasesData.message
          ? fasesData.message
          : "No se pudieron cargar las fases",
      );
    }

    setFases(fasesData as Fase[]);

    if (
      faseActivaResponse.ok &&
      faseActivaData &&
      typeof faseActivaData === "object" &&
      "id" in faseActivaData &&
      typeof faseActivaData.id === "number"
    ) {
      const activeScope = Array.isArray(fasesData)
        ? (fasesData as Fase[]).find((fase) => fase.id === faseActivaData.id)?.orden === 1
          ? "grupos"
          : "eliminatorias"
        : "grupos";

      setScope(activeScope);
      setRankingInitialized(true);
      return;
    }

    setScope("grupos");
    setRankingInitialized(true);
  }, []);

  const loadData = useCallback(async (nextScope: "grupos" | "eliminatorias") => {
    try {
      setLoading(true);
      const data = await getPronosticosRanking({
        scope: nextScope,
      });
      setFaseActual(data.fase);
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
    fases,
    scope,
    faseActual,
    miRanking,
    ranking,
    historial,
    loading,
    rankingInitialized,
    setScope,
    loadFases,
    loadData,
  };
}
