"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCan } from "@/hooks/useCan";

import {
  getPartidoDetalle,
  getResultado,
  saveResultado,
} from "@/features/partidos/services/resultado.service";

import { getPlantelBySeleccion } from "@/features/partidos/services/plantel.service";

import {
  mapRowsToGoalDetails,
  mapRowsToStats,
  parseImportFile,
} from "@/features/partidos/services/fixture-import.service";

import {
  applyLineupTotals,
  createInitialState,
} from "@/features/partidos/helpers/resultado-manual.helpers";
import { resolveBanderaSrc } from "@/lib/flags";

import type {
  GoalDetail,
  TeamLineup,
  TeamStats,
} from "@/features/partidos/types/fixture-details";

import type {
  JugadorSeleccion,
  Partido,
  Resultado,
} from "@/features/partidos/types/types";

import type {
  ResultadoFormState,
} from "@/features/partidos/types/resultado-manual.types";

export function useResultadoPartidoPage() {
  const params = useParams<{ id: string }>();
  const partidoId = params.id;

  const router = useRouter();

  const canVer = useCan("resultados", "ver");
  const canEditarResultado = useCan("resultados", "editar");
  const canCrearResultado = useCan("resultados", "crear");
  const canEditar = canEditarResultado || canCrearResultado;

  const [partido, setPartido] = useState<Partido | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [plantelLocal, setPlantelLocal] = useState<JugadorSeleccion[]>([]);
  const [plantelVisitante, setPlantelVisitante] = useState<JugadorSeleccion[]>(
    []
  );

  const [form, setForm] = useState<ResultadoFormState>(
    createInitialState(null)
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [importingStats, setImportingStats] = useState(false);
  const [importingGoals, setImportingGoals] = useState(false);

  useEffect(() => {
    if (!canVer) return;

    async function load() {
      try {
        setLoading(true);

        const partidoData = await getPartidoDetalle(partidoId);
        const resultadoData = await getResultado(partidoId);

        const [localPlayers, awayPlayers] = await Promise.all([
          getPlantelBySeleccion(partidoData.seleccionLocalId),
          getPlantelBySeleccion(partidoData.seleccionVisitanteId),
        ]);

        setPartido(partidoData);
        setResultado(resultadoData);
        setPlantelLocal(localPlayers);
        setPlantelVisitante(awayPlayers);
        setForm(createInitialState(resultadoData));
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el partido");
        router.push("/admin/partidos");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [canVer, partidoId, router]);

  const localNombre = partido?.seleccionLocal?.nombre ?? "Local";
  const visitanteNombre = partido?.seleccionVisitante?.nombre ?? "Visitante";
  const localCodigo = partido?.seleccionLocal?.codigo ?? null;
  const visitanteCodigo = partido?.seleccionVisitante?.codigo ?? null;

  const escudoLocalUrl = resolveBanderaSrc(
    partido?.seleccionLocal?.bandera ?? null,
    localCodigo
  );
  const escudoVisitanteUrl = resolveBanderaSrc(
    partido?.seleccionVisitante?.bandera ?? null,
    visitanteCodigo
  );

  const canSubmit = canEditar && partido !== null;
  const isLiveLocked = resultado?.estado === "EN_JUEGO";
  const canEditCurrentResult = canSubmit && !isLiveLocked;

  const headerDescription = useMemo(() => {
    if (!partido) return "";

    return `${localNombre} vs ${visitanteNombre}`;
  }, [localNombre, partido, visitanteNombre]);

  function updateForm(patch: Partial<ResultadoFormState>) {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateLocalStat(key: keyof TeamStats, value: number) {
    setForm((current) => ({
      ...current,
      estadisticasLocal: {
        ...current.estadisticasLocal,
        [key]: value,
      },
    }));
  }

  function updateVisitanteStat(key: keyof TeamStats, value: number) {
    setForm((current) => ({
      ...current,
      estadisticasVisitante: {
        ...current.estadisticasVisitante,
        [key]: value,
      },
    }));
  }

  function updateLocalLineup(lineup: TeamLineup) {
    setForm((current) => applyLineupTotals(current, "local", lineup));
  }

  function updateVisitanteLineup(lineup: TeamLineup) {
    setForm((current) => applyLineupTotals(current, "visitante", lineup));
  }

  function updateLocalGoalDetails(detalle: GoalDetail[]) {
    updateForm({
      detalleGolesLocal: detalle,
    });
  }

  function updateVisitanteGoalDetails(detalle: GoalDetail[]) {
    updateForm({
      detalleGolesVisitante: detalle,
    });
  }

  async function handleImportStats(file: File) {
    try {
      setImportingStats(true);

      const rows = await parseImportFile(file);
      const imported = mapRowsToStats(rows);

      setForm((current) => ({
        ...current,
        estadisticasLocal: imported.estadisticasLocal,
        estadisticasVisitante: imported.estadisticasVisitante,
      }));

      toast.success("Estadísticas importadas");
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron importar las estadísticas");
    } finally {
      setImportingStats(false);
    }
  }

  async function handleImportGoals(file: File) {
    try {
      setImportingGoals(true);

      const rows = await parseImportFile(file);

      const { detalleGolesLocal, detalleGolesVisitante } =
        mapRowsToGoalDetails(rows);

      setForm((current) => ({
        ...current,
        detalleGolesLocal,
        detalleGolesVisitante,
        golesLocal: detalleGolesLocal.length || current.golesLocal,
        golesVisitante: detalleGolesVisitante.length || current.golesVisitante,
      }));

      toast.success("Detalle de goles importado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo importar el detalle de goles");
    } finally {
      setImportingGoals(false);
    }
  }

  async function handleSave() {
    if (!canSubmit) return;
    if (isLiveLocked) {
      toast.error("No se puede modificar el resultado porque el partido esta en juego");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        partidoId,

        golesLocal: form.golesLocal,
        golesVisitante: form.golesVisitante,

        penalesLocal:
          form.penalesLocal.trim() === "" ? null : Number(form.penalesLocal),

        penalesVisitante:
          form.penalesVisitante.trim() === ""
            ? null
            : Number(form.penalesVisitante),

        estado: form.estado,

        tiempoJuego:
          form.tiempoJuego.trim() === "" ? null : Number(form.tiempoJuego),

        observaciones: form.observaciones.trim() || null,

        estadisticasLocal: form.estadisticasLocal,
        estadisticasVisitante: form.estadisticasVisitante,

        alineacionLocal: form.alineacionLocal,
        alineacionVisitante: form.alineacionVisitante,

        detalleGolesLocal: form.detalleGolesLocal,
        detalleGolesVisitante: form.detalleGolesVisitante,
      };

      const saved = await saveResultado(resultado, payload);

      setResultado(saved);
      setForm(createInitialState(saved));

      toast.success("Resultado guardado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el resultado");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    router.push(`/admin/partidos/${partidoId}`);
  }

  return {
    partidoId,

    partido,
    resultado,
    form,

    plantelLocal,
    plantelVisitante,

    loading,
    saving,
    importingStats,
    importingGoals,

    canVer,
    canEditar,
    canSubmit,
    isLiveLocked,
    canEditCurrentResult,

    localNombre,
    visitanteNombre,
    localCodigo,
    visitanteCodigo,
    escudoLocalUrl,
    escudoVisitanteUrl,
    headerDescription,

    updateForm,
    updateLocalStat,
    updateVisitanteStat,
    updateLocalLineup,
    updateVisitanteLineup,
    updateLocalGoalDetails,
    updateVisitanteGoalDetails,

    handleImportStats,
    handleImportGoals,
    handleSave,

    cancel,
  };
}
