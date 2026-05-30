import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HelpSection } from "../types/help-content.types";
import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "./help-surface.styles";

type HelpSectionCardProps = {
  section: HelpSection;
  variant?: "light" | "dark";
  topAccentVariant?: "default" | "help";
};

export function HelpSectionCard({
  section,
  variant = "light",
  topAccentVariant = "default",
}: HelpSectionCardProps) {
  const Icon = section.icon;
  const isDark = variant === "dark";
  const useHelpAccent = isDark && topAccentVariant === "help";

  return (
    <Card
      className={
        isDark
          ? "group relative h-fit gap-0 self-start overflow-hidden rounded-[24px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42"
          : "group relative h-fit gap-0 self-start overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]"
      }
    >
      {useHelpAccent ? (
        <div className={HELP_TOP_ACCENT}>
          <div className={HELP_TOP_ACCENT_INNER} />
          <div className={HELP_TOP_ACCENT_GLOW} />
          <div className={HELP_TOP_ACCENT_HAIR} />
        </div>
      ) : isDark ? (
        <div className="h-1 w-full bg-gradient-to-r from-[#FAB438] via-[#5993B6] to-[#AEEBFF]" />
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

      <CardHeader className="relative space-y-3 px-6 py-5">
        <div className="flex items-start gap-3">
          <div
            className={
              isDark
                ? "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#5993B6]/18 text-[#AEEBFF]"
                : "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-colors duration-300 group-hover:bg-[#008C93]/15"
            }
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 space-y-1">
            <CardTitle
              className={isDark ? "text-lg font-black text-white" : "text-lg font-black text-slate-950"}
            >
              {section.title}
            </CardTitle>
            {section.description ? (
              <p className={isDark ? "text-sm leading-6 text-white/70" : "text-sm leading-6 text-slate-600"}>
                {section.description}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 px-6 pb-5 pt-0">
        {section.steps?.length ? (
          <div className="space-y-3">
            {section.steps.map((step, index) => (
              <div
                key={`${section.title}-${step.title}-${index}`}
                className={
                  isDark
                    ? "flex gap-3 rounded-2xl border border-white/10 bg-[#425675]/55 px-4 py-3"
                    : "flex gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 transition-colors duration-300 group-hover:border-[#12b8c9]/20 group-hover:bg-[#f8feff]"
                }
              >
                <div
                  className={
                    isDark
                      ? "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FAB438]/14 text-sm font-black text-[#FFE4A3]"
                      : "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#008C93]/10 text-sm font-black text-[#008C93]"
                  }
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>{step.title}</p>
                  <p className={isDark ? "text-sm leading-6 text-white/70" : "text-sm leading-6 text-slate-600"}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {section.points?.length ? (
          <div className="space-y-2">
            {section.points.map((point) => (
              <div key={point} className={isDark ? "flex gap-2 text-sm leading-6 text-white/72" : "flex gap-2 text-sm leading-6 text-slate-700"}>
                <CheckCircle2 className={isDark ? "mt-0.5 h-4 w-4 shrink-0 text-[#AEEBFF]" : "mt-0.5 h-4 w-4 shrink-0 text-emerald-600"} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        ) : null}

        {section.note ? (
          <div
            className={
              isDark
                ? "rounded-2xl border border-[#FAB438]/24 bg-[#FAB438]/10 px-4 py-3 text-sm leading-6 text-[#FFE4A3]"
                : "rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900 transition-colors duration-300 group-hover:bg-amber-50"
            }
          >
            {section.note}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
