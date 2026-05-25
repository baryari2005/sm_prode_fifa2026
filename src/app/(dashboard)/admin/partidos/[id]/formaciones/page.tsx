"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Users } from "lucide-react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineupEditorCard } from "@/features/partidos/components/LineupEditorCard";
import { getPlantelBySeleccion } from "@/features/partidos/services/plantel.service";
import {
  getPartidoDetalle,
  getPreviousLineups,
  getResultado,
  saveResultado,
} from "@/features/partidos/services/resultado.service";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import { DEFAULT_TEAM_LINEUP } from "@/features/partidos/types/fixture-details";
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
  const [previousVisitante, setPreviousVisitante] = useState<PreviousSource | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isLiveLocked =
    resultado?.estado === "EN_JUEGO" || resultado?.estado === "ENTRETIEMPO";

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
    return <Loading />;
  }

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (!partido) {
    return null;
  }

  async function handleSave() {
    if (!canEditar) return;
    if (isLiveLocked) {
      toast.error("No se pueden modificar las formaciones porque el partido esta en juego");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/partidos/${partidoId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al partido
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Cargar formaciones</h1>
          <p className="text-sm text-muted-foreground">
            {localNombre} vs {visitanteNombre}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/partidos/${partidoId}`}>
            <Button variant="outline">Ver detalle</Button>
          </Link>
          <Link href={`/admin/partidos/${partidoId}/resultado`}>
            <Button variant="outline">Cargar resultado</Button>
          </Link>
          <Link href={`/admin/paises/${partido.seleccionLocalId}/plantel`}>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              {`Plantel ${localNombre}`}
            </Button>
          </Link>
          <Link href={`/admin/paises/${partido.seleccionVisitanteId}/plantel`}>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              {`Plantel ${visitanteNombre}`}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Editor de formaciones</CardTitle>
          <CardDescription>
            Podés cargar titulares y suplentes para cada selección. Si existe una
            formación anterior, se puede reutilizar y editar para este partido.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          {isLiveLocked ? (
            <div className="xl:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              El partido esta en juego. La edicion manual de formaciones queda bloqueada.
            </div>
          ) : null}

          <div className={isLiveLocked ? "pointer-events-none opacity-60" : ""}>
            <LineupEditorCard
              title={localNombre}
              teamCode={localCodigo}
              lineup={alineacionLocal}
              squad={plantelLocal}
              onChange={setAlineacionLocal}
              previousLineup={previousLocal?.lineup ?? null}
              previousMatchLabel={localPreviousLabel}
              onApplyPrevious={
                previousLocal?.lineup
                  ? () => setAlineacionLocal(cloneLineup(previousLocal.lineup))
                  : undefined
              }
            />
          </div>

          <div className={isLiveLocked ? "pointer-events-none opacity-60" : ""}>
            <LineupEditorCard
              title={visitanteNombre}
              teamCode={visitanteCodigo}
              lineup={alineacionVisitante}
              squad={plantelVisitante}
              onChange={setAlineacionVisitante}
              previousLineup={previousVisitante?.lineup ?? null}
              previousMatchLabel={visitantePreviousLabel}
              onApplyPrevious={
                previousVisitante?.lineup
                  ? () =>
                      setAlineacionVisitante(cloneLineup(previousVisitante.lineup))
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/partidos/${partidoId}`)}
        >
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!canEditar || isLiveLocked || saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar formaciones"}
        </Button>
      </div>
    </div>
  );
}

function formatPreviousMatchLabel(partido?: Partido | null) {
  if (!partido) return null;

  const local = partido.seleccionLocal?.nombre ?? "Local";
  const visitante = partido.seleccionVisitante?.nombre ?? "Visitante";
  const date = new Date(partido.fecha).toLocaleDateString("es-AR");

  return `${local} vs ${visitante} · ${date}`;
}
