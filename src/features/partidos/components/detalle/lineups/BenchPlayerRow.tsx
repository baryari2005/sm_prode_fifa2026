import { ArrowUp, CircleDot } from "lucide-react";

import type { LineupPlayer } from "@/features/partidos/types/fixture-details";
import { PlayerJerseyAvatar } from "./PlayerJerseyAvatar";

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
      <div className="flex items-center justify-end gap-3 px-4 py-2 text-right">
        <PlayerInfo player={player} align="right" />

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
    <div className="flex items-center gap-3 px-4 py-2">
      <PlayerAvatar
        imageUrl={player.fotoUrl ?? player.avatarUrl ?? null}
        teamCode={teamCode}
        teamName={teamName}
        number={player.numero}
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
      className={`flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-600 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <p className="truncate text-sm font-semibold text-slate-950 md:text-base">
        {player.nombre}
      </p>

      {player.substituted && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs">
          {player.substitutionMinute ? `${player.substitutionMinute}'` : ""}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <ArrowUp className="h-3 w-3" />
          </span>
        </span>
      )}

      {player.goals > 0 && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs">
          <CircleDot className="h-3.5 w-3.5 text-slate-900" />
          {player.goals > 1 ? `x${player.goals}` : ""}
        </span>
      )}

      {player.yellow && (
        <span className="inline-block h-3.5 w-2.5 shrink-0 rounded-[2px] bg-yellow-400" />
      )}

      {player.red && (
        <span className="inline-block h-3.5 w-2.5 shrink-0 rounded-[2px] bg-red-500" />
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
