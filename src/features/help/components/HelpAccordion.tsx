import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { HelpFaqItem } from "../types/help-content.types";

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
}: HelpAccordionProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={
        isDark
          ? "group relative gap-0 overflow-hidden rounded-[28px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42"
          : "group gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]"
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

      <CardHeader className="relative space-y-2 px-6 py-5">
        <CardTitle className={isDark ? "text-2xl font-black text-white" : "text-xl font-black text-slate-950"}>
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
                ? `group/details rounded-2xl px-4 py-3 transition-all duration-300 open:bg-white/[0.1] hover:border-[#5993B6]/40 ${DASHBOARD_SUBCARD}`
                : "group/details rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition-all duration-300 open:bg-white hover:border-[#12b8c9]/25 hover:bg-[#f8feff]"
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
