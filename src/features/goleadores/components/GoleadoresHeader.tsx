"use client";

import { Goal, Search, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type Props = {
  total: number;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  cargandoApi: boolean;
  onCargarDesdeApi: () => void;
};

export function GoleadoresHeader({
  total,
  busqueda,
  onBusquedaChange,
  cargandoApi,
  onCargarDesdeApi,
}: Props) {
  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-[#5993B6]/22 bg-[#5993B6]/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF] hover:bg-[#5993B6]/14">
                Operación
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/10">
                {total} cargados
              </Badge>
              {/* {source ? (
                <Badge className="rounded-full border border-[#FAB438]/20 bg-[#FAB438]/10 px-3 py-1 text-sm font-semibold text-[#FFE4A3] hover:bg-[#FAB438]/10">
                  Fuente: {source === "api" ? "API" : source === "db" ? "Base" : "Mock"}
                </Badge>
              ) : null} */}
            </div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              filtros aplicables
            </p>
            <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
              Explorador de goleadores
            </h2>
            <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
              Filtrá por jugador, selección o posición e iniciá la carga de datos vía API oficial.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 xl:min-w-[360px]">
            <Button
              type="button"
              onClick={onCargarDesdeApi}
              disabled={cargandoApi}
              className="h-12 rounded-2xl bg-[#FAB438] px-5 font-semibold text-[#1E2C46] shadow-[0_16px_34px_rgba(250,180,56,0.24)] transition hover:bg-[#FFD06E] disabled:opacity-70"
            >
              <Upload className={`mr-2 h-4 w-4 ${cargandoApi ? "animate-spin" : ""}`} />
              Cargar goleadores desde API oficial
            </Button>

            {/* <Button
              type="button"
              onClick={onCargarDesdeMock}
              disabled={cargandoMock}
              variant="outline"
              className="h-12 rounded-2xl border-[#5993B6]/32 bg-[#20314D] px-5 font-semibold text-white shadow-none transition hover:bg-[#294564] hover:text-white disabled:opacity-70"
            >
              <Wand2 className={`mr-2 h-4 w-4 ${cargandoMock ? "animate-spin" : ""}`} />
              Cargar desde mock
            </Button> */}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#AEEBFF]/70" />
              <Input
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                placeholder="Buscar por jugador, seleccion o posicion..."
                className="h-12 rounded-2xl border-[#5993B6]/28 bg-[#243754]/88 pl-12 text-sm text-white placeholder:text-white/52 focus-visible:border-[#75D7FF] focus-visible:ring-[rgba(250,180,56,0.26)]"
              />
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/84">
              <Goal className="h-4 w-4 text-[#FAB438]" />
              {total} resultado{total === 1 ? "" : "s"} visible{total === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
