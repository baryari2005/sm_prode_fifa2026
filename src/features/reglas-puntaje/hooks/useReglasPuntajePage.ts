"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  FaseResumen,
  ReglaPuntaje,
  ReglaPuntajeFormValues,
} from "../types/regla-puntaje.types";

import {
  getFases,
  getReglaPuntaje,
  guardarReglaPuntaje,
} from "../services/regla-puntaje.service";

const DEFAULT_VALUES: ReglaPuntajeFormValues = {
  faseId: null,
  puntosExacto: 3,
  puntosParcial: 1,
  puntosSinAcierto: 0,
};

export function useReglasPuntajePage() {
  const [fases, setFases] = useState<FaseResumen[]>([]);
  const [reglaActual, setReglaActual] = useState<ReglaPuntaje | null>(null);

  const [values, setValues] = useState<ReglaPuntajeFormValues>(DEFAULT_VALUES);

  const [loadingInicial, setLoadingInicial] = useState(true);
  const [loadingRegla, setLoadingRegla] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedFase = useMemo(
    () => fases.find((fase) => fase.id === values.faseId) ?? null,
    [fases, values.faseId]
  );

  const isFormDisabled =
    saving || loadingRegla || Boolean(reglaActual?.bloqueada);

  function updateField<K extends keyof ReglaPuntajeFormValues>(
    field: K,
    value: ReglaPuntajeFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function loadInitialData() {
    try {
      setLoadingInicial(true);

      const fasesData = await getFases();

      setFases(fasesData);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar las fases");
    } finally {
      setLoadingInicial(false);
    }
  }

  async function loadReglaPuntaje(faseId: number) {
    try {
      setLoadingRegla(true);

      const regla = await getReglaPuntaje({ faseId });

      setReglaActual(regla);

      if (regla) {
        setValues({
          faseId: regla.faseId,
          puntosExacto: regla.puntosExacto,
          puntosParcial: regla.puntosParcial,
          puntosSinAcierto: 0,
        });
      } else {
        setValues((prev) => ({
          ...prev,
          puntosExacto: 3,
          puntosParcial: 1,
          puntosSinAcierto: 0,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar la regla de puntaje");
    } finally {
      setLoadingRegla(false);
    }
  }

  async function submit() {
    try {
      setSaving(true);

      if (!values.faseId) {
        toast.error("Seleccioná una fase");
        return;
      }

      if (values.puntosExacto <= values.puntosParcial) {
        toast.error("El puntaje exacto debe ser mayor al puntaje parcial");
        return;
      }

      if (values.puntosSinAcierto !== 0) {
        toast.error("Sin acierto siempre debe valer 0 puntos");
        return;
      }

      const reglaGuardada = await guardarReglaPuntaje(values);

      setReglaActual(reglaGuardada);

      toast.success("Regla de puntaje guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar la regla de puntaje");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!values.faseId) return;

    loadReglaPuntaje(values.faseId);
  }, [values.faseId]);

  return {
    fases,
    values,
    reglaActual,
    selectedFase,

    loadingInicial,
    loadingRegla,
    saving,
    isFormDisabled,

    updateField,
    submit,
  };
}