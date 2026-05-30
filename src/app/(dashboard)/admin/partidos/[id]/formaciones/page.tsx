"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { PartidoFormacionesDashboardView } from "@/features/partidos/components/components/formaciones/PartidoFormacionesDashboardView";
import { getPlantelBySeleccion } from "@/features/partidos/services/plantel.service";
import {
  getPartidoDetalle,
  getPreviousLineups,
  getResultado,
  saveResultado,
} from "@/features/partidos/services/resultado.service";
import { DEFAULT_TEAM_LINEUP } from "@/features/partidos/types/fixture-details";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion, Partido, Resultado } from "@/features/partidos/types/types";
import { useCan } from "@/hooks/useCan";

type PreviousSource = {
  lineup: TeamLineup | null;
  partido: Partido | null;
};

function cloneLineup(lineup?: TeamLineup | null): TeamLineup {
  return {
    formacion: lineup?.formacion ?? "",
    entrenador: lineup?.entrenador ?? "",
    titulares: lineup?.titulares?.map((player) => ({ ...player })) ?? [],
    suplentes: lineup?.suplentes?.map((player) => ({ ...player })) ?? [],
  };
}

export default function PartidoFormacionesPage() {
  const params = useParams<{ id: string }>();
  const partidoId = params.id;
  const router = useRouter();

  const canVer = useCan("partidos", "ver");
  const canEditarResultado = useCan("resultados", "editar");
  const canCrearResultado = useCan("resultados", "crear");
  const canEditar = canEditarResultado || canCrearResultado;

  const [partido, setPartido] = useState<Partido | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [plantelLocal, setPlantelLocal] = useState<JugadorSeleccion[]>([]);
  const [plantelVisitante, setPlantelVisitante] = useState<JugadorSeleccion[]>([]);
  const [alineacionLocal, setAlineacionLocal] = useState<TeamLineup>({
    ...DEFAULT_TEAM_LINEUP,
    titulares: [],
    suplentes: [],
  });
  const [alineacionVisitante, setAlineacionVisitante] = useState<TeamLineup>({
    ...DEFAULT_TEAM_LINEUP,
    titulares: [],
    suplentes: [],
  });
  const [previousLocal, setPreviousLocal] = useState<PreviousSource | null>(null);
  const [previousVisitante, setPreviousVisitante] = useState<PreviousSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isFormacionesLocked = resultado?.estado === "FINALIZADO";

  useEffect(() => {
    if (!canVer) return;

    const load = async () => {
      try {
        setLoading(true);

        const partidoData = await getPartidoDetalle(partidoId);
        const resultadoData = await getResultado(partidoId);
        const previousData = await getPreviousLineups(partidoId);

        const [localPlayers, awayPlayers] = await Promise.all([
          getPlantelBySeleccion(partidoData.seleccionLocalId),
          getPlantelBySeleccion(partidoData.seleccionVisitanteId),
        ]);

        const localBase =
          resultadoData?.alineacionLocal ??
          previousData.local.lineup ??
          DEFAULT_TEAM_LINEUP;
        const visitanteBase =
          resultadoData?.alineacionVisitante ??
          previousData.visitante.lineup ??
          DEFAULT_TEAM_LINEUP;

        setPartido(partidoData);
        setResultado(resultadoData);
        setPreviousLocal(previousData.local);
        setPreviousVisitante(previousData.visitante);
        setPlantelLocal(localPlayers);
        setPlantelVisitante(awayPlayers);
        setAlineacionLocal(cloneLineup(localBase));
        setAlineacionVisitante(cloneLineup(visitanteBase));
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar la pantalla de formaciones");
        router.push("/admin/partidos");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [canVer, partidoId, router]);

  const localNombre = partido?.seleccionLocal?.nombre ?? "Local";
  const visitanteNombre = partido?.seleccionVisitante?.nombre ?? "Visitante";
  const localCodigo = partido?.seleccionLocal?.codigo ?? null;
  const visitanteCodigo = partido?.seleccionVisitante?.codigo ?? null;

  const localPreviousLabel = useMemo(
    () => formatPreviousMatchLabel(previousLocal?.partido),
    [previousLocal?.partido]
  );
  const visitantePreviousLabel = useMemo(
    () => formatPreviousMatchLabel(previousVisitante?.partido),
    [previousVisitante?.partido]
  );

  if (loading) {
    return <DashboardLoading source="Admin partidos formaciones" />;
  }

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (!partido) {
    return null;
  }

  async function handleSave() {
    if (!canEditar) return;
    if (isFormacionesLocked) {
      toast.error(
        "No se pueden modificar las formaciones porque el partido esta finalizado"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        partidoId,
        alineacionLocal,
        alineacionVisitante,
      };

      const saved = await saveResultado(resultado, payload);

      setResultado(saved);
      setAlineacionLocal(cloneLineup(saved.alineacionLocal ?? alineacionLocal));
      setAlineacionVisitante(
        cloneLineup(saved.alineacionVisitante ?? alineacionVisitante)
      );
      toast.success("Formaciones guardadas correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar las formaciones");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PartidoFormacionesDashboardView
      partido={partido}
      partidoId={partidoId}
      localNombre={localNombre}
      visitanteNombre={visitanteNombre}
      localCodigo={localCodigo}
      visitanteCodigo={visitanteCodigo}
      localPlantel={plantelLocal}
      visitantePlantel={plantelVisitante}
      alineacionLocal={alineacionLocal}
      alineacionVisitante={alineacionVisitante}
      previousLocalLabel={localPreviousLabel}
      previousVisitanteLabel={visitantePreviousLabel}
      previousLocalLineup={previousLocal?.lineup ?? null}
      previousVisitanteLineup={previousVisitante?.lineup ?? null}
      onApplyPreviousLocal={
        previousLocal?.lineup
          ? () => setAlineacionLocal(cloneLineup(previousLocal.lineup))
          : undefined
      }
      onApplyPreviousVisitante={
        previousVisitante?.lineup
          ? () => setAlineacionVisitante(cloneLineup(previousVisitante.lineup))
          : undefined
      }
      onChangeLocal={setAlineacionLocal}
      onChangeVisitante={setAlineacionVisitante}
      onCancel={() => router.push(`/admin/partidos/${partidoId}`)}
      onSave={handleSave}
      saving={saving}
      canEdit={canEditar}
      isLiveLocked={isFormacionesLocked}
    />
  );
}

function formatPreviousMatchLabel(partido?: Partido | null) {
  if (!partido) return null;

  const local = partido.seleccionLocal?.nombre ?? "Local";
  const visitante = partido.seleccionVisitante?.nombre ?? "Visitante";
  const date = new Date(partido.fecha).toLocaleDateString("es-AR");

  return `${local} vs ${visitante} · ${date}`;
}
