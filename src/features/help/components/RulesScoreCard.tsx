import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type RulesScoreCardProps = {
  title: string;
  points: number;
  description: string;
  icon: LucideIcon;
  variant?: "light" | "dark";
};

export function RulesScoreCard({
  title,
  points,
  description,
  icon: Icon,
  variant = "light",
}: RulesScoreCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={
        isDark
          ? "group relative gap-0 overflow-hidden rounded-[28px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42"
          : "group relative gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]"
      }
    >
      {isDark ? (
        <>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_36%),radial-gradient(circle_at_14%_12%,rgba(250,180,56,0.12),transparent_22%)] opacity-70" />
        </>
      ) : (
        <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
      )}

      <CardContent className="relative flex h-full flex-col gap-4 px-6 py-5">
        <div
          className={
            isDark
              ? "grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#5993B6]/18 text-[#AEEBFF]"
              : "grid h-12 w-12 place-items-center rounded-2xl bg-[#008C93]/10 text-[#008C93]"
          }
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2 rounded-2xl">
          <p className={isDark ? "text-sm font-bold uppercase tracking-[0.18em] text-[#AEEBFF]" : "text-sm font-bold uppercase tracking-[0.18em] text-slate-500"}>
            {title}
          </p>
          <div className={isDark ? "text-4xl font-black tracking-tight text-white" : "text-4xl font-black tracking-tight text-slate-950"}>
            {points}
            <span className={isDark ? "ml-1 text-xl font-bold text-white/56" : "ml-1 text-xl font-bold text-slate-500"}>pts</span>
          </div>
          <p className={isDark ? "text-sm leading-6 text-white/70" : "text-sm leading-6 text-slate-600"}>{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
