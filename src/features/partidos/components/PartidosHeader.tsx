"use client";

import { CalendarDays, Info, RefreshCw, Search } from "lucide-react";

import { LiveRefreshBadge } from "@/components/live-refresh-badge";
import { PageHeaderWithBrand } from "@/components/brand/PageHeaderWithBrand";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brandImages } from "@/config/brand-images";

type PartidosHeaderProps = {
  cantidadPartidos: number;
  faseActivaLabel?: string | null;
  busqueda: string;
  showAutoRefreshBadge?: boolean;
  isAutoRefreshing?: boolean;
  nextAutoRefreshIn?: number;
  lastAutoRefreshAt?: Date | null;
  onBusquedaChange: (value: string) => void;
  onActualizar: () => void;
};

export function PartidosHeader({
  cantidadPartidos,
  faseActivaLabel,
  busqueda,
  showAutoRefreshBadge = false,
  isAutoRefreshing = false,
  nextAutoRefreshIn = 30,
  lastAutoRefreshAt = null,
  onBusquedaChange,
  onActualizar,
}: PartidosHeaderProps) {
  return (
    <>
      <PageHeaderWithBrand
        title="Fixture"
        description={
          faseActivaLabel
            ? `Vista del fixture para ${faseActivaLabel.toLowerCase()}. Orgullo de barrio, pasión mundial.`
            : "Vista general del fixture por fecha y fase con una lectura clara para escritorio."
        }
        badge="Orgullo de barrio"
        metricLabel="visibles"
        metricValue={`${cantidadPartidos}`}
        imageSrc={brandImages.institucional.orgulloBarrioPanel}
        watermarkSrc={brandImages.institucional.solArgentino}
        imageAlt="Branding institucional del Prode Mundial 2026"
        actions={
          <>
            {showAutoRefreshBadge ? (
              <LiveRefreshBadge
                isRefreshing={isAutoRefreshing}
                nextRefreshIn={nextAutoRefreshIn}
                lastRefreshAt={lastAutoRefreshAt}
                shortText
                className="rounded-full border border-sky-100/18 bg-sky-200/10 px-3 py-1 text-xs font-medium text-sky-100 hover:bg-sky-200/10"
              />
            ) : null}

            <Button
              type="button"
              variant="outline"
              onClick={onActualizar}
              className="h-11 rounded-xl px-4 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/66">
          <CalendarDays className="h-4 w-4 text-sky-200/70" />
          <span>Fixture ordenado por fecha, fase y acciones administrativas.</span>
          <Info className="h-4 w-4 text-sky-200/70" />
        </div>
      </PageHeaderWithBrand>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />

            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por selección, estadio, ciudad o fase..."
              className="h-11 rounded-xl pl-12 text-sm shadow-none"
            />
          </div>
        </div>
      </CardContent>
    </>
  );
}
