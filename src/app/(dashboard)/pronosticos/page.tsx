"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../loading";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";
import { useCan } from "@/hooks/useCan";

import { PronosticosHeader } from "@/features/pronosticos/components/PronosticosHeader";
import { usePronosticosPage } from "@/features/pronosticos/hooks/usePronosticosPage";
import { PartidosDateGroup } from "@/features/partidos/components/PartidosDataGroup";
import { PronosticoDialog } from "@/features/pronosticos/components/PronosticoDialog";
import { GrupoFilter } from "@/features/partidos/components/GrupoFilter";
import AccessDenied403Page from "../403/page";
import { getFixturePhaseSlugFromText } from "@/features/partidos/constants/fixture-phase-filter.constants";
import {
  getFaseNombre,
  getGrupoNombre,
  type PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";

function getGrupoFilterValue(partido: PartidoConRelaciones) {
  const grupoNombre = getGrupoNombre(partido);
  if (!grupoNombre) return null;
  return grupoNombre.replace(/^grupo\s+/i, "").trim();
}

export default function PronosticosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const canViewPronosticos = useCan("pronosticos", "ver");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartido, setSelectedPartido] =
    useState<PartidoConRelaciones | null>(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null,
  );

  const {
    partidos,
    partidosAgrupados,
    hasVisibleLiveMatches,
    loading,
    busqueda,
    setBusqueda,
    loadData,
  } = usePronosticosPage();

  const partidoIdFromQuery = searchParams.get("partido");
  const faseParam = searchParams.get("fase");
  const faseActiva = getFixturePhaseSlugFromText(faseParam);
  const mostrandoFaseGrupos = faseActiva === "grupos";

  const partidosAgrupadosPorFase = useMemo(() => {
    if (!faseActiva) return partidosAgrupados;

    return partidosAgrupados
      .map((grupo) => ({
        ...grupo,
        partidos: grupo.partidos.filter((partido) => {
          const faseNombre = getFaseNombre(partido, []);
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
        const grupo = getGrupoFilterValue(partido);
        if (grupo) grupos.add(grupo);
      });
    });

    return Array.from(grupos).sort((a, b) =>
      a.localeCompare(b, "es", { numeric: true }),
    );
  }, [partidosAgrupadosPorFase, mostrandoFaseGrupos]);

  const partidosAgrupadosVisibles = useMemo(() => {
    if (!mostrandoFaseGrupos) return partidosAgrupadosPorFase;
    if (grupoSeleccionado === null) return partidosAgrupadosPorFase;

    return partidosAgrupadosPorFase
      .map((grupoFecha) => ({
        ...grupoFecha,
        partidos: grupoFecha.partidos.filter((partido) => {
          const grupo = getGrupoFilterValue(partido);
          return grupo === grupoSeleccionado;
        }),
      }))
      .filter((grupoFecha) => grupoFecha.partidos.length > 0);
  }, [partidosAgrupadosPorFase, mostrandoFaseGrupos, grupoSeleccionado]);

  const totalPartidosVisibles = useMemo(() => {
    return partidosAgrupadosVisibles.reduce(
      (total, grupo) => total + grupo.partidos.length,
      0,
    );
  }, [partidosAgrupadosVisibles]);

  const partidoPreseleccionado = useMemo(() => {
    if (!partidoIdFromQuery) return null;
    return partidos.find((partido) => partido.id === partidoIdFromQuery) ?? null;
  }, [partidoIdFromQuery, partidos]);

  useEffect(() => {
    if (!canViewPronosticos) return;
    void loadData();
  }, [canViewPronosticos, loadData]);

  const autoRefresh = useLiveAutoRefresh({
    enabled: canViewPronosticos,
    intervalSeconds: 30,
    onRefresh: async () => {
      await loadData({ silent: true });
    },
  });

  useEffect(() => {
    if (!mostrandoFaseGrupos) {
      setGrupoSeleccionado(null);
      return;
    }

    if (
      grupoSeleccionado !== null &&
      !gruposDisponibles.includes(grupoSeleccionado)
    ) {
      setGrupoSeleccionado(null);
    }
  }, [mostrandoFaseGrupos, gruposDisponibles, grupoSeleccionado]);

  useEffect(() => {
    if (!canViewPronosticos) return;
    if (!partidoPreseleccionado) return;
    setSelectedPartido(partidoPreseleccionado);
    setDialogOpen(true);
  }, [canViewPronosticos, partidoPreseleccionado]);

  useEffect(() => {
    if (!canViewPronosticos) return;
    if (!partidoIdFromQuery || loading) return;

    const frame = requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-partido-id="${partidoIdFromQuery}"]`,
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [canViewPronosticos, partidoIdFromQuery, loading, partidosAgrupadosVisibles]);

  const clearDialogQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("partido");

    const next = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(next);
  };

  if (!canViewPronosticos) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <PronosticosHeader
          total={faseActiva ? totalPartidosVisibles : partidos.length}
          busqueda={busqueda}
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          lastAutoRefreshAt={autoRefresh.lastRefreshAt}
          onBusquedaChange={setBusqueda}
          onActualizar={() => void autoRefresh.triggerRefresh()}
        />

        {hasVisibleLiveMatches ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700">
            Hay partidos en juego. La lista se refresca automaticamente para
            mantener los estados al dia.
          </div>
        ) : null}

        {mostrandoFaseGrupos && gruposDisponibles.length > 0 ? (
          <GrupoFilter
            grupos={gruposDisponibles}
            grupoSeleccionado={grupoSeleccionado}
            onGrupoChange={(grupo) => {
              setGrupoSeleccionado(grupo);
            }}
          />
        ) : null}

        {partidosAgrupadosVisibles.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-sm font-medium text-slate-500">
            No hay partidos para mostrar con los filtros actuales.
          </div>
        ) : (
          <div className="space-y-6">
            {partidosAgrupadosVisibles.map((grupo) => (
              <PartidosDateGroup
                key={grupo.key}
                titulo={grupo.titulo}
                partidos={grupo.partidos}
                selecciones={[]}
                fases={[]}
                allowPronostico
                onPronosticoSaved={loadData}
                onPronosticarClick={(partido) => {
                  setSelectedPartido(partido);
                  setDialogOpen(true);
                }}
                highlightedPartidoId={partidoIdFromQuery}
              />
            ))}
          </div>
        )}

        <PronosticoDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);

            if (!open) {
              setSelectedPartido(null);
              clearDialogQuery();
            }
          }}
          partido={selectedPartido}
          onSaved={loadData}
        />
      </CardContent>
    </Card>
  );
}
