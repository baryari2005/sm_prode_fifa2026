"use client";

import Loading from "@/app/(dashboard)/loading";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";
import { usePronosticoRapidoPage } from "@/features/pronosticos/hooks/usePronosticoRapidoPage";
import { PronosticoRapidoDateGroup } from "@/features/pronosticos/components/rapido/PronosticoRapidoDateGroup";
import { PronosticoRapidoFilters } from "@/features/pronosticos/components/rapido/PronosticoRapidoFilters";
import { PronosticoRapidoHeader } from "@/features/pronosticos/components/rapido/PronosticoRapidoHeader";

export function PronosticoRapidoContent() {
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
    partidosAgrupadosVisibles,
    values,
    errors,
    pendingChangesCount,
    loadData,
    setBusqueda,
    setGrupoSeleccionado,
    handlePhaseChange,
    updateScore,
    handleSaveAll,
  } = usePronosticoRapidoPage();

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

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <PronosticoRapidoHeader
          total={faseActiva ? totalPartidosVisibles : partidos.length}
          busqueda={busqueda}
          saving={saving}
          pendingChangesCount={pendingChangesCount}
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          lastAutoRefreshAt={autoRefresh.lastRefreshAt}
          onBusquedaChange={setBusqueda}
          onActualizar={() => void autoRefresh.triggerRefresh()}
          onSaveAll={handleSaveAll}
        />

        <PronosticoRapidoFilters
          faseActiva={faseActiva}
          faseActivaLabel={faseActivaLabel}
          mostrandoFaseGrupos={mostrandoFaseGrupos}
          gruposDisponibles={gruposDisponibles}
          grupoSeleccionado={grupoSeleccionado}
          onPhaseChange={handlePhaseChange}
          onGrupoChange={(grupo) => {
            setGrupoSeleccionado(grupo);
          }}
        />

        {partidosAgrupadosVisibles.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-sm font-medium text-slate-500">
            No hay partidos para mostrar con los filtros actuales.
          </div>
        ) : (
          <div className="space-y-6">
            {partidosAgrupadosVisibles.map((grupo) => (
              <PronosticoRapidoDateGroup
                key={grupo.key}
                grupo={grupo}
                values={values}
                errors={errors}
                onScoreChange={updateScore}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
