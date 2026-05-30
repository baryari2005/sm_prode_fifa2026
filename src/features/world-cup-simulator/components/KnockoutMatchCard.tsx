"use client";

import { FlagImage } from "@/components/ui/flag-image";
import type { KnockoutMatch } from "@/features/world-cup-simulator/engine/types";

import { GroupMatchInput } from "./GroupMatchInput";

type KnockoutMatchCardProps = {
  match: KnockoutMatch;
  onScoreChange: (
    matchId: string,
    side: "local" | "visitante",
    value: number | null,
    penaltyWinner?: "local" | "visitante" | null,
  ) => void;
};

export function KnockoutMatchCard({ match, onScoreChange }: KnockoutMatchCardProps) {
  const needsPenalty =
    match.golesLocal !== null &&
    match.golesVisitante !== null &&
    match.golesLocal === match.golesVisitante &&
    match.local.team &&
    match.visitante.team;

  return (
    <div className="w-[260px] rounded-[24px] border border-white/10 bg-[#0E1B31]/95 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
        Partido {match.orden}
      </p>

      <TeamRow
        team={match.local.team}
        slot={match.local.slot}
        score={match.golesLocal ?? null}
        onChange={(value) => onScoreChange(match.id, "local", value)}
      />
      <TeamRow
        team={match.visitante.team}
        slot={match.visitante.slot}
        score={match.golesVisitante ?? null}
        onChange={(value) => onScoreChange(match.id, "visitante", value)}
      />

      {needsPenalty ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-bold ${
              match.penaltyWinner === "local"
                ? "border-emerald-300/30 bg-emerald-400/16 text-emerald-100"
                : "border-white/10 bg-white/[0.06] text-white/70"
            }`}
            onClick={() => onScoreChange(match.id, "local", match.golesLocal ?? null, "local")}
          >
            Gana local
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full border px-3 py-2 text-xs font-bold ${
              match.penaltyWinner === "visitante"
                ? "border-emerald-300/30 bg-emerald-400/16 text-emerald-100"
                : "border-white/10 bg-white/[0.06] text-white/70"
            }`}
            onClick={() =>
              onScoreChange(match.id, "visitante", match.golesVisitante ?? null, "visitante")
            }
          >
            Gana visita
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TeamRow({
  team,
  slot,
  score,
  onChange,
}: {
  team: KnockoutMatch["local"]["team"];
  slot: string;
  score: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-white/8 py-3 first:border-t-0 first:pt-0 last:pb-0">
      {team ? (
        <>
          <FlagImage
            nombre={team.nombre}
            codigo={team.codigo}
            bandera={team.banderaUrl}
            widthClassName="w-8"
            heightClassName="h-6"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{team.nombre}</p>
            <p className="text-[11px] text-white/45">{team.codigo}</p>
          </div>
        </>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white/76">Por definir</p>
          <p className="text-[11px] text-white/40">{slot}</p>
        </div>
      )}

      <GroupMatchInput value={score} onChange={onChange} />
    </div>
  );
}
