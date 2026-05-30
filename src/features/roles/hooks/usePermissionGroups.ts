"use client";

import { useEffect, useMemo, useState } from "react";

import { axiosInstance } from "@/lib/axios";
import type { PermisosGrupo } from "../types/types";

export function usePermissionGroups(enabled: boolean) {
  const [groups, setGroups] = useState<PermisosGrupo[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setGroups([]);
      setLoading(false);
      return;
    }

    let active = true;

    async function loadPermissionGroups() {
      setLoading(true);

      try {
        const { data } = await axiosInstance.get("/permisos", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!active) return;

        setGroups(data?.data ?? []);
      } catch (error) {
        if (!active) return;

        console.error("Error al cargar permisos agrupados:", error);
        setGroups([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPermissionGroups();

    return () => {
      active = false;
    };
  }, [enabled]);

  const totalPermissions = useMemo(
    () => groups.reduce((acc, group) => acc + group.permisos.length, 0),
    [groups],
  );

  return {
    groups,
    loading,
    totalModules: groups.length,
    totalPermissions,
  };
}
