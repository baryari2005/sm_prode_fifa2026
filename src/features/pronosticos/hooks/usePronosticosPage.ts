"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { buildPartidoSearchText, groupPartidosByDate, PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import { getFixturePronosticos } from "@/features/pronosticos/services/pronosticos.service";

export function usePronosticosPage() {
  const [partidos, setPartidos] = useState<PartidoConRelaciones[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getFixturePronosticos();
      setPartidos(items);
    } catch (error) {
      console.error("Error cargando pronósticos:", error);
      setPartidos([]);
      toast.error("Error al cargar el fixture de pronósticos");
    } finally {
      setLoading(false);
    }
  }, []);

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

  return {
    partidos,
    partidosFiltrados,
    partidosAgrupados,
    loading,
    busqueda,
    setBusqueda,
    loadData,
  };
}
