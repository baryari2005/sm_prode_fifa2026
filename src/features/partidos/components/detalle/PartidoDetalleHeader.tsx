import { CalendarClock, ChartNoAxesColumnIcon, Info, Radio, ShieldCheck, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LiveRefreshBadge } from "@/components/live-refresh-badge";
import { cn } from "@/lib/utils";

import type { PartidoDetalleHeaderProps } from "@/features/partidos/types/partido-detalle-header.types";
import { buildPartidoInfo } from "@/features/partidos/helpers/partido-detalle-header.helpers";

import {
  PARTIDO_DETALLE_INNER_PANEL_CLASSNAME,
  PARTIDO_DETALLE_SUBCARD_CLASSNAME,
} from "./PartidoDetalleSurface";
import { PartidoScoreboard } from "./PartidoScoreboard";

export function PartidoDetalleHeader({
  local,
  visitante,
  marcador,
  escudoLocalUrl,
  escudoVisitanteUrl,
  competencia = "Mundial 2026",
  fechaTexto,
  estado = "Programado",
  fase,
  grupo,
  jornada,
  autoRefreshEnabled = false,
  nextRefreshIn = 0,
  isRefreshing = false,
  lastRefreshAt = null,
}: PartidoDetalleHeaderProps) {
  const partidoInfo = buildPartidoInfo({
    fase,
    grupo,
    jornada,
  });
  const resumenItems = [
    {
      label: "Estado del partido",
      value: estado,
      icon: Radio,
      toneClassName: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      label: "Fase / grupo",
      value: [fase, grupo].filter(Boolean).join(" · ") || "Sin datos",
      icon: ShieldCheck,
      toneClassName: "bg-[#FAB438]/12 text-[#FFE4A3]",
    },
    {
      label: "Fecha y hora",
      value: fechaTexto ?? "Sin fecha",
      icon: CalendarClock,
      toneClassName: "bg-white/10 text-white",
    },
    {
      label: "Marcador",
      value: marcador,
      icon: TimerReset,
      toneClassName: "bg-emerald-400/14 text-emerald-200",
    },
  ];

  return (
    <div className="border-b border-white/10 pb-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.95fr)] xl:items-stretch">
        <div className={cn(PARTIDO_DETALLE_SUBCARD_CLASSNAME, "space-y-6 rounded-[28px] bg-[#1A2942]/52 p-5 md:p-6")}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
            Detalle del partido
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border-[#5993B6]/18 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
                Kicker
              </Badge>
              <Badge className="rounded-full border-white/10 bg-white/[0.06] text-white/74 hover:bg-white/[0.06]">
                {competencia}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#AEEBFF]">
                Detalle del partido
              </p>
              <h1 className="flex items-center gap-3 text-[2.1rem] font-bold leading-[0.98] tracking-[-0.05em] text-white md:text-[2.45rem]">
                <ChartNoAxesColumnIcon className="h-7 w-7 shrink-0 text-[#FAB438]" />
                Alineaciones y estadisticas
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-white/78 md:text-[0.95rem]">
                Consulta el estado del encuentro, las estadisticas del partido y
                la informacion de los planteles.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2">
              <Info className="h-4 w-4 text-[#AEEBFF]" />
              Alineaciones y estadisticas del partido.
            </span>
            {autoRefreshEnabled ? (
              <LiveRefreshBadge
                isRefreshing={isRefreshing}
                nextRefreshIn={nextRefreshIn}
                lastRefreshAt={lastRefreshAt}
                shortText
                className="inline-flex max-w-full items-center rounded-2xl border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-2 text-xs font-semibold text-[#AEEBFF] hover:bg-[#5993B6]/10"
              />
            ) : null}
          </div>
        </div>

        <aside className={cn(PARTIDO_DETALLE_SUBCARD_CLASSNAME, "space-y-3 rounded-[28px] bg-[#132238]/62 p-4 md:p-5")}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Vista rápida
              </p>
              <p className="mt-1 text-sm text-white/68">
                Lectura rapida del partido.
              </p>
            </div>
            <Badge className="rounded-full border-[#5993B6]/18 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
              {estado}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {resumenItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={cn(PARTIDO_DETALLE_SUBCARD_CLASSNAME, "flex items-start gap-3 p-3.5")}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
                      item.toneClassName,
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-black uppercase tracking-[0.16em] text-white/58">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-white">
                      {item.value}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className={cn(PARTIDO_DETALLE_INNER_PANEL_CLASSNAME, "mt-5 p-4 md:p-6")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-white">{competencia}</span>

            {fechaTexto ? (
              <span className="ml-2 text-white/58">{fechaTexto}</span>
            ) : null}
          </div>

          {partidoInfo ? (
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/74">
              {partidoInfo}
            </span>
          ) : null}
        </div>

        <PartidoScoreboard
          local={local}
          visitante={visitante}
          marcador={marcador}
          escudoLocalUrl={escudoLocalUrl}
          escudoVisitanteUrl={escudoVisitanteUrl}
          estado={estado}
        />
      </div>
    </div>
  );
}
