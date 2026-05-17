"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import {
  deleteJugador,
  importPlantel,
  importPlantelDesdeApi,
} from "@/features/partidos/services/plantel.service";

import {
  mapRowsToPlantel,
  parseImportFile,
} from "@/features/partidos/services/fixture-import.service";
import {
  PaginatedResponse,
  PlantelImportReport,
  SeleccionResumen,
} from "../types/plantel-manager.types";


type UsePlantelManagerProps = {
  initialSeleccionId?: string;
};

export function usePlantelManager({
  initialSeleccionId,
}: UsePlantelManagerProps) {
  const [selecciones, setSelecciones] = useState<SeleccionResumen[]>([]);
  const [selectedSeleccionId, setSelectedSeleccionId] = useState(
    initialSeleccionId ?? ""
  );

  const [totalJugadores, setTotalJugadores] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);

  const [loadingSelecciones, setLoadingSelecciones] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importingApi, setImportingApi] = useState(false);
  const [importReport, setImportReport] = useState<PlantelImportReport | null>(
    null
  );

  const selectedSeleccion = useMemo(() => {
    return (
      selecciones.find((seleccion) => seleccion.id === selectedSeleccionId) ??
      null
    );
  }, [selecciones, selectedSeleccionId]);

  const stats = useMemo(() => {
    return {
      totalJugadores,
      totalArqueros: 0,
      totalCampo: totalJugadores,
    };
  }, [totalJugadores]);

  useEffect(() => {
    async function loadSelecciones() {
      try {
        setLoadingSelecciones(true);

        const response = await axiosInstance.get<
          PaginatedResponse<SeleccionResumen>
        >("/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc");

        const items = response.data.data ?? [];

        setSelecciones(items);

        const targetId = initialSeleccionId ?? items[0]?.id ?? "";

        setSelectedSeleccionId(targetId);
        setTotalJugadores(0);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar las selecciones");
      } finally {
        setLoadingSelecciones(false);
      }
    }

    void loadSelecciones();
  }, [initialSeleccionId]);

  useEffect(() => {
    setTotalJugadores(0);
  }, [selectedSeleccionId]);

  async function handleDelete(playerId: string) {
    try {
      await deleteJugador(playerId);

      toast.success("Jugador eliminado");
      setRefreshToken((current) => current + 1);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el jugador");
    }
  }

  async function handleImport(file: File | null) {
    if (!file || !selectedSeleccionId) return;

    try {
      setImporting(true);

      const rows = await parseImportFile(file);
      const items = mapRowsToPlantel(rows, selectedSeleccionId);

      const result = await importPlantel(selectedSeleccionId, items);
      setRefreshToken((current) => current + 1);
      setImportReport({
        title: "Importacion por archivo completada",
        description: "Se reemplazo el plantel actual con los jugadores del archivo.",
        items: [
          {
            seleccionId: selectedSeleccionId,
            seleccionNombre: selectedSeleccion?.nombre ?? "Seleccion actual",
            imported: result.summary.imported,
            cleared: result.summary.cleared,
            source: "file",
          },
        ],
      });

      toast.success(
        `Se reemplazo el plantel y se cargaron ${result.summary.imported} jugadores`
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo importar el archivo");
    } finally {
      setImporting(false);
    }
  }

  async function handleImportFromApi() {
    if (!selectedSeleccionId) return;

    try {
      setImportingApi(true);

      const result = await importPlantelDesdeApi(selectedSeleccionId);
      setRefreshToken((current) => current + 1);
      setImportReport({
        title: "Importacion desde API completada",
        description: "Se reemplazo el plantel actual con la version recibida desde la API.",
        items: [
          {
            seleccionId: selectedSeleccionId,
            seleccionNombre:
              result.summary.seleccionNombre ??
              selectedSeleccion?.nombre ??
              "Seleccion actual",
            imported: result.summary.imported,
            cleared: result.summary.cleared,
            source: "api",
          },
        ],
      });

      toast.success(
        `Se reemplazo el plantel y se cargaron ${result.summary.imported} jugadores desde la API`
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo importar el plantel desde la API");
    } finally {
      setImportingApi(false);
    }
  }

  return {
    selecciones,
    selectedSeleccionId,
    selectedSeleccion,
    refreshToken,

    loadingInitial: loadingSelecciones && selecciones.length === 0,

    importing,
    importingApi,
    importReport,

    stats,

    setSelectedSeleccionId,
    setTotalJugadores,

    handleDelete,
    handleImport,
    handleImportFromApi,
  };
}
