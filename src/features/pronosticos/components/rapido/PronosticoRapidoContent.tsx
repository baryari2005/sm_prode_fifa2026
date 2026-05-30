"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";
import { PronosticoDialog } from "@/features/pronosticos/components/PronosticoDialog";
import { usePronosticoRapidoPage } from "@/features/pronosticos/hooks/usePronosticoRapidoPage";
import { PronosticoRapidoDashboardDateGroup } from "@/features/pronosticos/components/rapido/dashboard/PronosticoRapidoDashboardDateGroup";
import { PronosticoRapidoDashboardFilters } from "@/features/pronosticos/components/rapido/dashboard/PronosticoRapidoDashboardFilters";
import { PronosticoRapidoDashboardHero } from "@/features/pronosticos/components/rapido/dashboard/PronosticoRapidoDashboardHero";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

export function PronosticoRapidoContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartido, setSelectedPartido] =
    useState<PartidoConRelaciones | null>(null);
  const {
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
  } = usePronosticoRapidoPage();
  const partidoIdFromQuery = searchParams.get("partidoId");

  const autoRefresh = useLiveAutoRefresh({
    enabled: pendingChangesCount === 0,
    intervalSeconds: 30,
    onRefresh: async () => {
      await loadData({ silent: true });
    },
  });

  const totalPartidosVisibles = partidosAgrupadosVisibles.reduce(
    (total, grupo) => total + grupo.partidos.length,
    0,
  );
  const pronosticosCompletos = Object.values(values).filter(
    (value) =>
      value.golesLocal.trim() !== "" && value.golesVisitante.trim() !== "",
  ).length;
  const partidoPreseleccionado = useMemo(() => {
    if (!partidoIdFromQuery) return null;

    return partidos.find((partido) => partido.id === partidoIdFromQuery) ?? null;
  }, [partidoIdFromQuery, partidos]);

  useEffect(() => {
    if (!partidoPreseleccionado) return;

    setSelectedPartido(partidoPreseleccionado);
    setDialogOpen(true);
  }, [partidoPreseleccionado]);

  const clearDialogQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("partidoId");

    const next = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(next);
  };

  if (loading) {
    return <DashboardLoading badgeLabel="Loading carga de pronosticos" />;
  }

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <PronosticoRapidoDashboardHero
          totalPartidos={faseActiva ? totalPartidosVisibles : partidos.length}
          pronosticosCompletos={pronosticosCompletos}
          pendingChangesCount={pendingChangesCount}
          hasVisibleLiveMatches={hasVisibleLiveMatches}
          saving={saving}
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          onSaveAll={handleSaveAll}
        />

        <PronosticoRapidoDashboardFilters
          busqueda={busqueda}
          faseActiva={faseActiva}
          faseActivaLabel={faseActivaLabel}
          mostrandoFaseGrupos={mostrandoFaseGrupos}
          gruposDisponibles={gruposDisponibles}
          grupoSeleccionado={grupoSeleccionado}
          showOnlyPending={showOnlyPending}
          onBusquedaChange={setBusqueda}
          onPhaseChange={handlePhaseChange}
          onGrupoChange={(grupo) => {
            setGrupoSeleccionado(grupo);
          }}
          onShowOnlyPendingChange={setShowOnlyPending}
        />

        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

          <div className="relative z-10 space-y-6">
            {partidosAgrupadosVisibles.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.05] px-6 py-16 text-center text-sm font-medium text-white/66">
                No hay partidos para mostrar con los filtros actuales.
              </div>
            ) : (
              <div className="space-y-6">
                {partidosAgrupadosVisibles.map((grupo) => (
                  <PronosticoRapidoDashboardDateGroup
                    key={grupo.key}
                    grupo={grupo}
                    values={values}
                    errors={errors}
                    onScoreChange={updateScore}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

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
    </main>
  );
}
