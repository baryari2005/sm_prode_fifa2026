"use client";

import { CalendarDays, RefreshCw, Save, Search } from "lucide-react";

import { LiveRefreshBadge } from "@/components/live-refresh-badge";
import { PageHeaderWithBrand } from "@/components/brand/PageHeaderWithBrand";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brandImages } from "@/config/brand-images";

type PronosticoRapidoHeaderProps = {
  total: number;
  busqueda: string;
  saving: boolean;
  pendingChangesCount: number;
  isAutoRefreshing: boolean;
  nextAutoRefreshIn: number;
  lastAutoRefreshAt?: Date | null;
  onBusquedaChange: (value: string) => void;
  onActualizar: () => void;
  onSaveAll: () => void;
};

export function PronosticoRapidoHeader({
  total,
  busqueda,
  saving,
  pendingChangesCount,
  isAutoRefreshing,
  nextAutoRefreshIn,
  lastAutoRefreshAt,
  onBusquedaChange,
  onActualizar,
  onSaveAll,
}: PronosticoRapidoHeaderProps) {
  return (
    <>
      <PageHeaderWithBrand
        title="Hace tu jugada"
        description="Cada resultado suma en el ranking del barrio. Completá varios pronósticos en una sola pantalla y guardalos juntos."
        badge="Carga masiva"
        metricLabel="partidos"
        metricValue={`${total}`}
        imageSrc={brandImages.institucional.barrioMundial}
        watermarkSrc={brandImages.institucional.solArgentino}
        imageAlt="Branding del Prode para pronosticos"
        actions={
          <>
            <div className="inline-flex items-center rounded-full border border-sky-100/18 bg-sky-200/10 px-3 py-1 text-sm font-medium text-sky-100">
              {pendingChangesCount} cambios pendientes
            </div>

            <LiveRefreshBadge
              isRefreshing={isAutoRefreshing}
              nextRefreshIn={nextAutoRefreshIn}
              lastRefreshAt={lastAutoRefreshAt}
              shortText
              suffix={pendingChangesCount > 0 ? "pausado" : null}
              className="rounded-full border border-sky-100/18 bg-sky-200/10 px-3 py-1 text-xs font-medium text-sky-100 hover:bg-sky-200/10"
            />

            <Button
              onClick={onSaveAll}
              disabled={saving || pendingChangesCount === 0}
              className="h-11 rounded-2xl bg-[#75D7FF] font-bold text-[#041427] shadow-lg shadow-sky-700/20 transition hover:bg-[#AEEBFF]"
            >
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-6 w-6" />
                  Guardar todo
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/66">
          <CalendarDays className="h-4 w-4 text-sky-200/70" />
          <span>Edición rápida para escritorio, clara y compacta.</span>
        </div>
      </PageHeaderWithBrand>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por seleccion, fase o estadio..."
              className="h-11 rounded-xl pl-12 text-sm shadow-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={onActualizar}
              className="h-11 rounded-xl px-4 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
