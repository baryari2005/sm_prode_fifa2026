import { ArrowDown } from "lucide-react";

import type { LineupPlayer } from "@/features/partidos/types/fixture-details";
import { PlayerJerseyAvatar } from "./PlayerJerseyAvatar";
import { PlayerActionBadges } from "./PlayerActionBadges";

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

        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
          <PlayerActionBadges
            goals={player.goals}
            yellow={player.yellow}
            red={player.red}
            substituted={false}
            className="flex-col"
          />
        </div>

        {player.substituted && (
          <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 shadow-sm">
            <ArrowDown className="h-3 w-3" />
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
