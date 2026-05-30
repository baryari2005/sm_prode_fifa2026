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
  headerContent?: ReactNode;
};

export function SectionCard({
  title,
  description,
  actions,
  children,
  headerContent,
}: SectionCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] 
    border border-white/10 bg-[#223553]/90 text-white
     shadow-[0_20px_55px_rgba(2,8,23,0.22)] transition-all duration-200 
     hover:-translate-y-0.5 hover:border-[#7DD3FC]/30 
     hover:shadow-[0_26px_60px_rgba(2,8,23,0.3)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5993B6] via-[#AEEBFF] to-[#FAB438]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardHeader className="relative ">
        {headerContent ? (
          headerContent
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-white">{title}</CardTitle>
              <CardDescription
                className="text-white/65"
                icon={<Info className="h-4 w-4 text-[#AEEBFF]" />}
              >
                {description}
              </CardDescription>
            </div>

            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative ">
        {children}
      </CardContent>
    </Card>
  );
}
