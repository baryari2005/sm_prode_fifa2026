"use client";

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
import { Goal, Search, Upload, Wand2 } from "lucide-react";

type Props = {
  total: number;
  source: "api" | "mock" | "db" | null;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  cargandoApi: boolean;
  cargandoMock: boolean;
  onCargarDesdeApi: () => void;
  onCargarDesdeMock: () => void;
};

export function GoleadoresHeader({
  total,
  source,
  busqueda,
  onBusquedaChange,
  cargandoApi,
  cargandoMock,
  onCargarDesdeApi,
  onCargarDesdeMock,
}: Props) {
  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="relative z-10 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_auto] xl:items-end">
        <div className="min-w-0 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-[#5993B6]/22 bg-[#5993B6]/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF] hover:bg-[#5993B6]/14">
                Operación
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/10">
                {total} cargados
              </Badge>
              {source ? (
                <Badge className="rounded-full border border-[#FAB438]/20 bg-[#FAB438]/10 px-3 py-1 text-sm font-semibold text-[#FFE4A3] hover:bg-[#FAB438]/10">
                  Fuente: {source === "api" ? "API" : source === "db" ? "Base" : "Mock"}
                </Badge>
              ) : null}
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
                <Goal className="h-5 w-5 text-[#FAB438]" />
                Acciones y búsqueda
              </h2>
              <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                Mantiene la misma carga real y mock de siempre, ahora integrada al tema dark del panel.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#AEEBFF]/70" />
            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por jugador, selección o posición..."
              className="h-12 rounded-2xl border-[#5993B6]/28 bg-[#243754]/88 pl-12 text-sm text-white placeholder:text-white/52 focus-visible:border-[#75D7FF] focus-visible:ring-[rgba(250,180,56,0.26)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[360px]">
          <Button
            type="button"
            onClick={onCargarDesdeApi}
            disabled={cargandoApi}
            className="h-12 rounded-2xl bg-[#FAB438] px-5 font-semibold text-[#1E2C46] shadow-[0_16px_34px_rgba(250,180,56,0.24)] transition hover:bg-[#FFD06E] disabled:opacity-70"
          >
            <Upload className={`mr-2 h-4 w-4 ${cargandoApi ? "animate-spin" : ""}`} />
            Cargar desde API
          </Button>

          <Button
            type="button"
            onClick={onCargarDesdeMock}
            disabled={cargandoMock}
            variant="outline"
            className="h-12 rounded-2xl border-[#5993B6]/32 bg-[#20314D] px-5 font-semibold text-white shadow-none transition hover:bg-[#294564] hover:text-white disabled:opacity-70"
          >
            <Wand2 className={`mr-2 h-4 w-4 ${cargandoMock ? "animate-spin" : ""}`} />
            Cargar desde mock
          </Button>
        </div>
      </div>
    </section>
  );
}
