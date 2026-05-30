"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { useCan } from "@/hooks/useCan";

import { PartidoDetalleView } from "@/features/partidos/components/detalle/PartidoDetalleView";
import { usePartidoDetallePage } from "@/features/partidos/hooks/usePartidoDetallePage";

export default function PronosticoPartidoDetallePage() {
  const params = useParams<{ id: string }>();
  const partidoId = params.id;

  const canVerDetalle = useCan("partidos", "ver_detalle");

  const { detalle, loading, loadData } = usePartidoDetallePage({
    partidoId,
    canVer: canVerDetalle,
    redirectTo: "/pronosticos",
  });

  useEffect(() => {
    if (!canVerDetalle || !partidoId) return;

    void loadData();
  }, [canVerDetalle, partidoId, loadData]);

  if (!canVerDetalle) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading source="Pronosticos detalle partido" />;
  }

  if (!detalle) {
    return null;
  }

  return (
    <PartidoDetalleView
      detalle={detalle}
      readonly
      showAdminActions={false}
    />
  );
}
