import Image from "next/image";

import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

type LineupTeamBarProps = {
  equipo: PartidoDetalleEquipo;
  formacion?: string;
  position: "top" | "bottom";
};

export function LineupTeamBar({
  equipo,
  formacion,
  position,
}: LineupTeamBarProps) {
  return (
    <div
      className={`flex items-center justify-between bg-[#7BC78D] px-5 py-3 ${
        position === "top" ? "border-b border-white/35" : "border-t border-white/35"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/75 p-1 shadow-sm">
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
            <span className="text-xs font-bold text-slate-600">
              {equipo.nombre.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <p className="truncate text-base font-semibold text-slate-950">
          {equipo.nombre}
        </p>
      </div>

      {formacion && (
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
          {formacion}
        </span>
      )}
    </div>
  );
}
