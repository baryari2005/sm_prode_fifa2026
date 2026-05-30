"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EstadoPartido } from "@prisma/client";
import { toast } from "sonner";

import {
  getLiveControlMatches,
  patchLiveStatus,
  postManualGoal,
  recalculateRankingManually,
  runLiveTool,
  syncAllLiveNow,
  syncMatchNow,
} from "@/features/live-control/services/live-control-client.service";
import type {
  LiveActionResponse,
  LiveControlMatchesResponse,
} from "@/features/live-control/types/live-control.types";

export function useLiveControlPage() {
  const [matchGroups, setMatchGroups] = useState<LiveControlMatchesResponse>({
    live: [],
    proximos: [],
    noCerrados: [],
  });
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [toolResponse, setToolResponse] = useState<LiveActionResponse | Record<string, unknown> | null>(null);
  const [executingTool, setExecutingTool] = useState(false);
  const [recalculatingRanking, setRecalculatingRanking] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const data = await getLiveControlMatches();
      setMatchGroups(data);
    } catch (error) {
      toast.error("No se pudo cargar el panel live.");
      console.error(error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const matches = useMemo(
    () => [...matchGroups.live, ...matchGroups.proximos, ...matchGroups.noCerrados],
    [matchGroups],
  );

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === selectedMatchId) ?? null,
    [matches, selectedMatchId],
  );

  async function handleSyncAll() {
    try {
      setSyncingAll(true);
      const result = await syncAllLiveNow();
      toast.success(result.message ?? "Sincronización ejecutada.");
      await load(true);
    } catch (error) {
      toast.error("No se pudo sincronizar ahora.");
      console.error(error);
    } finally {
      setSyncingAll(false);
    }
  }

  async function handleSyncMatch(partidoId: string) {
    try {
      const result = await syncMatchNow(partidoId);
      toast.success(result.message ?? "Partido sincronizado.");
      await load(true);
    } catch (error) {
      toast.error("No se pudo sincronizar el partido.");
      console.error(error);
    }
  }

  async function handleManualGoal(payload: {
    partidoId: string;
    team: "LOCAL" | "VISITANTE";
    minute: number;
    playerId?: string;
    description?: string;
  }) {
    try {
      const result = await postManualGoal(payload.partidoId, payload);
      toast.success(result.message ?? "Gol manual cargado.");
      await load(true);
    } catch (error) {
      toast.error("No se pudo cargar el gol.");
      console.error(error);
    }
  }

  async function handleStatusChange(payload: {
    partidoId: string;
    estado: EstadoPartido;
    minuto?: number | null;
    observacion?: string | null;
  }) {
    try {
      const result = await patchLiveStatus(payload.partidoId, payload);
      toast.success(result.message ?? "Estado actualizado.");
      await load(true);
    } catch (error) {
      toast.error("No se pudo actualizar el estado.");
      console.error(error);
    }
  }

  async function handleRunTool(payload: {
    action: string;
    partidoId?: string;
    payload?: Record<string, unknown>;
  }) {
    try {
      setExecutingTool(true);
      const result = await runLiveTool(payload);
      setToolResponse(result);
      toast.success(result.message ?? "Acción ejecutada.");
      await load(true);
    } catch (error: unknown) {
      const apiResponse =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: unknown } }).response === "object"
          ? (error as { response?: { data?: Record<string, unknown> } }).response?.data
          : undefined;
      setToolResponse(
        apiResponse ?? {
          status: "error",
          message: "No se pudo ejecutar la acción.",
          timestamp: new Date().toISOString(),
        },
      );
      toast.error(
        typeof apiResponse?.message === "string"
          ? apiResponse.message
          : "No se pudo ejecutar la acción.",
      );
    } finally {
      setExecutingTool(false);
    }
  }

  async function handleRecalculateRanking() {
    try {
      setRecalculatingRanking(true);
      const result = await recalculateRankingManually();
      setToolResponse(result);
      toast.success(result.message ?? "Ranking recalculado correctamente");
      await load(true);
    } catch (error) {
      toast.error("No se pudo recalcular el ranking");
      console.error(error);
    } finally {
      setRecalculatingRanking(false);
    }
  }

  return {
    matches,
    matchGroups,
    loading,
    syncingAll,
    selectedMatchId,
    selectedMatch,
    toolResponse,
    executingTool,
    recalculatingRanking,
    setSelectedMatchId,
    load,
    handleSyncAll,
    handleSyncMatch,
    handleManualGoal,
    handleStatusChange,
    handleRunTool,
    handleRecalculateRanking,
  };
}
