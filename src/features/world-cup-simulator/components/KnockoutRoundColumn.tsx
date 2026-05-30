"use client";

import type { KnockoutMatch } from "@/features/world-cup-simulator/engine/types";

import { KnockoutMatchCard } from "./KnockoutMatchCard";

type KnockoutRoundColumnProps = {
  title: string;
  matches: KnockoutMatch[];
  onScoreChange: (
    matchId: string,
    side: "local" | "visitante",
    value: number | null,
    penaltyWinner?: "local" | "visitante" | null,
  ) => void;
};

export function KnockoutRoundColumn({
  title,
  matches,
  onScoreChange,
}: KnockoutRoundColumnProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
        {title}
      </div>
      <div className="space-y-4">
        {matches.map((match) => (
          <KnockoutMatchCard
            key={match.id}
            match={match}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>
    </div>
  );
}
