"use client";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { brandImages } from "@/config/brand-images";
import { DASHBOARD_HERO_PATTERN } from "@/features/dashboard/components/home/dashboard-home.styles";

export function RankingHeader() {
  return (
    <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:min-h-[392px] xl:px-7 xl:py-6 2xl:min-h-[420px] 2xl:px-8 2xl:py-7">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
        <div className={DASHBOARD_HERO_PATTERN} />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
        <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
        <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
          Pasión mundial
        </div>

        <div className="mt-6 space-y-2.5 xl:mt-8">
          <h1 className="font-brand text-[2.1rem] font-semibold leading-[0.98] tracking-[0.04em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
            Ranking del Prode
          </h1>

          <p className="max-w-[640px] pt-2 text-[0.95rem] leading-7 text-white/78 xl:text-[1rem]">
            El orgullo del barrio se juega fecha a fecha. Segui tu posicion,
            tus puntos acumulados y el historial de pronosticos ya calificados.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-8px] right-[-30px] z-20 hidden h-[460px] w-[390px] xl:block 2xl:bottom-[-10px] 2xl:right-[-20px] 2xl:h-[560px] 2xl:w-[460px]">
        <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
        <div className="absolute inset-x-[-8%] top-[18%] h-[52%] rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.16)_36%,rgba(30,44,70,0.08)_64%,transparent_92%)] blur-[34px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
        <HeroVisualImage
          src={brandImages.mascots.ranking}
          alt=""
          sizes="(min-width: 1536px) 460px, 390px"
          baseClassName="relative object-contain object-[center_bottom] drop-shadow-[0_28px_64px_rgba(0,0,0,0.34)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
          loadedClassName="scale-[1.42] opacity-[0.82]"
          loadingClassName="scale-[0.97] opacity-0"
        />
      </div>
    </section>
  );
}
