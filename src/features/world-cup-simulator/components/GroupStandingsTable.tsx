"use client";

import { FlagImage } from "@/components/ui/flag-image";
import type { TeamStanding } from "@/features/world-cup-simulator/engine/types";

type GroupStandingsTableProps = {
  standings: TeamStanding[];
};

export function GroupStandingsTable({ standings }: GroupStandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#112038]/80">
      <table className="w-full text-sm text-white">
        <thead className="bg-white/[0.05] text-[11px] uppercase tracking-[0.18em] text-white/55">
          <tr>
            <th className="px-3 py-3 text-left">Eq.</th>
            <th className="px-2 py-3 text-center">PJ</th>
            <th className="px-2 py-3 text-center">DG</th>
            <th className="px-3 py-3 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.seleccionId} className="border-t border-white/6">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-xs font-black text-[#AEEBFF]">
                    {team.posicionGrupo}
                  </span>
                  <FlagImage
                    nombre={team.nombre}
                    codigo={team.codigo}
                    bandera={team.banderaUrl}
                    widthClassName="w-7"
                    heightClassName="h-5"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{team.nombre}</p>
                    <p className="text-[11px] text-white/45">{team.codigo}</p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3 text-center font-semibold text-white/80">
                {team.partidosJugados}
              </td>
              <td className="px-2 py-3 text-center font-semibold text-white/80">
                {team.diferenciaGol >= 0 ? `+${team.diferenciaGol}` : team.diferenciaGol}
              </td>
              <td className="px-3 py-3 text-right text-base font-black">{team.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
