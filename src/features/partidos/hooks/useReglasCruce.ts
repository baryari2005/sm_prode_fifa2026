"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { ReglaCruce } from "@/features/partidos/types/types";

type ReglasCruceApiResponse = {
  data?: ReglaCruce[];
  reglas?: ReglaCruce[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeReglasCruceResponse(raw: unknown): ReglaCruce[] {
  if (Array.isArray(raw)) {
    return raw as ReglaCruce[];
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const typed = raw as ReglasCruceApiResponse;

  if (Array.isArray(typed.data)) {
    return typed.data;
  }

  if (Array.isArray(typed.reglas)) {
    return typed.reglas;
  }

  return [];
}

export function useReglasCruce() {
  const [reglas, setReglas] = useState<ReglaCruce[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/reglas-cruces?page=1&pageSize=300", {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Error al cargar las reglas de cruces");
      }

      const raw = await res.json();
      const reglasNormalizadas = normalizeReglasCruceResponse(raw);

      setReglas(reglasNormalizadas);
    } catch (error) {
      console.error("Error cargando reglas de cruces:", error);
      toast.error("Error al cargar las reglas de cruces");
      setReglas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRegla = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/reglas-cruces/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Error al eliminar la regla");
      }

      setReglas((current) => current.filter((regla) => regla.id !== id));
      toast.success("Regla eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando regla:", error);
      toast.error("No se pudo eliminar la regla");
    }
  }, []);

  return {
    reglas,
    loading,
    loadData,
    deleteRegla,
  };
}