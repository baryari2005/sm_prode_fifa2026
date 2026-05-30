"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { useCan } from "@/hooks/useCan";

import { usePartidoDetallePage } from "@/features/partidos/hooks/usePartidoDetallePage";
import { PartidoDetalleDashboardView } from "@/features/partidos/components/dashboard/PartidoDetalleDashboardView";
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
    return <DashboardLoading badgeLabel="Landing detalle partido" />;
  }

  if (!detalle) {
    return null;
  }

  return (
    <PartidoDetalleDashboardView
      detalle={detalle}
      autoRefreshEnabled={autoRefreshEnabled}
      nextRefreshIn={nextRefreshIn}
      isRefreshing={isRefreshing || refreshing}
      lastRefreshAt={lastRefreshAt}
      onBack={() => router.push("/admin/partidos")}
    />
  );
}
