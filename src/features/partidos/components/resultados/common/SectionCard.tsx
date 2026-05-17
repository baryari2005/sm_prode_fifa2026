import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";

type SectionCardProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  actions,
  children,
}: SectionCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardHeader className="relative border-b border-slate-200/70 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
             <CardDescription  icon={<Info className="h-4 w-4 text-[#008C93]" />}>{description}</CardDescription>            
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </CardHeader>

      <CardContent className="relative p-4 md:p-6">
        {children}
      </CardContent>
    </Card>
  );
}