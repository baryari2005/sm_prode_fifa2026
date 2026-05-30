"use client";

import { FlagImage } from "@/components/ui/flag-image";
import type { SimulatorGroup, TeamStanding } from "@/features/world-cup-simulator/engine/types";

import { GroupMatchInput } from "./GroupMatchInput";
import { GroupStandingsTable } from "./GroupStandingsTable";

type GroupCardProps = {
  group: SimulatorGroup;
  standings: TeamStanding[];
  onScoreChange: (matchId: string, side: "local" | "visitante", value: number | null) => void;
};

export function GroupCard({ group, standings, onScoreChange }: GroupCardProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(6,27,51,0.96)_0%,rgba(12,36,66,0.94)_100%)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Fase de grupos
          </p>
          <h3 className="text-2xl font-black text-white">Grupo {group.grupo}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">
          {group.partidos.length} partidos
        </div>
      </div>

      <div className="space-y-3">
        {group.partidos.map((match) => (
          <div
            key={match.id}
            className="rounded-[22px] border border-white/8 bg-white/[0.05] p-3"
          >
            <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2">
              <div className="flex min-w-0 items-center justify-end gap-2">
                <div className="min-w-0 text-right">
                  <p className="truncate text-sm font-bold text-white">{match.local.nombre}</p>
                  <p className="text-[11px] text-white/45">{match.local.codigo}</p>
                </div>
                <FlagImage
                  nombre={match.local.nombre}
                  codigo={match.local.codigo}
                  bandera={match.local.banderaUrl}
                  widthClassName="w-8"
                  heightClassName="h-6"
                />
              </div>

              <GroupMatchInput
                value={match.golesLocal}
                onChange={(value) => onScoreChange(match.id, "local", value)}
              />
              <span className="text-sm font-black text-white/55">-</span>
              <GroupMatchInput
                value={match.golesVisitante}
                onChange={(value) => onScoreChange(match.id, "visitante", value)}
              />

              <div className="flex min-w-0 items-center gap-2">
                <FlagImage
                  nombre={match.visitante.nombre}
                  codigo={match.visitante.codigo}
                  bandera={match.visitante.banderaUrl}
                  widthClassName="w-8"
                  heightClassName="h-6"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{match.visitante.nombre}</p>
                  <p className="text-[11px] text-white/45">{match.visitante.codigo}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <GroupStandingsTable standings={standings} />
      </div>
    </section>
  );
}
