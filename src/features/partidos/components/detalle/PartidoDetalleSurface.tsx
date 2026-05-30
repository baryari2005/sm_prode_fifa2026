import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PartidoDetalleSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const PARTIDO_DETALLE_SURFACE_CLASSNAME =
  "group relative min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]";

export const PARTIDO_DETALLE_SUBCARD_CLASSNAME =
  "rounded-[24px] border border-white/10 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export const PARTIDO_DETALLE_INNER_PANEL_CLASSNAME =
  "rounded-[22px] border border-white/8 bg-[#0E1D30]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export function PartidoDetalleSurface({
  children,
  className,
  contentClassName,
}: PartidoDetalleSurfaceProps) {
  return (
    <section className={cn(PARTIDO_DETALLE_SURFACE_CLASSNAME, className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#5993B6] via-[#5993B6] to-[#FAB438]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.2),transparent_32%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_18%),linear-gradient(145deg,rgba(255,255,255,0.03),transparent_30%,transparent_68%,rgba(255,255,255,0.02))]" />
        <div className="absolute right-[-10%] top-[-16%] h-44 w-44 rounded-full bg-[#5993B6]/18 blur-3xl" />
        <div className="absolute -left-12 bottom-[-18%] h-36 w-36 rounded-full bg-[#FAB438]/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071628]/72 via-[#071628]/12 to-transparent" />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </section>
  );
}
