import { ArrowUp } from "lucide-react";

import type { LineupPlayer } from "@/features/partidos/types/fixture-details";
import { PlayerJerseyAvatar } from "./PlayerJerseyAvatar";
import { PlayerActionBadges } from "./PlayerActionBadges";

type BenchPlayer = LineupPlayer & {
  fotoUrl?: string | null;
  avatarUrl?: string | null;
  substitutionMinute?: number | null;
};

type BenchPlayerRowProps = {
  player: BenchPlayer;
  align: "left" | "right";
  teamCode?: string | null;
  teamName: string;
};

export function BenchPlayerRow({
  player,
  align,
  teamCode,
  teamName,
}: BenchPlayerRowProps) {
  if (align === "right") {
    return (
      <div className="flex items-center justify-end gap-3 bg-[#0E1D30]/52 px-4 py-3 text-right">
        <PlayerInfo player={player} align="right" />

        <PlayerActionBadges
          goals={player.goals}
          yellow={player.yellow}
          red={player.red}
          substituted={player.substituted}
        />

        <PlayerAvatar
          imageUrl={player.fotoUrl ?? player.avatarUrl ?? null}
          teamCode={teamCode}
          teamName={teamName}
          number={player.numero}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-[#0E1D30]/52 px-4 py-3">
      <PlayerAvatar
        imageUrl={player.fotoUrl ?? player.avatarUrl ?? null}
        teamCode={teamCode}
        teamName={teamName}
        number={player.numero}
      />

      <PlayerActionBadges
        goals={player.goals}
        yellow={player.yellow}
        red={player.red}
        substituted={player.substituted}
      />

      <PlayerInfo player={player} align="left" />
    </div>
  );
}

function PlayerAvatar({
  imageUrl,
  teamCode,
  teamName,
  number,
}: {
  imageUrl?: string | null;
  teamCode?: string | null;
  teamName: string;
  number?: number | null;
}) {
  return (
    <PlayerJerseyAvatar
      imageUrl={imageUrl}
      teamCode={teamCode}
      teamName={teamName}
      number={number}
      size="sm"
    />
  );
}

function PlayerInfo({
  player,
  align,
}: {
  player: BenchPlayer;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 text-sm text-white/62 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <p className="truncate text-sm font-semibold text-white md:text-base">
        {player.nombre}
      </p>

      {player.substituted && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs">
          {player.substitutionMinute ? `${player.substitutionMinute}'` : ""}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/16 text-emerald-200">
            <ArrowUp className="h-3 w-3" />
          </span>
        </span>
      )}

      {!player.substituted && player.posicion && (
        <span className="truncate text-xs">
          {player.posicion}
          {player.numero ? ` Nro${player.numero}` : ""}
        </span>
      )}
    </div>
  );
}
