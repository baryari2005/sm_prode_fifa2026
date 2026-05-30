"use client";

import type { SimulatorGroup, TeamStanding } from "@/features/world-cup-simulator/engine/types";

import { GroupCard } from "./GroupCard";

type GroupStageSimulatorProps = {
  groups: SimulatorGroup[];
  standingsByGroup: Record<string, TeamStanding[]>;
  onScoreChange: (matchId: string, side: "local" | "visitante", value: number | null) => void;
};

export function GroupStageSimulator({
  groups,
  standingsByGroup,
  onScoreChange,
}: GroupStageSimulatorProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {groups.map((group) => (
        <GroupCard
          key={group.grupo}
          group={group}
          standings={standingsByGroup[group.grupo] ?? []}
          onScoreChange={onScoreChange}
        />
      ))}
    </div>
  );
}
