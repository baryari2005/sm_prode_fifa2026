import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HelpSection } from "../types/help-content.types";

type HelpSectionCardProps = {
  section: HelpSection;
};

export function HelpSectionCard({ section }: HelpSectionCardProps) {
  const Icon = section.icon;

  return (
    <Card className="group relative h-fit gap-0 self-start overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative space-y-3 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-colors duration-300 group-hover:bg-[#008C93]/15">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-black text-slate-950">
              {section.title}
            </CardTitle>
            {section.description ? (
              <p className="text-sm leading-6 text-slate-600">
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
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 transition-colors duration-300 group-hover:border-[#12b8c9]/20 group-hover:bg-[#f8feff]"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#008C93]/10 text-sm font-black text-[#008C93]">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm leading-6 text-slate-600">
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
              <div key={point} className="flex gap-2 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        ) : null}

        {section.note ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900 transition-colors duration-300 group-hover:bg-amber-50">
            {section.note}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
