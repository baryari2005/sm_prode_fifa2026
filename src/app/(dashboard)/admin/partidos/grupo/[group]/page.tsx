"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCan } from "@/hooks/useCan";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../../../../loading";

import { PartidosHeader } from "@/features/partidos/components/PartidosHeader";
import { PartidosEmptyState } from "@/features/partidos/components/PartidosEmptyState";
import { PartidosDateGroup } from "@/features/partidos/components/PartidosDataGroup";
import AccessDenied403Page from "../../../../403/page";
import { usePartidosPorGrupo } from "@/features/partidos/hooks/usePartidosPorGrupo";

interface GrupoPageProps {
  params: Promise<{
    group: string;
  }>;
}

export default function PartidosGrupoPage({ params }: GrupoPageProps) {
  const router = useRouter();
  const { group } = use(params);

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
    partidosFiltrados,
    partidosAgrupados,
    loadData,
    handleCargarDesdeApi,
  } = usePartidosPorGrupo(group);

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
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Grupo {group}</h1>
        </div>

        <PartidosHeader
          cantidadPartidos={partidos.length}
          faseActivaLabel={`grupo ${group}`}
          busqueda={busqueda}
          showAutoRefreshBadge
          isAutoRefreshing={autoRefresh.isRefreshing}
          nextAutoRefreshIn={autoRefresh.nextRefreshIn}
          lastAutoRefreshAt={autoRefresh.lastRefreshAt}
          onBusquedaChange={setBusqueda}
          onActualizar={() => void autoRefresh.triggerRefresh()}
        />

        {partidosFiltrados.length === 0 ? (
          <PartidosEmptyState
            hasPartidos={partidos.length > 0}
            canCrearPartidos={canCrearPartidos}
            cargandoApi={cargandoApi}
            onCargarDesdeApi={handleCargarDesdeApi}
            onNuevoPartido={() => router.push("/admin/partidos/nuevo")}
          />
        ) : (
          <div className="space-y-6">
            {partidosAgrupados.map((grupoFecha) => (
              <PartidosDateGroup
                key={grupoFecha.key}
                titulo={grupoFecha.titulo}
                partidos={grupoFecha.partidos}
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
