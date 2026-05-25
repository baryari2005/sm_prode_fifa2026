"use client";

import {
  CalendarDays,
  Info,
  RefreshCw,
  Search,
} from "lucide-react";

import { LiveRefreshBadge } from "@/components/live-refresh-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarDays className="h-6 w-6" />
                Fixture
              </CardTitle>

              <Badge className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                {cantidadPartidos} visibles
              </Badge>

              {showAutoRefreshBadge ? (
                <LiveRefreshBadge
                  isRefreshing={isAutoRefreshing}
                  nextRefreshIn={nextAutoRefreshIn}
                  lastRefreshAt={lastAutoRefreshAt}
                  shortText
                  className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
                />
              ) : null}
            </div>

            <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>
                {faseActivaLabel
                  ? `Vista del fixture para ${faseActivaLabel.toLowerCase()}`
                  : "Vista general del fixture por fecha y fase"}
              </span>
              <Info className="h-4 w-4 text-slate-400" />
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onActualizar}
              className="h-11 rounded-xl border-slate-200 bg-white px-4 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por selección, estadio, ciudad o fase..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#008C93]/30"
            />
          </div>

          {/* <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-slate-200 bg-white px-6 cursor-pointer md:w-auto"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filtros
          </Button> */}
        </div>
      </CardContent>
    </>
  );
}
