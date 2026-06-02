import type { LucideIcon } from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import {
  DASHBOARD_HERO_PATTERN,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type HelpPageHeaderProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "light" | "dark";
  topAccentVariant?: "default" | "help";
  heroImageSrc?: string;
  heroImageAlt?: string;
  heroEyebrow?: string;
};

export function HelpPageHeader({
  badge,
  title,
  description,
  icon: Icon,
  variant = "light",
  heroImageSrc,
  heroImageAlt = "",
  heroEyebrow = "guias, reglas y consultas frecuentes",
}: HelpPageHeaderProps) {
  if (variant !== "dark") {
    return (
      <section className="overflow-hidden rounded-[28px] border border-[#008C93]/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fdff_50%,#f0fbfb_100%)] shadow-[0_16px_38px_rgba(8,145,178,0.08)]">
        <div className="flex flex-col gap-5 px-6 py-7 md:px-8 md:py-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#008C93]/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#008C93]">
            <Icon className="h-3.5 w-3.5" />
            {badge}
          </div>

          <div className="space-y-2">
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              {description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="group relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_78px_rgba(2,6,23,0.3)] md:px-6 md:py-6 xl:min-h-[364px] xl:px-7 xl:py-6 2xl:min-h-[420px] 2xl:px-8 2xl:py-7">
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
        <div className={DASHBOARD_HERO_PATTERN} />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
        <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
        <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full min-w-0 flex-col justify-center xl:max-w-[62%]">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
          <Icon className="h-3.5 w-3.5" />
          {badge}
        </div>

        <div className="mt-6 space-y-2.5 xl:mt-8">
          <h1 className="max-w-[780px] text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
            {title}
          </h1>

          <p className="font-brand max-w-[700px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
            {heroEyebrow}
          </p>

          <p className="max-w-[760px] pt-2 text-[0.95rem] leading-6 text-white/78 xl:text-[1rem]">
            {description}
          </p>
        </div>
      </div>

      {heroImageSrc ? (
        <div className="pointer-events-none absolute bottom-[-12px] right-[-10px] z-20 hidden h-[400px] w-[389px] xl:block 2xl:bottom-[-18px] 2xl:right-[-6px] 2xl:h-[464px] 2xl:w-[454px]">
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
      ) : null}
    </section>
  );
}
