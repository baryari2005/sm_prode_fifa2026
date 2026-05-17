"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCan } from "@/hooks/useCan";

import { Badge } from "@/components/ui/badge";
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
      0
    );
  }, [partidosAgrupadosPorFase]);

  const hasVisibleLiveMatches = useMemo(() => {
    return partidosAgrupadosPorFase.some((grupo) =>
      grupo.partidos.some((partido) => partido.resultado?.estado === "EN_JUEGO")
    );
  }, [partidosAgrupadosPorFase]);

  useEffect(() => {
    if (canVerPartidos) {
      loadData();
    }
  }, [canVerPartidos, loadData]);

  useEffect(() => {
    if (!hasVisibleLiveMatches) return;

    const intervalId = window.setInterval(() => {
      void loadData();
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [hasVisibleLiveMatches, loadData]);

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
          onBusquedaChange={setBusqueda}
          onActualizar={loadData}
        />

        {mostrarFiltroGrupo ? (
          <GrupoFilter
            grupos={gruposDisponibles}
            grupoSeleccionado={grupoSeleccionado}
            onGrupoChange={setGrupoSeleccionado}
          />
        ) : null}

        {hasVisibleLiveMatches ? (
          <div className="flex items-center justify-end">
            <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
              Actualizacion automatica cada 60 segundos
            </Badge>
          </div>
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
