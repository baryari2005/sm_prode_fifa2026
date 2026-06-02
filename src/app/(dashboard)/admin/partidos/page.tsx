"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCan } from "@/hooks/useCan";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";

import { PartidosEmptyState } from "@/features/partidos/components/PartidosEmptyState";
import { FixtureDashboardDateGroup } from "@/features/partidos/components/dashboard/FixtureDashboardDateGroup";
import { FixtureDashboardFilters } from "@/features/partidos/components/dashboard/FixtureDashboardFilters";
import { FixtureDashboardHero } from "@/features/partidos/components/dashboard/FixtureDashboardHero";
import { usePartidosPage } from "@/features/partidos/hooks/usePartidosPage";
import AccessDenied403Page from "../../403/page";
import {
  getFixturePhaseLabel,
  getFixturePhaseSlugFromText,
} from "@/features/partidos/constants/fixture-phase-filter.constants";
import { getFaseNombre } from "@/features/partidos/utils/partidos-ui.helpers";

export default function PartidosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const faseParam = searchParams.get("fase");
  const faseActiva = getFixturePhaseSlugFromText(faseParam);
  const faseActual = faseActiva ?? "grupos";
  const faseActivaLabel = getFixturePhaseLabel(faseActual);
  const mostrarFiltroGrupo = !faseActiva || faseActiva === "grupos";

  const canVerPartidos = useCan("partidos", "ver");
  const canCrearPartidos = useCan("partidos", "crear");

  const {
    partidos,
    selecciones,
    fases,
    loading,
    cargandoApi,
    busqueda,
    setBusqueda,
    grupoSeleccionado,
    setGrupoSeleccionado,
    gruposDisponibles,
    partidosAgrupados,
    loadData,
    handleCargarDesdeApi,
  } = usePartidosPage();

  useEffect(() => {
    if (mostrarFiltroGrupo && gruposDisponibles.length > 0 && !grupoSeleccionado) {
      setGrupoSeleccionado(gruposDisponibles[0]);
    }

    if (!mostrarFiltroGrupo && grupoSeleccionado !== null) {
      setGrupoSeleccionado(null);
    }
  }, [
    grupoSeleccionado,
    gruposDisponibles,
    mostrarFiltroGrupo,
    setGrupoSeleccionado,
  ]);

  const partidosAgrupadosPorFase = useMemo(() => {
    if (!faseActiva) return partidosAgrupados;

    return partidosAgrupados
      .map((grupo) => ({
        ...grupo,
        partidos: grupo.partidos.filter((partido) => {
          const faseNombre = getFaseNombre(partido, fases);
          const partidoFaseSlug = getFixturePhaseSlugFromText(faseNombre);
          return partidoFaseSlug === faseActiva;
        }),
      }))
      .filter((grupo) => grupo.partidos.length > 0);
  }, [partidosAgrupados, fases, faseActiva]);

  const partidosAgrupadosVisibles = useMemo(() => {
    return partidosAgrupadosPorFase
      .map((grupo) => ({
        ...grupo,
        partidos: grupo.partidos.filter((partido) => {
          if (!showOnlyPending) return true;
          return partido.resultado?.estado !== "FINALIZADO";
        }),
      }))
      .filter((grupo) => grupo.partidos.length > 0);
  }, [partidosAgrupadosPorFase, showOnlyPending]);

  const totalPartidosFiltradosPorFase = useMemo(() => {
    return partidosAgrupadosVisibles.reduce(
      (total, grupo) => total + grupo.partidos.length,
      0,
    );
  }, [partidosAgrupadosVisibles]);

  const hasVisibleLiveMatches = useMemo(() => {
    return partidosAgrupadosVisibles.some((grupo) =>
      grupo.partidos.some(
        (partido) =>
          partido.resultado?.estado === "EN_JUEGO" ||
          partido.resultado?.estado === "ENTRETIEMPO",
      ),
    );
  }, [partidosAgrupadosVisibles]);

  const handlePhaseChange = useCallback(
    (fase: NonNullable<typeof faseActual>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("fase", fase);
      router.push(`/admin/partidos?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (canVerPartidos) {
      void loadData();
    }
  }, [canVerPartidos, loadData]);

  const autoRefresh = useLiveAutoRefresh({
    enabled: canVerPartidos,
    intervalSeconds: 30,
    onRefresh: async () => {
      await loadData({ silent: true });
    },
  });

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading badgeLabel="Cargando partidos..." />;
  }

  return (
    <main className="px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 xl:gap-6">
        <FixtureDashboardHero
          totalPartidos={totalPartidosFiltradosPorFase}
          faseActivaLabel={faseActivaLabel}
          gruposVisibles={gruposDisponibles.length}
          hasLiveMatches={hasVisibleLiveMatches}
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          lastAutoRefreshAt={autoRefresh.lastRefreshAt}
        />

        <FixtureDashboardFilters
          busqueda={busqueda}
          faseActiva={faseActual}
          faseActivaLabel={faseActivaLabel}
          mostrandoFaseGrupos={mostrarFiltroGrupo}
          gruposDisponibles={gruposDisponibles}
          grupoSeleccionado={grupoSeleccionado}
          showOnlyPending={showOnlyPending}
          onBusquedaChange={setBusqueda}
          onPhaseChange={handlePhaseChange}
          onGrupoChange={setGrupoSeleccionado}
          onShowOnlyPendingChange={setShowOnlyPending}
        />

        {partidosAgrupadosVisibles.length === 0 ? (
          <PartidosEmptyState
            hasPartidos={partidos.length > 0}
            canCrearPartidos={canCrearPartidos}
            cargandoApi={cargandoApi}
            onCargarDesdeApi={handleCargarDesdeApi}
            onNuevoPartido={() => router.push("/admin/partidos/nuevo")}
            variant="dashboard"
          />
        ) : (
          <div className="space-y-6">
            {partidosAgrupadosVisibles.map((grupo) => (
              <FixtureDashboardDateGroup
                key={grupo.key}
                titulo={grupo.titulo}
                partidos={grupo.partidos}
                selecciones={selecciones}
                onVerDetalle={(partidoId) =>
                  router.push(`/admin/partidos/${partidoId}`)
                }
                onGestionarResultado={(partidoId) =>
                  router.push(`/admin/partidos/${partidoId}/resultado`)
                }
                onCargarFormaciones={(partidoId) =>
                  router.push(`/admin/partidos/${partidoId}/formaciones`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
