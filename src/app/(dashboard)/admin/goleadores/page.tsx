"use client";

import { useEffect } from "react";

import { useCan } from "@/hooks/useCan";

import { Card, CardContent } from "@/components/ui/card";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "../../403/page";

import { GoleadoresHeader } from "@/features/goleadores/components/GoleadoresHeader";
import { GoleadoresTable } from "@/features/goleadores/components/GoleadoresTable";
import { useGoleadoresPage } from "@/features/goleadores/hooks/useGoleadoresPage";

export default function GoleadoresPage() {
  const canVerPartidos = useCan("partidos", "ver");

  const {
    goleadores,
    goleadoresFiltrados,
    loading,
    cargandoApi,
    cargandoMock,
    busqueda,
    setBusqueda,
    source,
    loadInitialMock,
    loadFromApi,
    loadFromMock,
  } = useGoleadoresPage();

  useEffect(() => {
    if (canVerPartidos) {
      loadInitialMock();
    }
  }, [canVerPartidos, loadInitialMock]);

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading source="Admin goleadores" />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <GoleadoresHeader
          total={goleadores.length}
          source={source}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          cargandoApi={cargandoApi}
          cargandoMock={cargandoMock}
          onCargarDesdeApi={loadFromApi}
          onCargarDesdeMock={loadFromMock}
        />

        <GoleadoresTable goleadores={goleadoresFiltrados} />
      </CardContent>
    </Card>
  );
}
