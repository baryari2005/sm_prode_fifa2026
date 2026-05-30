"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  calcularTablasPorGrupo,
} from "@/features/world-cup-simulator/engine/standings";
import { obtenerClasificados } from "@/features/world-cup-simulator/engine/qualification";
import {
  generarCruces32avos,
  generarSiguienteRonda,
  generarTercerPuesto,
  getWinner,
  obtenerCampeon,
} from "@/features/world-cup-simulator/engine/knockout";
import { resolveThirdPlaceAssignments } from "@/features/world-cup-simulator/engine/thirdPlaceCombinations";
import type {
  KnockoutMatch,
  KnockoutRounds,
  SimulatorGroup,
  SimulatorMatch,
} from "@/features/world-cup-simulator/engine/types";

type BaseResponse = {
  grupos: SimulatorGroup[];
  message?: string;
};

type KnockoutPatch = {
  golesLocal?: number | null;
  golesVisitante?: number | null;
  penaltyWinner?: "local" | "visitante" | null;
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function applyPatch(match: KnockoutMatch, patch?: KnockoutPatch) {
  if (!patch) return match;

  return {
    ...match,
    golesLocal: patch.golesLocal ?? null,
    golesVisitante: patch.golesVisitante ?? null,
    penaltyWinner: patch.penaltyWinner ?? null,
    ganador: null,
  };
}

export function useWorldCupSimulator() {
  const [baseGroups, setBaseGroups] = useState<SimulatorGroup[]>([]);
  const [matches, setMatches] = useState<SimulatorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knockoutState, setKnockoutState] = useState<Record<string, KnockoutPatch>>({});

  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/simulador-mundial/base", {
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      const data = (await response.json()) as BaseResponse;

      if (!response.ok) {
        throw new Error(data.message || "No se pudo cargar el simulador.");
      }

      setBaseGroups(data.grupos ?? []);
      setMatches((data.grupos ?? []).flatMap((grupo) => grupo.partidos));
      setKnockoutState({});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar el simulador.";
      setError(message);
      setBaseGroups([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBaseData();
  }, [loadBaseData]);

  const grupos = useMemo(() => {
    const matchesById = new Map(matches.map((match) => [match.id, match]));

    return baseGroups.map((group) => ({
      ...group,
      partidos: group.partidos.map((match) => matchesById.get(match.id) ?? match),
    }));
  }, [baseGroups, matches]);

  const standingsByGroup = useMemo(() => calcularTablasPorGrupo(matches), [matches]);
  const qualifiedTeams = useMemo(
    () => obtenerClasificados(standingsByGroup),
    [standingsByGroup],
  );
  const bestThirds = qualifiedTeams.mejoresTerceros;
  const missingCombination =
    bestThirds.length === 8 &&
    !resolveThirdPlaceAssignments(bestThirds.map((team) => team.grupo).sort());

  const roundOf32Base = useMemo(
    () => generarCruces32avos(qualifiedTeams),
    [qualifiedTeams],
  );

  const roundOf32 = useMemo(
    () => roundOf32Base.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, roundOf32Base],
  );

  const roundOf16Base = useMemo(() => generarSiguienteRonda(roundOf32), [roundOf32]);
  const roundOf16 = useMemo(
    () => roundOf16Base.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, roundOf16Base],
  );

  const quarterBase = useMemo(() => generarSiguienteRonda(roundOf16), [roundOf16]);
  const quarterFinals = useMemo(
    () => quarterBase.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, quarterBase],
  );

  const semiBase = useMemo(() => generarSiguienteRonda(quarterFinals), [quarterFinals]);
  const semiFinals = useMemo(
    () => semiBase.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, semiBase],
  );

  const finalBase = useMemo(() => generarSiguienteRonda(semiFinals), [semiFinals]);
  const final = useMemo(
    () => finalBase.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, finalBase],
  );

  const thirdPlaceBase = useMemo(() => generarTercerPuesto(semiFinals), [semiFinals]);
  const thirdPlace = useMemo(
    () => thirdPlaceBase.map((match) => applyPatch(match, knockoutState[match.id])),
    [knockoutState, thirdPlaceBase],
  );

  const knockoutRounds = useMemo<KnockoutRounds>(
    () => ({
      roundOf32,
      roundOf16,
      quarterFinals,
      semiFinals,
      final,
      thirdPlace,
    }),
    [final, quarterFinals, roundOf16, roundOf32, semiFinals, thirdPlace],
  );

  const champion = useMemo(() => obtenerCampeon(final), [final]);
  const completedGroupMatches = matches.filter(
    (match) => match.golesLocal !== null && match.golesVisitante !== null,
  ).length;

  const updateGroupMatchScore = useCallback(
    (matchId: string, side: "local" | "visitante", value: number | null) => {
      setMatches((current) =>
        current.map((match) =>
          match.id === matchId
            ? {
                ...match,
                golesLocal: side === "local" ? value : match.golesLocal,
                golesVisitante: side === "visitante" ? value : match.golesVisitante,
              }
            : match,
        ),
      );
    },
    [],
  );

  const updateKnockoutScore = useCallback(
    (
      matchId: string,
      side: "local" | "visitante",
      value: number | null,
      penaltyWinner?: "local" | "visitante" | null,
    ) => {
      setKnockoutState((current) => {
        const existing = current[matchId] ?? {};
        const next: KnockoutPatch = {
          ...existing,
          golesLocal: side === "local" ? value : existing.golesLocal ?? null,
          golesVisitante: side === "visitante" ? value : existing.golesVisitante ?? null,
          penaltyWinner:
            penaltyWinner !== undefined ? penaltyWinner : existing.penaltyWinner ?? null,
        };

        return {
          ...current,
          [matchId]: next,
        };
      });
    },
    [],
  );

  const resetSimulation = useCallback(() => {
    setMatches((current) =>
      current.map((match) => ({
        ...match,
        golesLocal: null,
        golesVisitante: null,
      })),
    );
    setKnockoutState({});
  }, []);

  const randomizeGroupMatches = useCallback(() => {
    setMatches((current) =>
      current.map((match) => ({
        ...match,
        golesLocal: Math.floor(Math.random() * 5),
        golesVisitante: Math.floor(Math.random() * 5),
      })),
    );
    setKnockoutState({});
  }, []);

  return {
    loading,
    error,
    grupos,
    matches,
    standingsByGroup,
    qualifiedTeams,
    bestThirds,
    roundOf32,
    knockoutRounds,
    champion,
    completedGroupMatches,
    totalGroupMatches: matches.length,
    missingCombination,
    updateGroupMatchScore,
    updateKnockoutScore,
    resetSimulation,
    randomizeGroupMatches,
    reload: loadBaseData,
    getKnockoutWinner: getWinner,
  };
}
