// src/components/common/LateralSummaryHeader.tsx

import { Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type LateralSummaryHeaderProps = {
  title?: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
};

export function LateralSummaryHeader({
  title = "Vista rápida",
  description,
  icon: Icon = Info,
  className,
}: LateralSummaryHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <p className="mt-2 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
        {title}
      </p>

      <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />

        <span className="max-w-[260px]">
          {description}
        </span>
      </p>
    </div>
  );
}