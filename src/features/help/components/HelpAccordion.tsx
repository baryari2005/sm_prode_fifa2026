import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HelpFaqItem } from "../types/help-content.types";
import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "./help-surface.styles";

type HelpAccordionProps = {
  title: string;
  description?: string;
  items: HelpFaqItem[];
  variant?: "light" | "dark";
  topAccentVariant?: "default" | "help";
};

export function HelpAccordion({
  title,
  description,
  items,
  variant = "light",
  topAccentVariant = "default",
}: HelpAccordionProps) {
  const isDark = variant === "dark";
  const useHelpAccent = isDark && topAccentVariant === "help";

  return (
    <Card
      className={
        isDark
          ? "group relative gap-0 overflow-hidden rounded-[24px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42"
          : "group gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]"
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
      <CardHeader className="relative space-y-2 px-6 py-5">
        <CardTitle className={isDark ? "text-xl font-black text-white" : "text-xl font-black text-slate-950"}>
          {title}
        </CardTitle>
        {description ? (
          <p className={isDark ? "text-sm leading-6 text-white/70" : "text-sm leading-6 text-slate-600"}>{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="relative space-y-3 px-6 pb-5 pt-0">
        {items.map((item) => (
          <details
            key={item.question}
            className={
              isDark
                ? "group/details rounded-2xl border border-white/10 bg-[#425675]/55 px-4 py-3 transition-all duration-300 open:bg-[#425675]/70 hover:border-[#5993B6]/40"
                : "group/details rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition-all duration-300 open:bg-white hover:border-[#12b8c9]/25 hover:bg-[#f8feff] hover:shadow-[0_12px_24px_rgba(20,184,166,0.08)]"
            }
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className={isDark ? "font-semibold text-white" : "font-semibold text-slate-900"}>{item.question}</span>
              <ChevronDown className={isDark ? "h-4 w-4 shrink-0 text-[#AEEBFF] transition-transform group-open/details:rotate-180" : "h-4 w-4 shrink-0 text-slate-500 transition-transform group-open/details:rotate-180"} />
            </summary>
            <p className={isDark ? "pt-3 text-sm leading-6 text-white/70" : "pt-3 text-sm leading-6 text-slate-600"}>{item.answer}</p>
          </details>
        ))}
      </CardContent>
    </Card>
  );
}
