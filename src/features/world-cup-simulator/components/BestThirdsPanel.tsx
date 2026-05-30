"use client";

import { Badge } from "@/components/ui/badge";
import { FlagImage } from "@/components/ui/flag-image";
import type { TeamStanding } from "@/features/world-cup-simulator/engine/types";

type BestThirdsPanelProps = {
  thirds: TeamStanding[];
  bestThirds: TeamStanding[];
};

export function BestThirdsPanel({ thirds, bestThirds }: BestThirdsPanelProps) {
  const qualifiedIds = new Set(bestThirds.map((team) => team.seleccionId));

  if (thirds.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/14 bg-white/[0.04] px-6 py-10 text-center text-sm font-medium text-white/60">
        Completá algunos resultados para empezar a ver los terceros de cada grupo.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {thirds.map((team) => {
        const isQualified = qualifiedIds.has(team.seleccionId);

        return (
          <div
            key={team.seleccionId}
            className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <FlagImage
                  nombre={team.nombre}
                  codigo={team.codigo}
                  bandera={team.banderaUrl}
                  widthClassName="w-10"
                  heightClassName="h-7"
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-black">{team.nombre}</p>
                  <p className="text-xs text-white/50">
                    Grupo {team.grupo} · {team.codigo}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  isQualified
                    ? "rounded-full bg-emerald-400/18 text-emerald-100 hover:bg-emerald-400/18"
                    : "rounded-full bg-white/10 text-white/70 hover:bg-white/10"
                }
              >
                {isQualified ? "Mejor tercero" : "Eliminado"}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <Metric label="Pts" value={team.puntos} />
              <Metric label="DG" value={team.diferenciaGol >= 0 ? `+${team.diferenciaGol}` : team.diferenciaGol} />
              <Metric label="GF" value={team.golesFavor} />
              <Metric label="PJ" value={team.partidosJugados} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-[#112038]/70 px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
