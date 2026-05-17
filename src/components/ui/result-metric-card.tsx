import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ResultMetricCardProps = {
  icono?: LucideIcon;
  titulo: string;
  descripcion?: string;
  resultado: ReactNode;
  className?: string;
};

export function ResultMetricCard({
  icono: Icono,
  titulo,
  descripcion,
  resultado,
  className,
}: ResultMetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative flex min-h-[96px] items-center gap-4 px-5 py-4">
        {Icono ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-transform duration-200 group-hover:scale-105">
            <Icono className="h-5 w-5" />
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">
            {titulo}
          </p>

          {descripcion ? (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {descripcion}
            </p>
          ) : null}

          <p className="mt-2 text-3xl font-black leading-none tracking-tight text-slate-950">
            {resultado}
          </p>
        </div>
      </div>
    </div>
  );
}