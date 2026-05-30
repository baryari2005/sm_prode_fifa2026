"use client";

import {
  Clock3,
  RefreshCw,
  Save,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import { brandImages } from "@/config/brand-images";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

type PronosticoRapidoDashboardHeroProps = {
  totalPartidos: number;
  pronosticosCompletos: number;
  pendingChangesCount: number;
  hasVisibleLiveMatches: boolean;
  saving: boolean;
  isAutoRefreshing: boolean;
  nextAutoRefreshIn: number;
  onSaveAll: () => void;
};

export function PronosticoRapidoDashboardHero({
  totalPartidos,
  pronosticosCompletos,
  pendingChangesCount,
  hasVisibleLiveMatches,
  saving,
  isAutoRefreshing,
  nextAutoRefreshIn,
  onSaveAll,
}: PronosticoRapidoDashboardHeroProps) {
  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

      <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
        <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
            <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
            <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
              Mis pronosticos
            </div>

            <div className="mt-6 space-y-2.5 xl:mt-8">
              <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                Carga de <span className="text-[#5993B6]">predicciones</span>
              </h1>

              <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                Pronostica por zona, fecha y cierre
              </p>

              <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                Completa varios partidos en una sola vista, sigue los cierres en
                tiempo real y guarda todo junto cuando tengas lista la fecha.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">

              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
              >
                <Clock3 className="mr-2 h-4 w-4" />
                Actualiza en {nextAutoRefreshIn}s
              </Button>

              <Button
                type="button"
                onClick={onSaveAll}
                disabled={saving || pendingChangesCount === 0}
                className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
              >
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar todo
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[-28px] right-[-20px] z-20 hidden h-[470px] w-[458px] xl:block 2xl:bottom-[-34px] 2xl:right-[-14px] 2xl:h-[546px] 2xl:w-[534px]">
            <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
            <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
            <HeroVisualImage
              src={brandImages.mascots.cargaPrediccion}
              alt="Hero visual de pronosticos"
              sizes="(min-width: 1536px) 534px, 458px"
              priority
              baseClassName="object-contain object-[center_bottom] opacity-[0.88] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
            />
          </div>
        </section>

        <aside className={DASHBOARD_PANEL}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>          

          <LateralSummaryHeader
            title="Resumen lateral"
            description="Estado rápido de tu fecha, cambios pendientes y partidos abiertos."
          />

          <div className="space-y-2.5">
            <MetricCard
              icon={<Target className="h-4.5 w-4.5" />}
              tone="sky"
              title="Pronosticos cargados"
              detail={`${pronosticosCompletos} de ${totalPartidos} partidos completos`}
              value={`${pronosticosCompletos}/${totalPartidos}`}
            />
            <MetricCard
              icon={<Zap className="h-4.5 w-4.5" />}
              tone="gold"
              title="Cambios pendientes"
              detail="Partidos editados aun sin guardar"
              value={`${pendingChangesCount}`}
            />
            <MetricCard
              icon={<Trophy className="h-4.5 w-4.5" />}
              tone="emerald"
              title="Estado general"
              detail={
                hasVisibleLiveMatches
                  ? "Hay partidos en juego y el refresh esta activo"
                  : isAutoRefreshing
                    ? "Actualizando informacion en este momento"
                    : "Todo listo para seguir cargando"
              }
              value={hasVisibleLiveMatches ? "LIVE" : "OK"}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  tone,
  title,
  detail,
  value,
}: {
  icon: React.ReactNode;
  tone: "sky" | "gold" | "emerald";
  title: string;
  detail: string;
  value: string;
}) {
  const toneClassName =
    tone === "gold"
      ? "bg-[#FAB438]/14 text-[#FFE4A3]"
      : tone === "emerald"
        ? "bg-emerald-400/14 text-emerald-200"
        : "bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <div
      className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
          {detail}
        </span>
      </span>
      <span className="font-brand text-[1.55rem] leading-none tracking-[0.03em] text-white">
        {value}
      </span>
    </div>
  );
}
