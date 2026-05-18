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
  getPartidos,
  getPartidosOptions,
} from "@/features/partidos/services/partidos.service";

type GrupoPartidos = {
  key: string;
  titulo: string;
  partidos: PartidoConRelaciones[];
};

type GrupoDato = string | { nombre?: string; codigo?: string } | null | undefined;

type SeleccionConGrupo = Seleccion & {
  id?: string;
  grupo?: GrupoDato;
  grupoNombre?: string;
  grupoCodigo?: string;
};

type PartidoConGrupo = PartidoConRelaciones & {
  seleccionLocalId?: string;
  seleccionVisitanteId?: string;
  seleccionLocal?: SeleccionConGrupo;
  seleccionVisitante?: SeleccionConGrupo;
  local?: SeleccionConGrupo;
  visitante?: SeleccionConGrupo;
};

function normalizarGrupo(valor: string | undefined | null) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .replace("GRUPO", "")
    .trim();
}

function obtenerGrupoSeleccion(seleccion?: SeleccionConGrupo | null) {
  if (!seleccion) return "";

  if (typeof seleccion.grupo === "string") {
    return seleccion.grupo;
  }

  if (typeof seleccion.grupo === "object" && seleccion.grupo !== null) {
    return seleccion.grupo || "";
  }

  return seleccion.grupoCodigo || seleccion.grupoNombre || "";
}

function buscarSeleccionPorId(
  selecciones: Seleccion[],
  seleccionId?: string
): SeleccionConGrupo | undefined {
  if (!seleccionId) return undefined;

  return selecciones.find((seleccion) => {
    const seleccionConId = seleccion as SeleccionConGrupo;
    return seleccionConId.id === seleccionId;
  }) as SeleccionConGrupo | undefined;
}

export function usePartidosPorGrupo(group: string) {
  const [partidos, setPartidos] = useState<PartidoConRelaciones[]>([]);
  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);

  const [loading, setLoading] = useState(true);
  const [cargandoApi, setCargandoApi] = useState(false);
  const [actualizandoResultadosApi, setActualizandoResultadosApi] =
    useState(false);
  const [actualizandoResultadosMock, setActualizandoResultadosMock] =
    useState(false);
  const [busqueda, setBusqueda] = useState("");

  const loadData = useCallback(async (loadOptions?: { silent?: boolean }) => {
    try {
      if (!loadOptions?.silent) {
        setLoading(true);
      }

      const [partidosList, optionsData] = await Promise.all([
        getPartidos(),
        getPartidosOptions(),
      ]);

      setPartidos(partidosList);
      setSelecciones(optionsData.selecciones);
      setFases(optionsData.fases);
    } catch (error) {
      console.error("Error cargando partidos por grupo:", error);
      setPartidos([]);
      toast.error("Error al cargar los partidos del grupo");
    } finally {
      if (!loadOptions?.silent) {
        setLoading(false);
      }
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

  const partidosDelGrupo = useMemo(() => {
    const grupoActual = normalizarGrupo(group);

    return partidos.filter((partidoOriginal) => {
      const partido = partidoOriginal as PartidoConGrupo;

      const seleccionLocal =
        partido.seleccionLocal ||
        partido.local ||
        buscarSeleccionPorId(selecciones, partido.seleccionLocalId);

      const seleccionVisitante =
        partido.seleccionVisitante ||
        partido.visitante ||
        buscarSeleccionPorId(selecciones, partido.seleccionVisitanteId);

      const grupoLocal = normalizarGrupo(obtenerGrupoSeleccion(seleccionLocal));
      const grupoVisitante = normalizarGrupo(
        obtenerGrupoSeleccion(seleccionVisitante)
      );

      return grupoLocal === grupoActual || grupoVisitante === grupoActual;
    });
  }, [partidos, selecciones, group]);

  const partidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return partidosDelGrupo
      .filter((partido) => {
        if (!texto) return true;

        return buildPartidoSearchText(partido, selecciones, fases).includes(
          texto
        );
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [partidosDelGrupo, busqueda, selecciones, fases]);

  const partidosAgrupados = useMemo<GrupoPartidos[]>(() => {
    return groupPartidosByDate(partidosFiltrados);
  }, [partidosFiltrados]);

  return {
    partidos: partidosDelGrupo,
    selecciones,
    fases,

    loading,
    cargandoApi,
    actualizandoResultadosApi,
    actualizandoResultadosMock,

    busqueda,
    setBusqueda,

    partidosFiltrados,
    partidosAgrupados,

    loadData,
    handleCargarDesdeApi,
    handleActualizarResultadosDesdeApi,
    handleActualizarResultadosMock,
  };
}
