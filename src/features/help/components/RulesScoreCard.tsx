import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "./help-surface.styles";

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
          ? "group relative gap-0 overflow-hidden rounded-[24px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42"
          : "group relative gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]"
      }
    >
      {isDark ? (
        <div className={HELP_TOP_ACCENT}>
          <div className={HELP_TOP_ACCENT_INNER} />
          <div className={HELP_TOP_ACCENT_GLOW} />
          <div className={HELP_TOP_ACCENT_HAIR} />
        </div>
      ) : (
        <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
      )}
      <div
        className={
          isDark
            ? "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_36%)] opacity-70"
            : "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        }
      />
      <CardContent className="relative flex h-full flex-col gap-4 px-6 py-5">
        <div
          className={
            isDark
              ? "grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#5993B6]/18 text-[#AEEBFF]"
              : "grid h-12 w-12 place-items-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-colors duration-300 group-hover:bg-[#008C93]/15"
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
