"use client";

import { CalendarDays, RefreshCw, Save, Search } from "lucide-react";

import { LiveRefreshBadge } from "@/components/live-refresh-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarDays className="h-6 w-6" />
                Cargar pronósticos rápido
              </CardTitle>

              <Badge className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-50">
                {total} partidos
              </Badge>

              <Badge className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 hover:bg-sky-50">
                {pendingChangesCount} cambios pendientes
              </Badge>

              <LiveRefreshBadge
                isRefreshing={isAutoRefreshing}
                nextRefreshIn={nextAutoRefreshIn}
                lastRefreshAt={lastAutoRefreshAt}
                shortText
                suffix={pendingChangesCount > 0 ? "pausado" : null}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
              />
            </div>

            <CardDescription className="text-sm text-slate-500">
              Completa varios resultados en una sola pantalla y guardalos todos juntos
              hasta 1 hora antes del inicio de cada partido.
            </CardDescription>
          </div>

          <div className="flex w-full justify-end lg:w-auto">
            <Button
              onClick={onSaveAll}
              disabled={saving || pendingChangesCount === 0}
              className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por seleccion, fase o estadio..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#008C93]/30"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </CardContent>
    </>
  );
}
