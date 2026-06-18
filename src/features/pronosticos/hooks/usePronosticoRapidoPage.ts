"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { usePronosticosPage } from "@/features/pronosticos/hooks/usePronosticosPage";
import {
  bulkUpsertPronosticos,
  PronosticosApiError,
} from "@/features/pronosticos/services/pronosticos.service";
import {
  getFixturePhaseLabel,
  getFixturePhaseSlugFromText,
} from "@/features/partidos/constants/fixture-phase-filter.constants";
import {
  getFaseNombre,
  hasMatchStartedForPrediction,
  isPredictionBlocked,
  isPredictionClosed,
} from "@/features/partidos/utils/partidos-ui.helpers";
import {
  getGrupoFilterValue,
  getInitialPredictionValue,
  isEmptyPrediction,
  isPartialPrediction,
  onlyNumbers,
  valuesAreEqual,
} from "@/features/pronosticos/helpers/pronostico-rapido.helpers";
import type {
  PartidoPronosticoRapido,
  PhaseFilterValue,
  PronosticoRapidoErrors,
  PronosticoRapidoField,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

export function usePronosticoRapidoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null,
  );
  const [values, setValues] = useState<Record<string, PronosticoRapidoValue>>(
    {},
  );
  const [initialValues, setInitialValues] = useState<
    Record<string, PronosticoRapidoValue>
  >({});
  const [errors, setErrors] = useState<PronosticoRapidoErrors>({});
  const [saving, setSaving] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const {
    partidos,
    partidosAgrupados,
    hasVisibleLiveMatches,
    loading,
    busqueda,
    setBusqueda,
    loadData,
  } = usePronosticosPage();

  const faseParam = searchParams.get("fase") ?? "";
  const faseActiva = faseParam
    ? getFixturePhaseSlugFromText(faseParam)
    : "grupos";
  const faseActivaLabel = faseActiva
    ? getFixturePhaseLabel(faseActiva)
    : "Todas las fases";
  const mostrandoFaseGrupos = faseActiva === "grupos";

  const partidosById = useMemo(() => {
    const map = new Map<string, PartidoPronosticoRapido>();

    partidos.forEach((partido) => {
      const partidoRapido = partido as PartidoPronosticoRapido;
      map.set(partidoRapido.id, partidoRapido);
    });

    return map;
  }, [partidos]);

  const partidosAgrupadosPorFase = useMemo(() => {
    if (!faseActiva) return partidosAgrupados;

    return partidosAgrupados
      .map((grupo) => ({
        ...grupo,
        partidos: grupo.partidos.filter((partido) => {
          const partidoRapido = partido as PartidoPronosticoRapido;
          const faseNombre = getFaseNombre(partidoRapido, []);
          const partidoFaseSlug = getFixturePhaseSlugFromText(faseNombre);

          return partidoFaseSlug === faseActiva;
        }),
      }))
      .filter((grupo) => grupo.partidos.length > 0);
  }, [partidosAgrupados, faseActiva]);

  const gruposDisponibles = useMemo(() => {
    if (!mostrandoFaseGrupos) return [];

    const grupos = new Set<string>();

    partidosAgrupadosPorFase.forEach((grupoFecha) => {
      grupoFecha.partidos.forEach((partido) => {
        const partidoRapido = partido as PartidoPronosticoRapido;
        const grupo = getGrupoFilterValue(partidoRapido);

        if (grupo) {
          grupos.add(grupo);
        }
      });
    });

    return Array.from(grupos).sort((a, b) =>
      a.localeCompare(b, "es", { numeric: true }),
    );
  }, [partidosAgrupadosPorFase, mostrandoFaseGrupos]);

  const partidosAgrupadosVisibles = useMemo(() => {
    const gruposBase = !mostrandoFaseGrupos
      ? partidosAgrupadosPorFase
      : grupoSeleccionado === null
        ? partidosAgrupadosPorFase
        : partidosAgrupadosPorFase
            .map((grupoFecha) => ({
              ...grupoFecha,
              partidos: grupoFecha.partidos.filter((partido) => {
                const partidoRapido = partido as PartidoPronosticoRapido;
                const grupo = getGrupoFilterValue(partidoRapido);

                return grupo === grupoSeleccionado;
              }),
            }))
            .filter((grupoFecha) => grupoFecha.partidos.length > 0);

    if (!showOnlyPending) {
      return gruposBase;
    }

    return gruposBase
      .map((grupoFecha) => ({
        ...grupoFecha,
        partidos: grupoFecha.partidos.filter((partido) => {
          const partidoRapido = partido as PartidoPronosticoRapido;

          return !isPredictionBlocked(partidoRapido);
        }),
      }))
      .filter((grupoFecha) => grupoFecha.partidos.length > 0);
  }, [
    grupoSeleccionado,
    partidosAgrupadosPorFase,
    mostrandoFaseGrupos,
    showOnlyPending,
  ]);

  const modifiedEntries = useMemo(() => {
    return Object.entries(values).filter(([partidoId, currentValue]) => {
      const initialValue = initialValues[partidoId];

      if (!initialValue) return false;

      return !valuesAreEqual(currentValue, initialValue);
    });
  }, [values, initialValues]);

  const pendingChangesCount = modifiedEntries.length;

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (partidos.length === 0) return;

    const nextValues: Record<string, PronosticoRapidoValue> = {};

    partidos.forEach((partido) => {
      const partidoRapido = partido as PartidoPronosticoRapido;
      nextValues[partidoRapido.id] = getInitialPredictionValue(partidoRapido);
    });

    setValues(nextValues);
    setInitialValues(nextValues);
    setErrors({});
  }, [partidos]);

  useEffect(() => {
    if (!mostrandoFaseGrupos) {
      setGrupoSeleccionado(null);
      return;
    }

    if (gruposDisponibles.length === 0) {
      setGrupoSeleccionado(null);
      return;
    }

    if (!grupoSeleccionado || !gruposDisponibles.includes(grupoSeleccionado)) {
      setGrupoSeleccionado(gruposDisponibles[0] ?? null);
    }
  }, [mostrandoFaseGrupos, gruposDisponibles, grupoSeleccionado]);

  function handlePhaseChange(nextFase: PhaseFilterValue) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFase) {
      params.set("fase", nextFase);
    } else {
      params.delete("fase");
    }

    setGrupoSeleccionado(null);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function updateScore(
    partidoId: string,
    field: PronosticoRapidoField,
    value: string,
  ) {
    const cleanValue = onlyNumbers(value);

    setValues((prev) => ({
      ...prev,
      [partidoId]: {
        golesLocal: prev[partidoId]?.golesLocal ?? "",
        golesVisitante: prev[partidoId]?.golesVisitante ?? "",
        [field]: cleanValue,
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[partidoId];
      return next;
    });
  }

  function validateBeforeSave() {
    const nextErrors: PronosticoRapidoErrors = {};

    modifiedEntries.forEach(([partidoId, value]) => {
      const partido = partidosById.get(partidoId);
      const initialValue = initialValues[partidoId] ?? {
        golesLocal: "",
        golesVisitante: "",
      };

      if (partido && hasMatchStartedForPrediction(partido)) {
        nextErrors[partidoId] =
          "El pronostico de este partido ya no se puede modificar porque el partido esta iniciado";
        return;
      }

      if (partido && isPredictionClosed(partido)) {
        nextErrors[partidoId] =
          "El pronostico de este partido ya esta cerrado";
        return;
      }

      if (isPartialPrediction(value)) {
        nextErrors[partidoId] = "Complete ambos resultados";
        return;
      }

      if (isEmptyPrediction(value) && !isEmptyPrediction(initialValue)) {
        nextErrors[partidoId] = "Complete ambos resultados";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSaveAll() {
    if (saving) return;

    const isValid = validateBeforeSave();
    if (!isValid) return;

    const payload = modifiedEntries
      .filter(([, value]) => {
        return value.golesLocal !== "" && value.golesVisitante !== "";
      })
      .map(([partidoId, value]) => ({
        partidoId,
        golesLocal: Number(value.golesLocal),
        golesVisitante: Number(value.golesVisitante),
      }));

    if (payload.length === 0) return;

    setSaving(true);

    try {
      const result = await bulkUpsertPronosticos(payload);

      if (result.errors.length > 0) {
        const nextErrors: PronosticoRapidoErrors = {};

        result.errors.forEach((item) => {
          nextErrors[item.partidoId] = item.message;
        });

        setErrors(nextErrors);
      }

      if (result.savedCount > 0) {
        toast.success(result.message);
        await loadData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof PronosticosApiError && error.status === 400) {
        toast.error(
          "El partido ya cerro para pronosticar. Actualizamos la informacion.",
        );
        await loadData();
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Ocurrio un error al guardar los pronosticos",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return {
    loading,
    saving,
    partidos,
    busqueda,
    faseActiva,
    faseActivaLabel,
    mostrandoFaseGrupos,
    gruposDisponibles,
    grupoSeleccionado,
    hasVisibleLiveMatches,
    showOnlyPending,
    partidosAgrupadosVisibles,
    values,
    errors,
    pendingChangesCount,
    loadData,
    setBusqueda,
    setGrupoSeleccionado,
    setShowOnlyPending,
    handlePhaseChange,
    updateScore,
    handleSaveAll,
  };
}
