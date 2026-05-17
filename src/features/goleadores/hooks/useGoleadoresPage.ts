"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import type { Goleador } from "@/features/goleadores/types/types";
import { getGoleadores } from "@/features/goleadores/services/goleadores.service";

export function useGoleadoresPage() {
  const [goleadores, setGoleadores] = useState<Goleador[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoApi, setCargandoApi] = useState(false);
  const [cargandoMock, setCargandoMock] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [source, setSource] = useState<"api" | "mock" | "db" | null>(null);

  const loadFromApi = useCallback(async () => {
    try {
      setCargandoApi(true);
      const result = await getGoleadores(false);
      setGoleadores(result.goleadores);
      setSource(result.source);
      toast.success(
        result.source === "db"
          ? "Goleadores cargados desde la base"
          : "Goleadores cargados desde API"
      );
    } catch (error) {
      console.error("Error cargando goleadores desde API:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar goleadores desde API"
      );
    } finally {
      setCargandoApi(false);
    }
  }, []);

  const loadFromMock = useCallback(async () => {
    try {
      setCargandoMock(true);
      const result = await getGoleadores(true);
      setGoleadores(result.goleadores);
      setSource(result.source);
      toast.success("Goleadores mock cargados correctamente");
    } catch (error) {
      console.error("Error cargando goleadores mock:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar goleadores mock"
      );
    } finally {
      setCargandoMock(false);
    }
  }, []);

  const loadInitialMock = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getGoleadores(true);
      setGoleadores(result.goleadores);
      setSource(result.source);
    } catch (error) {
      console.error("Error cargando goleadores iniciales:", error);
      setGoleadores([]);
      toast.error("No se pudieron cargar los goleadores iniciales");
    } finally {
      setLoading(false);
    }
  }, []);

  const goleadoresFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return goleadores.filter((goleador) => {
      if (!texto) return true;

      return [
        goleador.nombre,
        goleador.nacionalidad,
        goleador.posicion,
        goleador.seleccion,
        goleador.codigoSeleccion,
      ]
        .join(" ")
        .toLowerCase()
        .includes(texto);
    });
  }, [goleadores, busqueda]);

  return {
    goleadores,
    goleadoresFiltrados,
    loading,
    cargandoApi,
    cargandoMock,
    busqueda,
    setBusqueda,
    source,
    loadInitialMock,
    loadFromApi,
    loadFromMock,
  };
}
