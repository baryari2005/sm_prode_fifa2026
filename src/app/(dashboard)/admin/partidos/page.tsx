"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCan } from "@/hooks/useCan";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../../loading";

import { PartidosHeader } from "@/features/partidos/components/PartidosHeader";
import { PartidosEmptyState } from "@/features/partidos/components/PartidosEmptyState";
import { PartidosDateGroup } from "@/features/partidos/components/PartidosDataGroup";
import { GrupoFilter } from "@/features/partidos/components/GrupoFilter";
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

  const faseParam = searchParams.get("fase");
  const faseActiva = getFixturePhaseSlugFromText(faseParam);
  const faseActivaLabel = getFixturePhaseLabel(faseActiva);
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

  const totalPartidosFiltradosPorFase = useMemo(() => {
    return partidosAgrupadosPorFase.reduce(
      (total, grupo) => total + grupo.partidos.length,
      0,
    );
  }, [partidosAgrupadosPorFase]);

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
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <PartidosHeader
          cantidadPartidos={
            faseActiva ? totalPartidosFiltradosPorFase : partidos.length
          }
          faseActivaLabel={faseActivaLabel}
          busqueda={busqueda}
          showAutoRefreshBadge
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          lastAutoRefreshAt={autoRefresh.lastRefreshAt}
          onBusquedaChange={setBusqueda}
          onActualizar={() => void autoRefresh.triggerRefresh()}
        />

        {mostrarFiltroGrupo ? (
          <GrupoFilter
            grupos={gruposDisponibles}
            grupoSeleccionado={grupoSeleccionado}
            onGrupoChange={setGrupoSeleccionado}
          />
        ) : null}

        {partidosAgrupadosPorFase.length === 0 ? (
          <PartidosEmptyState
            hasPartidos={partidos.length > 0}
            canCrearPartidos={canCrearPartidos}
            cargandoApi={cargandoApi}
            onCargarDesdeApi={handleCargarDesdeApi}
            onNuevoPartido={() => router.push("/admin/partidos/nuevo")}
          />
        ) : (
          <div className="space-y-6">
            {partidosAgrupadosPorFase.map((grupo) => (
              <PartidosDateGroup
                key={grupo.key}
                titulo={grupo.titulo}
                partidos={grupo.partidos}
                selecciones={selecciones}
                fases={fases}
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
      </CardContent>
    </Card>
  );
}
