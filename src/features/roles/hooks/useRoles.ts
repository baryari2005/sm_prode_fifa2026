"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import type { Role } from "../types/types";

export function useRoles(enabled: boolean) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data } = await axiosInstance.get("/roles", {
          headers: {
            "Cache-Control": "no-cache",
          },
          params: {
            page: 1,
            pageSize: 100,
            sortBy: "nombre",
            sortDir: "asc",
          },
        });
        setRoles(data.data ?? []);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [enabled]);

  return {
    roles,
    loading,
  };
}
