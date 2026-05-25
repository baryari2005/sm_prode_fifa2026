import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type RulesScoreCardProps = {
  title: string;
  points: number;
  description: string;
  icon: LucideIcon;
};

export function RulesScoreCard({
  title,
  points,
  description,
  icon: Icon,
}: RulesScoreCardProps) {
  return (
    <Card className="group relative gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative flex h-full flex-col gap-4 px-6 py-5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-colors duration-300 group-hover:bg-[#008C93]/15">
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2 rounded-2xl transition-colors duration-300 group-hover:bg-[#f8feff]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <div className="text-4xl font-black tracking-tight text-slate-950">
            {points}
            <span className="ml-1 text-xl font-bold text-slate-500">pts</span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
