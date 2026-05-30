"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Network, RefreshCcw, ShieldAlert, Sigma } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { ReimportarPartidosHeader } from "./ReimportarPartidosHeader";
import {
  PartidosResetImportacion,
  type ResetPartidosResponse,
} from "./PartidosResetImportacion";

type FixtureResetOverviewProps = {
  canRun: boolean;
  running: boolean;
  summary: ResetPartidosResponse | null;
  onRun: () => void;
};

export function FixtureResetOverview({
  canRun,
  running,
  summary,
  onRun,
}: FixtureResetOverviewProps) {
  const stats = [
    {
      label: "Total API",
      detail: summary ? "Ultima reimportacion" : "Sin ejecucion todavia",
      value: String(summary?.meta?.totalApi ?? 0),
      icon: Sigma,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      label: "Partidos recreados",
      detail: "Post reset",
      value: String(summary?.meta?.creados ?? 0),
      icon: RefreshCcw,
      toneClass: "bg-[#FAB438]/14 text-[#FFE4A3]",
    },
    {
      label: "Errores",
      detail: "Incidencias reportadas",
      value: String(summary?.meta?.fallidos ?? 0),
      icon: ShieldAlert,
      toneClass: "bg-rose-300/14 text-rose-100",
    },
  ];

  return (
    <>
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-6 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col xl:max-w-[58%] 2xl:max-w-[60%]">
              <div className="flex h-full flex-col">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
                  Gestionar fixture
                </div>

                <div className="mt-6 space-y-3 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Reset <span className="text-[#5993B6]">total</span>
                  </h1>

                  <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Reimportacion completa
                  </p>

                  <p className="max-w-[560px] pt-1 text-[0.95rem] leading-6 text-white/78 xl:text-[1rem]">
                    Esta es la accion mas sensible del fixture: borra datos operativos y
                    reconstruye todo desde la API para arrancar de cero.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Destructiva", "API", "Reinicio", "Fixture"].map((label) => (
                    <Badge
                      key={label}
                      className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-8 xl:pt-10">
                  <Button
                    type="button"
                    onClick={onRun}
                    disabled={!canRun || running}
                    className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {running ? "Reimportando..." : "Borrar y reimportar desde API"}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Link href="/admin/partidos">
                      <Network className="mr-2 h-4 w-4" />
                      Volver a gestionar fixture
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-10px] right-[-18px] z-20 hidden h-[440px] w-[340px] xl:block 2xl:bottom-[-16px] 2xl:right-[-8px] 2xl:h-[510px] 2xl:w-[390px]">
              <div className="absolute inset-[12%] rounded-full bg-[#5993B6]/30 blur-[128px]" />
              <div className="absolute bottom-[15%] right-[10%] h-40 w-40 rounded-full bg-[#0EA5E9]/18 blur-[80px]" />
              <div className="absolute right-[18%] top-[12%] h-28 w-28 rounded-full bg-[#FAB438]/12 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_52%_100%,rgba(8,26,48,0.24),transparent_56%)]" />
              <Image
                src="/brand/reset_fixture.png"
                alt="Ilustracion para reset total del fixture"
                fill
                priority
                sizes="(min-width: 1536px) 390px, 340px"
                className="relative object-contain object-bottom opacity-[0.94] drop-shadow-[0_44px_92px_rgba(0,0,0,0.5)] [mask-image:radial-gradient(circle_at_50%_56%,black_66%,transparent_96%)] [-webkit-mask-image:radial-gradient(circle_at_50%_56%,black_66%,transparent_96%)]"
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

            <div className="mb-3">
              <p className="mt-4 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Resumen lateral
              </p>
            </div>

            <div className="space-y-2.5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${stat.toneClass}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                        {stat.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                        {stat.detail}
                      </span>
                    </span>
                    <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)] xl:items-start">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Accion operativa
              </p>
              <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                Confirmacion y alcance
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#1E2C46]/72 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.18)]">
              <ReimportarPartidosHeader
                canRun={canRun}
                running={running}
                onRun={onRun}
              />
            </div>
          </div>
        </section>

        <aside className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-3">
            {[
              "Elimina partidos, resultados, predicciones, selecciones y planteles antes de reconstruir.",
              "La API vuelve a poblar el fixture con una corrida completa.",
              "Conviene usarlo solo cuando realmente necesites reiniciar el torneo.",
            ].map((item) => (
              <article
                key={item}
                className={`flex items-start gap-3 rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] bg-[#FAB438]/12 text-[#FFE4A3]">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm leading-6 text-white/72">{item}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 space-y-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Resultado operativo
            </p>
            <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
              Impacto de la reimportacion
            </h2>
          </div>

          <PartidosResetImportacion summary={summary} />
        </div>
      </section>
    </>
  );
}
