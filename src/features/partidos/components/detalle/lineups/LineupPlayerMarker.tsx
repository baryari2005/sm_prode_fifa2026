import { ArrowDown, CircleDot } from "lucide-react";

import type { LineupPlayer } from "@/features/partidos/types/fixture-details";
import { PlayerJerseyAvatar } from "./PlayerJerseyAvatar";

type PositionedPlayer = LineupPlayer & {
  fotoUrl?: string | null;
  avatarUrl?: string | null;
  substitutionMinute?: number | null;
  assist?: boolean;
  x: number;
  y: number;
};

type LineupPlayerMarkerProps = {
  player: PositionedPlayer;
  teamCode?: string | null;
  teamName: string;
};

export function LineupPlayerMarker({
  player,
  teamCode,
  teamName,
}: LineupPlayerMarkerProps) {
  return (
    <div
      className="absolute z-10 flex w-[86px] -translate-x-1/2 -translate-y-1/2 flex-col items-center md:w-[104px]"
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
    >
      <div className="relative">
        <PlayerJerseyAvatar
          imageUrl={player.fotoUrl ?? player.avatarUrl ?? null}
          teamCode={teamCode}
          teamName={teamName}
          number={player.numero}
          size="md"
          className="shadow-sm ring-2 ring-white/60"
        />

        <div className="absolute -right-1 -top-1 flex flex-col gap-0.5">
          {player.yellow && (
            <span className="h-3.5 w-2.5 rounded-[2px] bg-yellow-400 shadow-sm" />
          )}

          {player.red && (
            <span className="h-3.5 w-2.5 rounded-[2px] bg-red-500 shadow-sm" />
          )}
        </div>

        {player.substituted && (
          <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-sm">
            <ArrowDown className="h-3 w-3" />
          </span>
        )}

        {player.goals > 0 && (
          <span className="absolute -bottom-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-slate-950 shadow-sm">
            <CircleDot className="h-3 w-3" />
            {player.goals > 1 ? player.goals : ""}
          </span>
        )}
      </div>

      <p className="mt-1 max-w-full overflow-hidden text-center text-[10px] font-bold leading-tight text-slate-950 md:text-[11px]">
        <span className="block truncate">
          {player.numero ? `${player.numero} ` : ""}
          {player.nombre}
        </span>
      </p>
    </div>
  );
}
