import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowDownUp, CircleDot } from "lucide-react";

import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

type LineupTeamBarProps = {
  equipo: PartidoDetalleEquipo;
  formacion?: string;
  summary?: {
    goals: number;
    yellowCards: number;
    redCards: number;
    substitutions: number;
  };
  position: "top" | "bottom";
};

export function LineupTeamBar({
  equipo,
  formacion,
  summary,
  position,
}: LineupTeamBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 bg-[#132238]/88 px-5 py-3 ${
        position === "top" ? "border-b border-white/10" : "border-t border-white/10"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.08] p-1.5">
          {equipo.escudoUrl ? (
            <Image
              src={equipo.escudoUrl}
              alt={equipo.nombre}
              width={32}
              height={32}
              unoptimized
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs font-bold text-[#AEEBFF]">
              {(equipo.codigo ?? equipo.nombre.slice(0, 2)).toUpperCase()}
            </span>
          )}
        </div>

        <p className="truncate text-base font-semibold text-white">
          {equipo.nombre}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {summary ? (
          <>
            <StatPill icon={<CircleDot className="h-3 w-3" />} value={summary.goals} />
            <StatPill colorClassName="bg-yellow-400" value={summary.yellowCards} />
            <StatPill colorClassName="bg-red-500" value={summary.redCards} />
            <StatPill icon={<ArrowDownUp className="h-3 w-3" />} value={summary.substitutions} />
          </>
        ) : null}

        {formacion ? (
          <span className="rounded-full border border-[#FAB438]/18 bg-[#FAB438]/10 px-3 py-1 text-xs font-semibold text-[#FFE4A3]">
            {formacion}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatPill({
  value,
  icon,
  colorClassName,
}: {
  value: number;
  icon?: ReactNode;
  colorClassName?: string;
}) {
  return (
    <span className="inline-flex min-w-[30px] items-center justify-center gap-1 rounded-full border border-white/12 bg-white/[0.08] px-2 py-1 text-[11px] font-black text-white">
      {icon ? icon : <span className={`inline-block h-3.5 w-2.5 rounded-[2px] ${colorClassName}`} />}
      {value}
    </span>
  );
}
