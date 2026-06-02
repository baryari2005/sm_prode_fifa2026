"use client";

import { useEffect } from "react";

import { brandImages } from "@/config/brand-images";
import { useCan } from "@/hooks/useCan";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "../../403/page";

import { GoleadoresHeader } from "@/features/goleadores/components/GoleadoresHeader";
import { GoleadoresOverview } from "@/features/goleadores/components/GoleadoresOverview";
import { GoleadoresTable } from "@/features/goleadores/components/GoleadoresTable";
import { useGoleadoresPage } from "@/features/goleadores/hooks/useGoleadoresPage";

export default function GoleadoresPage() {
  const canVerPartidos = useCan("partidos", "ver");

  const {
    goleadores,
    goleadoresFiltrados,
    loading,
    cargandoApi,
    busqueda,
    setBusqueda,
    source,
    loadInitialData,
    loadFromApi,
  } = useGoleadoresPage();

  useEffect(() => {
    if (canVerPartidos) {
      loadInitialData();
    }
  }, [canVerPartidos, loadInitialData]);

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading badgeLabel="Admin goleadores" />;
  }

  return (
    <main className="min-h-full bg-transparent px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 xl:gap-6">
        <GoleadoresOverview
          goleadores={goleadores}
          source={source}
          heroImageSrc={brandImages.mascots.goleadores}
          heroImageAlt="Mascota del ranking de goleadores"
        />

        <GoleadoresHeader
          total={goleadores.length}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          cargandoApi={cargandoApi}
          onCargarDesdeApi={loadFromApi}
        />

        <GoleadoresTable
          goleadores={goleadoresFiltrados}
          totalGoleadores={goleadores.length}
          busqueda={busqueda}
        />
      </div>
    </main>
  );
}
