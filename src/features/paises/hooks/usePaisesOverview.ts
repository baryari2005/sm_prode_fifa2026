"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { axiosInstance } from "@/lib/axios";

import type { Pais } from "../types/types";
import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";

type PaisesResponse = {
  data?: Pais[];
};

type TablaPosicionesResponse = {
  tabla?: PosicionEquipo[];
};

export function usePaisesOverview(refreshToken: number | string) {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadPaises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [paisesResponse, tablaResponse] = await Promise.allSettled([
        axiosInstance.get<PaisesResponse>("/paises", {
          headers: {
            "Cache-Control": "no-cache",
          },
          params: {
            page: 1,
            pageSize: 80,
            sortBy: "grupo",
            sortDir: "asc",
          },
        }),
        axiosInstance.get<TablaPosicionesResponse>("/tabla-posiciones", {
          headers: {
            "Cache-Control": "no-cache",
          },
        }),
      ]);

      if (paisesResponse.status !== "fulfilled") {
        throw paisesResponse.reason;
      }

      const puntosPorSeleccionId =
        tablaResponse.status === "fulfilled"
          ? new Map(
              (tablaResponse.value.data?.tabla ?? []).map((row) => [
                row.seleccionId,
                row.puntos,
              ]),
            )
          : new Map<string, number>();

      const nextPaises = (paisesResponse.value.data?.data ?? []).map((pais) => ({
        ...pais,
        puntos: puntosPorSeleccionId.get(pais.id) ?? 0,
      }));

      setPaises(nextPaises);
    } catch (loadError) {
      console.error("Error cargando selecciones:", loadError);
      setError("No se pudieron cargar las selecciones.");
      setPaises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPaises();
  }, [loadPaises, refreshToken]);

  const filteredPaises = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return paises;

    return paises.filter((pais) => {
      return [
        pais.nombre,
        pais.codigo,
        pais.grupo ?? "",
        pais.confederacion ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [paises, search]);

  return {
    error,
    filteredPaises,
    loading,
    paises,
    search,
    setSearch,
  };
}
