// src/features/partidos/hooks/useTablaPosiciones.ts

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Fase, Seleccion } from "@/features/partidos/types/types";
import {
  calcularTablaPosiciones,
  agruparTablaPorGrupo,
  getTablaPosicionesOficial,
  PosicionEquipo,
} from "@/features/partidos/services/tabla-posiciones.service";

import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

import {
  getPartidos,
  getPartidosOptions,
} from "@/features/partidos/services/partidos.service";

export function useTablaPosiciones() {
  const [partidos, setPartidos] = useState<PartidoConRelaciones[]>([]);
  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);
  const [tablaPosiciones, setTablaPosiciones] = useState<PosicionEquipo[]>([]);

  const [loading, setLoading] = useState(true);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const optionsPromise = getPartidosOptions();

      try {
        const [tablaOficial, options] = await Promise.all([
          getTablaPosicionesOficial(),
          optionsPromise,
        ]);

        if (tablaOficial.length === 0) {
          throw new Error("La API oficial no devolvió posiciones.");
        }

        setPartidos([]);
        setTablaPosiciones(tablaOficial);
        setSelecciones(options.selecciones);
        setFases(options.fases);
        setGrupoSeleccionado(null);
      } catch (tablaError) {
        console.warn(
          "No se pudo obtener la tabla oficial. Se usará el cálculo interno.",
          tablaError
        );

        const [partidosList, options] = await Promise.all([
          getPartidos(),
          optionsPromise.catch(() => ({
            selecciones: [] as Seleccion[],
            fases: [] as Fase[],
          })),
        ]);

        setPartidos(partidosList);
        setSelecciones(options.selecciones);
        setFases(options.fases);
        const tablaCalculada = calcularTablaPosiciones(
          partidosList,
          options.selecciones
        );

        setTablaPosiciones(tablaCalculada);
        setGrupoSeleccionado(null);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setPartidos([]);
      setSelecciones([]);
      setFases([]);
      setTablaPosiciones([]);
      setGrupoSeleccionado(null);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  const gruposDisponibles = useMemo(() => {
    const grupos = new Set<string | null>();
    tablaPosiciones.forEach((equipo) => {
      if (equipo.grupo) {
        grupos.add(equipo.grupo);
      }
    });
    return Array.from(grupos).sort();
  }, [tablaPosiciones]);

  const tablaPorGrupo = useMemo(() => {
    return agruparTablaPorGrupo(tablaPosiciones);
  }, [tablaPosiciones]);

  useEffect(() => {
    if (gruposDisponibles.length === 0) {
      if (grupoSeleccionado !== null) {
        setGrupoSeleccionado(null);
      }
      return;
    }

    if (
      grupoSeleccionado === null ||
      !gruposDisponibles.includes(grupoSeleccionado)
    ) {
      setGrupoSeleccionado(gruposDisponibles[0]);
    }
  }, [grupoSeleccionado, gruposDisponibles]);

  const grupoActual = useMemo(() => {
    if (grupoSeleccionado === null) {
      return tablaPosiciones;
    }

    if (grupoSeleccionado && tablaPorGrupo.has(grupoSeleccionado)) {
      return tablaPorGrupo.get(grupoSeleccionado) || [];
    }

    return [];
  }, [grupoSeleccionado, tablaPorGrupo, tablaPosiciones]);

  return {
    partidos,
    selecciones,
    fases,

    loading,
    tablaPosiciones,
    gruposDisponibles,
    tablaPorGrupo,
    grupoSeleccionado,
    setGrupoSeleccionado,

    grupoActual,

    loadData,
  };
}
