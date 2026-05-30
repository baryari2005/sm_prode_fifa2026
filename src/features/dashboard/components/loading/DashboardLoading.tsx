import Image from "next/image";
import { LoaderCircle, Sparkles } from "lucide-react";

import { brandImages } from "@/config/brand-images";

import { DashboardLoadingBadge } from "./DashboardLoadingBadge";

type Props = {
  badgeLabel?: string;
  source?: string;
};

export default function DashboardLoading({
  badgeLabel,
  source,
}: Props) {
  const resolvedBadgeLabel = badgeLabel ?? source ?? "Loading dashboard";

  return (
    <div className="relative min-h-[78vh] w-full overflow-hidden rounded-[2rem] border border-white/8 px-5 py-5">
      <div className="absolute inset-0 bg-[#243552]" />

      <div className="absolute inset-0 opacity-[0.16]">
        <Image
          src={brandImages.prode.pattern}
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_84%_18%,rgba(250,180,56,0.08),transparent_16%)]" />

      <div className="pointer-events-none absolute left-[2%] bottom-[7%] h-[18%] w-[18%] opacity-[0.05]">
        <Image
          src={brandImages.institucional.masSanMiguelLogo}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-contain"
        />
      </div>

      <div className="pointer-events-none absolute right-[-2%] top-[-2%] h-[14%] w-[14%] opacity-[0.08]">
        <Image
          src={brandImages.institucional.solArgentino}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-contain"
        />
      </div>

      <div className="relative z-10 grid min-h-[74vh] items-center gap-8 px-6 py-8 lg:grid-cols-[1.18fr_0.92fr] lg:px-10 xl:px-12">
        <section className="space-y-8 self-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FAB438]/18 bg-white/[0.08] px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
            <DashboardLoadingBadge badgeLabel={resolvedBadgeLabel} />
          </div>

          <div className="space-y-4">
            <p className="text-[13px] font-black uppercase tracking-[0.26em] text-[#AEEBFF]">
              Estado de carga
            </p>

            <h1 className="font-brand max-w-[680px] text-5xl leading-[0.92] tracking-[0.04em] text-white md:text-6xl xl:text-7xl">
              Preparando la cancha
            </h1>

            <p className="max-w-[760px] text-lg leading-9 text-white/72 xl:text-[1.9rem] xl:leading-[1.45] xl:text-[clamp(1.05rem,1.15vw,1.35rem)]">
              Estamos cargando partidos, pronósticos y todo el orgullo de barrio
              para que el dashboard aparezca listo para jugar o administrar.
            </p>
          </div>

          <div className="flex max-w-[820px] items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.06] px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/14 text-[#AEEBFF]">
              <LoaderCircle className="h-7 w-7 animate-spin" />
            </span>

            <div className="min-w-0">
              <p className="text-[1.1rem] font-black text-white">
                Cargando datos en tiempo real
              </p>
              <p className="text-[0.98rem] font-semibold text-white/58">
                Usuarios, ranking, fixture y estado del sistema.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[680px] overflow-hidden rounded-[34px] border border-[#355373] bg-[linear-gradient(180deg,#09213E_0%,#102A47_100%)] px-7 py-7 text-center shadow-[0_30px_70px_rgba(0,0,0,0.24)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#355373] via-[#5993B6] to-[#FAB438]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(89,147,182,0.18),transparent_28%)]" />

            <div className="relative z-10 space-y-5">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#5993B6]/18 bg-[#5993B6]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#AEEBFF]">
                <Sparkles className="h-3.5 w-3.5" />
                Más San Miguel
              </div>

              <div className="relative mx-auto h-[360px] w-[360px] md:h-[400px] md:w-[400px]">
                <div className="pointer-events-none absolute inset-6 rounded-full bg-[#5993B6]/16 blur-3xl" />
                <Image
                  src={brandImages.mascots.loading}
                  alt="Cargando Prode Mundial 2026"
                  fill
                  priority
                  sizes="400px"
                  className="select-none object-contain drop-shadow-[0_26px_52px_rgba(0,0,0,0.3)]"
                />
              </div>

              <div className="space-y-3">
                <h2 className="font-brand text-4xl leading-[0.96] tracking-[0.04em] text-white md:text-[3rem]">
                  Un momento, ya salimos a <span className="text-brand-blue">la cancha</span>
                </h2>
                <p className="mx-auto max-w-[440px] text-[1rem] leading-8 text-white/66 md:text-[1.1rem]">
                  El dashboard se está preparando
                  <br />aguarde un momento por favor.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                  <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-[#355373] via-[#5993B6] to-[#AEEBFF]" />
                </div>

                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white/58">
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#AEEBFF]" />
                  <span>Cargando dashboard del Prode Mundial 2026</span>
                </div>

                {/* <DashboardLoadingDebugInfo source={source} /> */}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-130%);
          }
          100% {
            transform: translateX(330%);
          }
        }

        .animate-loading-bar {
          animation: loadingBar 1.45s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
