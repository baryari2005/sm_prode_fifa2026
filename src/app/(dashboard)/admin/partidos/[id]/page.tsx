"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Loading from "@/app/(dashboard)/loading";
import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { useCan } from "@/hooks/useCan";

import { usePartidoDetallePage } from "@/features/partidos/hooks/usePartidoDetallePage";
import { PartidoDetalleHeader } from "@/features/partidos/components/detalle/PartidoDetalleHeader";
import { PartidoDetalleTabs } from "@/features/partidos/components/detalle/PartidoDetalleTabs";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";

export default function PartidoDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const partidoId = params.id;
  const canVer = useCan("partidos", "ver");

  const { detalle, loading, refreshing, loadData } = usePartidoDetallePage({
    partidoId,
    canVer,
  });

  useEffect(() => {
    if (canVer) {
      loadData();
    }
  }, [canVer, loadData]);

  const autoRefreshEnabled =
    detalle?.estado === "EN_JUEGO" || detalle?.estado === "ENTRETIEMPO";

  const {
    nextRefreshIn,
    lastRefreshAt,
    isRefreshing,
  } = useLiveAutoRefresh({
    enabled: Boolean(autoRefreshEnabled && canVer && partidoId),
    intervalSeconds: 30,
    onRefresh: async () => {
      await loadData({ silent: true });
    },
  });

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <Loading />;
  }

  if (!detalle) {
    return null;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <PartidoDetalleHeader
          partidoId={detalle.partidoId}
          local={detalle.local.nombre}
          visitante={detalle.visitante.nombre}
          marcador={detalle.marcador}
          seleccionLocalId={detalle.local.id}
          seleccionVisitanteId={detalle.visitante.id}
          escudoLocalUrl={detalle.local.escudoUrl}
          escudoVisitanteUrl={detalle.visitante.escudoUrl}
          competencia={detalle.competencia}
          fechaTexto={detalle.fechaTexto}
          estado={detalle.estado}
          fase={detalle.fase}
          grupo={detalle.grupo}
          jornada={detalle.jornada}
          autoRefreshEnabled={autoRefreshEnabled}
          nextRefreshIn={nextRefreshIn}
          isRefreshing={isRefreshing || refreshing}
          lastRefreshAt={lastRefreshAt}
          onBack={() => router.push("/admin/partidos")}
        />

        <PartidoDetalleTabs
          local={detalle.local}
          visitante={detalle.visitante}
          statsLocal={detalle.statsLocal}
          statsVisitante={detalle.statsVisitante}
          lineupLocal={detalle.lineupLocal}
          lineupVisitante={detalle.lineupVisitante}
        />
      </CardContent>
    </Card>
  );
}
