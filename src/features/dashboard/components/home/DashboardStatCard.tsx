"use client";

import { Info, type LucideIcon } from "lucide-react";

import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type DashboardStatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  valueSecondary?: string;
  detail: string;
  tone: "green" | "purple" | "amber" | "blue";
  progress?: number;
};

const TONE_STYLES = {
  green: {
    glow: "bg-emerald-400/16",
    icon: "bg-emerald-400/16 text-emerald-200",
    progress: "bg-emerald-400",
  },
  purple: {
    glow: "bg-violet-400/14",
    icon: "bg-[#5993B6]/18 text-[#D8F2FF]",
    progress: "bg-[#5993B6]",
  },
  amber: {
    glow: "bg-amber-400/14",
    icon: "bg-[#FAB438]/16 text-[#FFE4A3]",
    progress: "bg-[#FAB438]",
  },
  blue: {
    glow: "bg-sky-400/14",
    icon: "bg-white/[0.08] text-[#AEEBFF]",
    progress: "bg-[#5993B6]",
  },
} as const;

export function DashboardStatCard({
  icon: Icon,
  title,
  value,
  valueSecondary,
  detail,
  tone,
  progress,
}: DashboardStatCardProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <article className={`${DASHBOARD_PANEL} rounded-[28px]`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${toneStyle.glow}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex min-w-0 items-start gap-3 xl:gap-4">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneStyle.icon} xl:h-12 xl:w-12`}
        >
          <Icon className="h-5 w-5 xl:h-6 xl:w-6" />
        </span>

        <div className="min-w-0 pt-0.5">
          <p className="line-clamp-2 text-sm font-bold leading-5 text-white/70">
            {title}
          </p>
          <div className="mt-2 flex items-end gap-1.5">
            <p className="brand-heading text-[2rem] font-black leading-none tracking-[0.02em] text-white xl:text-[2.2rem]">
              {value}
            </p>
            {valueSecondary ? (
              <p className="pb-0.5 text-[1rem] font-bold leading-none tracking-[-0.03em] text-white/52 xl:text-[1.15rem]">
                / {valueSecondary}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        {detail ? (
          <div className="flex items-start gap-2 text-sm font-semibold text-white/66">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="line-clamp-2">{detail}</p>
          </div>
        ) : null}
      </div>

      {progress !== undefined ? (
        <div className="relative mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${toneStyle.progress}`}
              style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-black text-white/66">
            {progress}%
          </span>
        </div>
      ) : null}
    </article>
  );
}
