// src/features/partidos/hooks/usePartidosPage.ts

"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Fase, Seleccion } from "@/features/partidos/types/types";

import {
  buildPartidoSearchText,
  groupPartidosByDate,
  PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";

import {
  actualizarResultadosDesdeApi,
  cargarPartidosDesdeApi,
  generarCrucesPorFase,
  getPartidos,
  getPartidosOptions,
} from "@/features/partidos/services/partidos.service";
import type { FixturePhaseSlug } from "../constants/fixture-phase-filter.constants";

export function usePartidosPage() {
  const [partidos, setPartidos] = useState<PartidoConRelaciones[]>([]);
  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);

  const [loading, setLoading] = useState(true);
  const [cargandoApi, setCargandoApi] = useState(false);
  const [actualizandoResultadosApi, setActualizandoResultadosApi] =
    useState(false);
  const [actualizandoResultadosMock, setActualizandoResultadosMock] =
    useState(false);
  const [generandoCruces, setGenerandoCruces] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [partidosList, options] = await Promise.all([
        getPartidos(),
        getPartidosOptions(),
      ]);

      setPartidos(partidosList);
      setSelecciones(options.selecciones);
      setFases(options.fases);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setPartidos([]);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCargarDesdeApi = useCallback(async () => {
    try {
      setCargandoApi(true);

      const message = await cargarPartidosDesdeApi();

      toast.success(message);

      await loadData();
    } catch (error) {
      console.error("Error cargando desde API:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar partidos desde API";

      toast.error(message);
    } finally {
      setCargandoApi(false);
    }
  }, [loadData]);

  const handleActualizarResultadosDesdeApi = useCallback(async () => {
    try {
      setActualizandoResultadosApi(true);

      const message = await actualizarResultadosDesdeApi(false);

      toast.success(message);
      await loadData();
    } catch (error) {
      console.error("Error actualizando resultados desde API:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar resultados desde API";

      toast.error(message);
    } finally {
      setActualizandoResultadosApi(false);
    }
  }, [loadData]);

  const handleActualizarResultadosMock = useCallback(async () => {
    try {
      setActualizandoResultadosMock(true);

      const message = await actualizarResultadosDesdeApi(true);

      toast.success(message);
      await loadData();
    } catch (error) {
      console.error("Error actualizando resultados mock:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar resultados mock";

      toast.error(message);
    } finally {
      setActualizandoResultadosMock(false);
    }
  }, [loadData]);

  const handleGenerarCruces = useCallback(
    async (fase: Exclude<FixturePhaseSlug, "grupos">) => {
      try {
        setGenerandoCruces(true);
        const message = await generarCrucesPorFase(fase);
        toast.success(message);
        await loadData();
      } catch (error) {
        console.error("Error generando cruces:", error);

        const message =
          error instanceof Error ? error.message : "Error al generar cruces";

        toast.error(message);
      } finally {
        setGenerandoCruces(false);
      }
    },
    [loadData]
  );

  const partidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return partidos
      .filter((partido) => {
        // Filtrar por grupo si está seleccionado
        if (grupoSeleccionado) {
          const seleccionLocal = selecciones.find(
            (s) => s.id === partido.seleccionLocalId
          );
          const seleccionVisitante = selecciones.find(
            (s) => s.id === partido.seleccionVisitanteId
          );

          const esDelGrupo =
            (seleccionLocal?.grupo === grupoSeleccionado) ||
            (seleccionVisitante?.grupo === grupoSeleccionado);

          if (!esDelGrupo) return false;
        }

        // Filtrar por búsqueda
        if (!texto) return true;

        return buildPartidoSearchText(partido, selecciones, fases).includes(
          texto
        );
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [partidos, busqueda, selecciones, fases, grupoSeleccionado]);

  const partidosAgrupados = useMemo(() => {
    return groupPartidosByDate(partidosFiltrados);
  }, [partidosFiltrados]);

  const gruposDisponibles = useMemo(() => {
    const grupos = new Set<string>();
    selecciones.forEach((seleccion) => {
      if (seleccion.grupo) {
        grupos.add(seleccion.grupo);
      }
    });
    return Array.from(grupos).sort();
  }, [selecciones]);

  return {
    partidos,
    selecciones,
    fases,

    loading,
    cargandoApi,
    actualizandoResultadosApi,
    actualizandoResultadosMock,
    generandoCruces,

    busqueda,
    setBusqueda,

    grupoSeleccionado,
    setGrupoSeleccionado,
    gruposDisponibles,

    partidosFiltrados,
    partidosAgrupados,

    loadData,
    handleCargarDesdeApi,
    handleActualizarResultadosDesdeApi,
    handleActualizarResultadosMock,
    handleGenerarCruces,
  };
}
