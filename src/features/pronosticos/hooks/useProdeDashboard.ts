"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { detectGoalEvents } from "@/features/partidos/lib/goal-events";
import { useGoalCelebrationStore } from "@/stores/goal-celebration";
import {
  PartidoConRelaciones,
  isPredictionBlocked,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { getFixturePronosticos } from "@/features/pronosticos/services/pronosticos.service";
import {
  getPronosticosRanking,
  RankingScope,
  RankingRowDTO,
} from "@/features/pronosticos/services/ranking.service";

type UseProdeDashboardOptions = {
  canLoadRanking?: boolean;
};

type ActivePhaseData =
  | { id: number; nombre: string; orden: number }
  | null
  | { message?: string };

function normalizePhaseName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getDashboardRankingConfig(
  activePhaseData: ActivePhaseData,
): RankingScope {
  if (
    !activePhaseData ||
    typeof activePhaseData !== "object" ||
    !("id" in activePhaseData) ||
    typeof activePhaseData.id !== "number"
  ) {
    return "grupos";
  }

  if (activePhaseData.orden === 1) {
    return "grupos";
  }

  const phaseName = normalizePhaseName(activePhaseData.nombre);
  const isRoundOf32 =
    phaseName.includes("dieciseisavos") || phaseName.includes("16vos");

  return isRoundOf32 ? "dieciseisavos" : "eliminatorias";
}

export function useProdeDashboard(
  currentUserId?: string | null,
  options?: UseProdeDashboardOptions,
) {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<RankingRowDTO[]>([]);
  const [miRanking, setMiRanking] = useState<RankingRowDTO | null>(null);
  const [fixture, setFixture] = useState<PartidoConRelaciones[]>([]);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const fixtureRef = useRef<PartidoConRelaciones[]>([]);
  const hasLoadedRef = useRef(false);
  const canLoadRanking = options?.canLoadRanking ?? true;
  const enqueueGoalEvents = useGoalCelebrationStore(
    (state) => state.enqueueEvents,
  );

  const loadData = useCallback(
    async (loadOptions?: { silent?: boolean }) => {
      try {
        if (!loadOptions?.silent) {
          setLoading(true);
        }

        const fixturePromise = getFixturePronosticos();
        const rankingPromise = canLoadRanking
          ? (async () => {
              const activePhaseResponse = await fetch("/api/fases/activa", {
                cache: "no-store",
              });

              const activePhaseData =
                (await activePhaseResponse.json()) as ActivePhaseData;
              const rankingScope = activePhaseResponse.ok
                ? getDashboardRankingConfig(activePhaseData)
                : ("grupos" as RankingScope);

              return getPronosticosRanking({ scope: rankingScope });
            })()
          : Promise.resolve({
              miRanking: null,
              ranking: [],
              historial: [],
            });

        const [rankingData, fixtureResponse] = await Promise.all([
          rankingPromise,
          fixturePromise,
        ]);
        const fixtureData = fixtureResponse.data;

        if (hasLoadedRef.current) {
          enqueueGoalEvents(detectGoalEvents(fixtureRef.current, fixtureData));
        }

        setRanking(rankingData.ranking);
        setMiRanking(rankingData.miRanking);
        setFixture(fixtureData);
        setServerNow(fixtureResponse.serverNow);
        fixtureRef.current = fixtureData;
        hasLoadedRef.current = true;
      } catch (error) {
        console.error("Error cargando dashboard del prode:", error);
        toast.error("No se pudieron cargar los datos del prode");
        setRanking([]);
        setMiRanking(null);
        setFixture([]);
      } finally {
        if (!loadOptions?.silent) {
          setLoading(false);
        }
      }
    },
    [canLoadRanking, enqueueGoalEvents],
  );

  const partidosEnJuego = useMemo(() => {
    return fixture
      .filter((partido) => {
        const estado = partido.resultado?.estado;
        return estado === "EN_JUEGO" || estado === "ENTRETIEMPO";
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [fixture]);

  const pronosticosCargados = useMemo(() => {
    return fixture.filter((partido) => Boolean(partido.miPrediccion)).length;
  }, [fixture]);

  const proximosPartidos = useMemo(() => {
    return fixture
      .filter((partido) => {
        if (partido.resultado?.estado === "FINALIZADO") return false;
        return !isPredictionBlocked(partido);
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
    serverNow,
    partidosEnJuego,
    pronosticosCargados,
    proximosPartidos,
    proximoPartido,
    rankingDestacado,
    participantes: ranking.length,
    totalPartidos: fixture.length,
    loadData,
  };
}
