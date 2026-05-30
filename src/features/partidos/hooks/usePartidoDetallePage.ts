"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { detectGoalEvents } from "@/features/partidos/lib/goal-events";
import {
  DEFAULT_TEAM_LINEUP,
  DEFAULT_TEAM_STATS,
} from "@/features/partidos/types/fixture-details";
import type { GoalDetail, TeamLineup } from "@/features/partidos/types/fixture-details";
import { getGrupoNombre } from "@/features/partidos/utils/partidos-ui.helpers";
import { resolveBanderaSrc } from "@/lib/flags";
import { useGoalCelebrationStore } from "@/stores/goal-celebration";

import type { Partido, Resultado } from "@/features/partidos/types/types";
import type { PartidoDetalleViewModel } from "@/features/partidos/types/partido-detalle.types";

import {
  getPartidoDetalle,
  getResultado,
} from "@/features/partidos/services/resultado.service";

type UsePartidoDetallePageParams = {
  partidoId: string;
  canVer: boolean;
  redirectTo?: string;
};

type LoadDataOptions = {
  silent?: boolean;
};

function applyGoalDetailsToLineup(
  lineup: TeamLineup,
  goalDetails?: GoalDetail[] | null
): TeamLineup {
  const goalMap = new Map<string, number>();

  for (const goal of goalDetails ?? []) {
    goalMap.set(goal.jugadorId, (goalMap.get(goal.jugadorId) ?? 0) + 1);
  }

  const applyGoals = (players: TeamLineup["titulares"]) =>
    players.map((player) => ({
      ...player,
      goals: goalMap.get(player.jugadorId) ?? player.goals ?? 0,
    }));

  return {
    ...lineup,
    titulares: applyGoals(lineup.titulares),
    suplentes: applyGoals(lineup.suplentes),
  };
}

export function usePartidoDetallePage({
  partidoId,
  canVer,
  redirectTo = "/partidos",
}: UsePartidoDetallePageParams) {
  const router = useRouter();

  const [partido, setPartido] = useState<Partido | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const previousPartidoRef = useRef<Partido | null>(null);
  const hasLoadedRef = useRef(false);
  const enqueueGoalEvents = useGoalCelebrationStore(
    (state) => state.enqueueEvents,
  );

  const loadData = useCallback(async (options?: LoadDataOptions) => {
    if (!canVer || !partidoId) return;

    try {
      if (options?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [partidoData, resultadoData] = await Promise.all([
        getPartidoDetalle(partidoId),
        getResultado(partidoId),
      ]);

      const nextPartido = {
        ...partidoData,
        resultado: resultadoData,
      } as Partido;

      if (hasLoadedRef.current && previousPartidoRef.current) {
        enqueueGoalEvents(
          detectGoalEvents(
            [previousPartidoRef.current as never],
            [nextPartido as never],
          ),
        );
      }

      setPartido(partidoData);
      setResultado(resultadoData);
      previousPartidoRef.current = nextPartido;
      hasLoadedRef.current = true;
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar el detalle del partido");
      router.push(redirectTo);
    } finally {
      if (options?.silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [canVer, enqueueGoalEvents, partidoId, redirectTo, router]);

  const detalle = useMemo<PartidoDetalleViewModel | null>(() => {
    if (!partido) return null;

    const localNombre = partido.seleccionLocal?.nombre ?? "Local";
    const visitanteNombre = partido.seleccionVisitante?.nombre ?? "Visitante";
    const localCodigo = partido.seleccionLocal?.codigo ?? null;
    const visitanteCodigo = partido.seleccionVisitante?.codigo ?? null;
    const localEscudo = resolveBanderaSrc(
      partido.seleccionLocal?.bandera ?? null,
      localCodigo
    );
    const visitanteEscudo = resolveBanderaSrc(
      partido.seleccionVisitante?.bandera ?? null,
      visitanteCodigo
    );

    const marcador = resultado
      ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
      : "Sin resultado cargado";
    const fechaTexto = format(new Date(partido.fecha), "EEEE d MMM yyyy · HH:mm", {
      locale: es,
    });
    const estado = resultado?.estado ?? "PENDIENTE";
    const fase = partido.fase?.nombre ?? undefined;
    const grupo = getGrupoNombre(partido);
    const lineupLocal = applyGoalDetailsToLineup(
      resultado?.alineacionLocal ?? DEFAULT_TEAM_LINEUP,
      resultado?.detalleGolesLocal
    );
    const lineupVisitante = applyGoalDetailsToLineup(
      resultado?.alineacionVisitante ?? DEFAULT_TEAM_LINEUP,
      resultado?.detalleGolesVisitante
    );

    return {
      partidoId,
      partido,
      resultado,
      marcador,
      competencia: "Mundial 2026",
      fechaTexto,
      estado,
      fase,
      grupo,
      jornada: undefined,

      local: {
        id: partido.seleccionLocalId,
        nombre: localNombre,
        codigo: localCodigo,
        escudoUrl: localEscudo,
      },

      visitante: {
        id: partido.seleccionVisitanteId,
        nombre: visitanteNombre,
        codigo: visitanteCodigo,
        escudoUrl: visitanteEscudo,
      },

      statsLocal: resultado?.estadisticasLocal ?? DEFAULT_TEAM_STATS,
      statsVisitante: resultado?.estadisticasVisitante ?? DEFAULT_TEAM_STATS,

      lineupLocal,
      lineupVisitante,
      incidencias: resultado?.incidencias ?? [],
    };
  }, [partido, resultado, partidoId]);

  return {
    detalle,
    loading,
    refreshing,
    loadData,
  };
}
