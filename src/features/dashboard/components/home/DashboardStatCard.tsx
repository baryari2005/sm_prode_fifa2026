"use client";

import type { LucideIcon } from "lucide-react";

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
    icon: "bg-emerald-50 text-emerald-700",
    progress: "bg-emerald-500",
  },
  purple: {
    glow: "bg-violet-400/14",
    icon: "bg-violet-50 text-violet-700",
    progress: "bg-violet-500",
  },
  amber: {
    glow: "bg-amber-400/14",
    icon: "bg-amber-50 text-amber-700",
    progress: "bg-amber-500",
  },
  blue: {
    glow: "bg-sky-400/14",
    icon: "bg-sky-50 text-sky-700",
    progress: "bg-sky-500",
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
    <article className="group relative min-w-0 overflow-hidden rounded-[28px] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] xl:p-4 2xl:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${toneStyle.glow}`}
      />

      <div className="relative flex min-w-0 items-start gap-3 xl:gap-4">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneStyle.icon} xl:h-12 xl:w-12`}
        >
          <Icon className="h-5 w-5 xl:h-6 xl:w-6" />
        </span>

        <div className="min-w-0 pt-0.5">
          <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-end gap-1.5">
            <p className="text-[2rem] font-black leading-none tracking-[-0.07em] text-slate-950 xl:text-[2.2rem]">
              {value}
            </p>
            {valueSecondary ? (
              <p className="pb-0.5 text-[1rem] font-bold leading-none tracking-[-0.03em] text-slate-400 xl:text-[1.15rem]">
                / {valueSecondary}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <p className="line-clamp-2 text-sm font-semibold text-slate-500">
          {detail}
        </p>
      </div>

      {progress !== undefined ? (
        <div className="relative mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${toneStyle.progress}`}
              style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-black text-slate-500">
            {progress}%
          </span>
        </div>
      ) : null}
    </article>
  );
}
