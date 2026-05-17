"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import { getFixturePronosticos } from "@/features/pronosticos/services/pronosticos.service";
import {
  getPronosticosRanking,
  RankingRowDTO,
} from "@/features/pronosticos/services/ranking.service";

export function useProdeDashboard(currentUserId?: string | null) {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<RankingRowDTO[]>([]);
  const [miRanking, setMiRanking] = useState<RankingRowDTO | null>(null);
  const [fixture, setFixture] = useState<PartidoConRelaciones[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [rankingData, fixtureData] = await Promise.all([
        getPronosticosRanking(),
        getFixturePronosticos(),
      ]);

      setRanking(rankingData.ranking);
      setMiRanking(rankingData.miRanking);
      setFixture(fixtureData);
    } catch (error) {
      console.error("Error cargando dashboard del prode:", error);
      toast.error("No se pudieron cargar los datos del prode");
      setRanking([]);
      setMiRanking(null);
      setFixture([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const pronosticosCargados = useMemo(() => {
    return fixture.filter((partido) => Boolean(partido.miPrediccion)).length;
  }, [fixture]);

  const proximosPartidos = useMemo(() => {
    return fixture
      .filter((partido) => {
        if (partido.resultado?.estado === "FINALIZADO") return false;
        return new Date(partido.fecha).getTime() >= Date.now();
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 3);
  }, [fixture]);

  const proximoPartido = proximosPartidos[0] ?? null;

  const rankingDestacado = useMemo(() => {
    const topThree = ranking.slice(0, 3);

    if (!currentUserId) {
      return ranking.slice(0, 4);
    }

    const currentUserRow = ranking.find((row) => row.usuarioId === currentUserId);

    if (!currentUserRow) {
      return topThree;
    }

    if (topThree.some((row) => row.usuarioId === currentUserId)) {
      return ranking.slice(0, 4);
    }

    return [...topThree, currentUserRow];
  }, [ranking, currentUserId]);

  return {
    loading,
    ranking,
    miRanking,
    fixture,
    pronosticosCargados,
    proximosPartidos,
    proximoPartido,
    rankingDestacado,
    participantes: ranking.length,
    totalPartidos: fixture.length,
    loadData,
  };
}
