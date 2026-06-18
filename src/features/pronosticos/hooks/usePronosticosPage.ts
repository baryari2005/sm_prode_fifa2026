"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { detectGoalEvents } from "@/features/partidos/lib/goal-events";
import { useGoalCelebrationStore } from "@/stores/goal-celebration";
import {
  buildPartidoSearchText,
  groupPartidosByDate,
  PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { getFixturePronosticos } from "@/features/pronosticos/services/pronosticos.service";

export function usePronosticosPage() {
  const [partidos, setPartidos] = useState<PartidoConRelaciones[]>([]);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const partidosRef = useRef<PartidoConRelaciones[]>([]);
  const hasLoadedRef = useRef(false);
  const enqueueGoalEvents = useGoalCelebrationStore(
    (state) => state.enqueueEvents,
  );

  const loadData = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setLoading(true);
      }

      const response = await getFixturePronosticos();
      const items = response.data;

      if (hasLoadedRef.current) {
        enqueueGoalEvents(detectGoalEvents(partidosRef.current, items));
      }

      setPartidos(items);
      setServerNow(response.serverNow);
      partidosRef.current = items;
      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Error cargando pronosticos:", error);
      setPartidos([]);
      toast.error("Error al cargar el fixture de pronosticos");
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [enqueueGoalEvents]);

  const partidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return partidos.filter((partido) => {
      if (!texto) return true;
      return buildPartidoSearchText(partido, [], []).includes(texto);
    });
  }, [partidos, busqueda]);

  const partidosAgrupados = useMemo(() => {
    return groupPartidosByDate(partidosFiltrados);
  }, [partidosFiltrados]);

  const hasVisibleLiveMatches = useMemo(() => {
    return partidos.some((partido) => {
      const estado = partido.resultado?.estado;
      return estado === "EN_JUEGO" || estado === "ENTRETIEMPO";
    });
  }, [partidos]);

  return {
    partidos,
    serverNow,
    partidosFiltrados,
    partidosAgrupados,
    hasVisibleLiveMatches,
    loading,
    busqueda,
    setBusqueda,
    loadData,
  };
}
