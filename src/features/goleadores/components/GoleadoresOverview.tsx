"use client";

import { Goal, Layers3, Trophy } from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import { brandImages } from "@/config/brand-images";
import {
  DASHBOARD_HERO_PATTERN,
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
  heroImageSrc?: string;
  heroImageAlt?: string;
};

export function GoleadoresOverview({
  goleadores,
  source,
  heroImageSrc = brandImages.mascots.ranking,
  heroImageAlt = "Hero visual de goleadores",
}: Props) {
  const summary = buildGoleadoresSummary(goleadores, source);

  const stats = [
    {
      title: "Goleadores cargados",
      detail: "Total visible en la tabla actual",
      value: String(summary.total),
      icon: Goal,
      ringClassName: "bg-[#5993B6]/16 text-[#AEEBFF]",
    },
    // {
    //   title: "Fuente actual",
    //   detail: "Origen de la ultima carga",
    //   value: summary.sourceLabel,
    //   icon: RadioTower,
    //   ringClassName: "bg-[#FAB438]/14 text-[#FFE4A3]",
    // },
    {
      title: "Maximo goleador",
      detail: summary.maximoDetalle,
      value: summary.maximoGoleador,
      icon: Trophy,
      ringClassName: "bg-emerald-400/14 text-emerald-200",
    },
    {
      title: "Selecciones representadas",
      detail: "Paises con al menos un gol cargado",
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

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:min-h-[364px] xl:px-7 xl:py-6 2xl:min-h-[420px] 2xl:px-8 2xl:py-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.96)_0%,rgba(30,44,70,0.92)_34%,rgba(37,53,80,0.72)_64%,rgba(30,44,70,0.9)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(89,147,182,0.24),transparent_30%),radial-gradient(circle_at_15%_12%,rgba(250,180,56,0.15),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_42%,rgba(255,255,255,0.02)_100%)]" />
            <div className={DASHBOARD_HERO_PATTERN} />
            <div className="absolute inset-y-0 right-[18%] w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
            <div className="absolute -right-8 top-6 h-40 w-40 rounded-full bg-[#5993B6]/14 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
              Goleadores Mundial 2026
            </div>

            <div className="mt-6 space-y-2.5 xl:mt-8">
              <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                Ranking de <span className="text-[#5993B6]">goleadores</span>
              </h1>

              <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                control de máximos anotadores
              </p>

              <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                Cargá, actualizá y revisá la tabla de máximos goleadores del Mundial 2026.
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-8 xl:pt-10 2xl:pt-18">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                {summary.total} goleador{summary.total === 1 ? "" : "es"} visibles
              </div>
              {/* <div className="rounded-2xl border border-[#5993B6]/28 bg-[#5993B6]/14 px-4 py-2 text-sm font-semibold text-[#AEEBFF]">
                Fuente actual: {summary.sourceLabel}
              </div> */}
              <div className="rounded-2xl border border-[#FAB438]/24 bg-[#FAB438]/12 px-4 py-2 text-sm font-semibold text-[#FFE4A3]">
                Selecciones representadas: {summary.seleccionesRepresentadas}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[-18px] right-[-6px] z-20 hidden h-[400px] w-[389px] xl:block 2xl:bottom-[-22px] 2xl:right-[-2px] 2xl:h-[464px] 2xl:w-[454px]">
            <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
            <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
            <HeroVisualImage
              src={heroImageSrc}
              alt={heroImageAlt}
              sizes="(min-width: 1536px) 454px, 389px"
              priority
              baseClassName="object-contain object-[center_bottom] opacity-[0.88] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
            />
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
              title="Vista rápida"
              description="Metricas construidas con la misma data real que ya usa la pantalla."
            />

            <div className="space-y-2.5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className={`${DASHBOARD_SUBCARD} flex min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 text-white`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${stat.ringClassName}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                        {stat.title}
                      </p>
                      <p className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                        {stat.detail}
                      </p>
                    </div>

                    <div className="max-w-[120px] text-right">
                      <p className="font-brand truncate text-[1.55rem] leading-none tracking-[0.03em] text-white">
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
