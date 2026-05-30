"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { PHASE_FILTERS } from "@/features/pronosticos/constants/pronostico-rapido.constants";
import type { PhaseFilterValue } from "@/features/pronosticos/types/pronostico-rapido.types";

type PronosticoRapidoDashboardFiltersProps = {
  busqueda: string;
  faseActiva: string | null;
  faseActivaLabel: string;
  mostrandoFaseGrupos: boolean;
  gruposDisponibles: string[];
  grupoSeleccionado: string | null;
  showOnlyPending: boolean;
  onBusquedaChange: (value: string) => void;
  onPhaseChange: (fase: PhaseFilterValue) => void;
  onGrupoChange: (grupo: string | null) => void;
  onShowOnlyPendingChange: (value: boolean) => void;
};

export function PronosticoRapidoDashboardFilters({
  busqueda,
  faseActiva,
  faseActivaLabel,
  mostrandoFaseGrupos,
  gruposDisponibles,
  grupoSeleccionado,
  showOnlyPending,
  onBusquedaChange,
  onPhaseChange,
  onGrupoChange,
  onShowOnlyPendingChange,
}: PronosticoRapidoDashboardFiltersProps) {
  const filtroActivoLabel =
    mostrandoFaseGrupos && grupoSeleccionado
      ? `${faseActivaLabel} - Grupo ${grupoSeleccionado}`
      : faseActivaLabel;

  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              filtros aplicables
            </p>
            <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
              Carga masiva de marcadores
            </h2>
            <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
              Busca un partido puntual o recorre cada grupo para cargar rapido
              tus resultados antes del cierre.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[360px] xl:items-end">
            <div className="flex w-full flex-col gap-3 sm:flex-row xl:justify-end">
              <label className="flex items-center gap-3 text-sm font-semibold text-white/72">
                <Switch
                  checked={showOnlyPending}
                  onCheckedChange={onShowOnlyPendingChange}
                />
                <span>
                  {showOnlyPending ? "Solo pendientes" : "Ver todos"}
                </span>
              </label>
              <div className="relative min-w-[220px] flex-1 xl:max-w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                <Input
                  value={busqueda}
                  onChange={(event) => onBusquedaChange(event.target.value)}
                  placeholder="Buscar por seleccion o estadio"
                  className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                />
              </div>

            </div>

          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {PHASE_FILTERS.filter((fase) => fase.value !== null).map((fase) => {
              const active =
                fase.value === null
                  ? faseActiva === null
                  : faseActiva === fase.value;

              return (
                <Button
                  key={fase.label}
                  type="button"
                  onClick={() => onPhaseChange(fase.value)}
                  variant={active ? "default" : "outline"}
                  className={
                    active
                      ? "rounded-full bg-[#5993B6] text-white hover:bg-[#4B84A6]"
                      : "rounded-full border-white/12 bg-white/8 text-white hover:bg-white/12"
                  }
                >
                  {fase.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Filtro activo
          </p>
          <p className="mt-2 text-lg font-black text-white">{filtroActivoLabel}</p>
          <p className="mt-1 text-sm font-semibold text-white/62">
            {faseActiva
              ? "Mostrando solo los partidos de esta fase."
              : "Mostrando todos los partidos disponibles para pronosticar."}
          </p>
        </div>

        {mostrandoFaseGrupos && gruposDisponibles.length > 0 ? (
          <Tabs
            value={grupoSeleccionado ?? gruposDisponibles[0]}
            onValueChange={onGrupoChange}
            className="space-y-0"
          >
            <div className="overflow-x-auto pb-1">
              <TabsList className="min-w-max justify-start">
                {gruposDisponibles.map((grupo) => (
                  <TabsTrigger
                    key={grupo}
                    value={grupo}
                    className="min-w-[110px]"
                  >
                    Grupo {grupo}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        ) : null}
      </div>
    </section>
  );
}
