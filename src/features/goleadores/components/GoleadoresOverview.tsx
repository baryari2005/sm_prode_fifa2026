"use client";

import { Goal, Layers3, RadioTower, Trophy } from "lucide-react";

import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { buildGoleadoresSummary } from "@/features/goleadores/helpers/goleadores-summary";
import type { Goleador } from "@/features/goleadores/types/types";

type Props = {
  goleadores: Goleador[];
  source: "api" | "mock" | "db" | null;
};

export function GoleadoresOverview({ goleadores, source }: Props) {
  const summary = buildGoleadoresSummary(goleadores, source);

  const stats = [
    {
      title: "Goleadores cargados",
      detail: "Total visible en la tabla actual",
      value: String(summary.total),
      icon: Goal,
      ringClassName: "bg-[#5993B6]/16 text-[#AEEBFF]",
    },
    {
      title: "Fuente actual",
      detail: "Origen de la última carga",
      value: summary.sourceLabel,
      icon: RadioTower,
      ringClassName: "bg-[#FAB438]/14 text-[#FFE4A3]",
    },
    {
      title: "Máximo goleador",
      detail: summary.maximoDetalle,
      value: summary.maximoGoleador,
      icon: Trophy,
      ringClassName: "bg-emerald-400/14 text-emerald-200",
    },
    {
      title: "Selecciones representadas",
      detail: "Países con al menos un gol cargado",
      value: String(summary.seleccionesRepresentadas),
      icon: Layers3,
      ringClassName: "bg-white/12 text-white",
    },
  ];

  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(310px,0.95fr)] 2xl:items-stretch">
        <section className="relative overflow-hidden rounded-[30px] border border-[#5993B6]/28 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-7 2xl:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.96)_0%,rgba(30,44,70,0.92)_34%,rgba(37,53,80,0.72)_64%,rgba(30,44,70,0.9)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(89,147,182,0.24),transparent_30%),radial-gradient(circle_at_15%_12%,rgba(250,180,56,0.15),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_42%,rgba(255,255,255,0.02)_100%)]" />
            <div className="absolute inset-0 bg-[url('/brand/pattern-cover.png')] bg-cover bg-center opacity-[0.09] mix-blend-screen" />
            <div className="absolute inset-y-0 right-[18%] w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
            <div className="absolute -right-8 top-6 h-40 w-40 rounded-full bg-[#5993B6]/14 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-[760px]">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
              Mundial 2026
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="text-[2.35rem] font-extrabold leading-[0.94] tracking-[-0.05em] text-white md:text-[3.1rem] xl:text-[3.5rem]">
                Ranking de
                <span className="block text-[#5993B6]">goleadores</span>
              </h1>

              <p className="brand-heading max-w-[720px] text-[1.8rem] uppercase !tracking-[0.04em] text-white md:text-[2.3rem] md:leading-[1]">
                control de máximos anotadores
              </p>

              <p className="max-w-[720px] text-sm leading-7 text-white/82 md:text-[1rem]">
                Cargá, actualizá y revisá la tabla de máximos goleadores del Mundial 2026.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88">
                {summary.total} goleador{summary.total === 1 ? "" : "es"} visibles
              </div>
              <div className="rounded-full border border-[#5993B6]/28 bg-[#5993B6]/14 px-4 py-2 text-sm font-semibold text-[#AEEBFF]">
                Fuente actual: {summary.sourceLabel}
              </div>
              <div className="rounded-full border border-[#FAB438]/24 bg-[#FAB438]/12 px-4 py-2 text-sm font-semibold text-[#FFE4A3]">
                Selecciones representadas: {summary.seleccionesRepresentadas}
              </div>
            </div>
          </div>
        </section>

        <aside className={`${DASHBOARD_PANEL} rounded-[30px] p-5 md:p-6`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-4">
            <LateralSummaryHeader
              title="Resumen lateral"
              description="Métricas construidas con la misma data real que ya usa la pantalla."
            />

            <div className="space-y-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className={`${DASHBOARD_SUBCARD} flex items-center gap-4 rounded-[24px] px-4 py-4 text-white`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.ringClassName}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.98rem] font-bold text-white">
                        {stat.title}
                      </p>
                      <p className="truncate text-sm text-white/68">{stat.detail}</p>
                    </div>

                    <div className="max-w-[120px] text-right">
                      <p className="brand-heading truncate text-[1.55rem] text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
