import { ArrowDown } from "lucide-react";

import type { LineupPlayer } from "@/features/partidos/types/fixture-details";
import { PlayerJerseyAvatar } from "./PlayerJerseyAvatar";
import { PlayerActionBadges } from "./PlayerActionBadges";

type PositionedPlayer = LineupPlayer & {
  fotoUrl?: string | null;
  avatarUrl?: string | null;
  substitutionMinute?: number | null;
  injuryMinute?: number | null;
  injured?: boolean;
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
  const playerNumber = player.numero ? String(player.numero) : null;

  return (
    <div
      className="group absolute z-20 flex w-[92px] -translate-x-1/2 -translate-y-1/2 flex-col items-center md:w-[112px]"
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow debajo del jugador */}
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-12 w-14 -translate-x-1/2 rounded-full bg-black/25 blur-md transition-all duration-200 group-hover:h-14 group-hover:w-16 group-hover:bg-black/35" />

        {/* Halo claro */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-lg opacity-70 transition-all duration-200 group-hover:opacity-100 md:h-[62px] md:w-[62px]" />

        <div className="relative transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105">
          <PlayerJerseyAvatar
            imageUrl={player.fotoUrl ?? player.avatarUrl ?? null}
            teamCode={teamCode}
            teamName={teamName}
            number={player.numero}
            size="md"
            className="shadow-[0_12px_22px_rgba(15,23,42,0.34)] ring-2 ring-white/80"
          />

          {/* Acciones: goles, tarjetas, etc. */}
          <div className="absolute -right-4 top-1/2 z-20 -translate-y-1/2">
            <PlayerActionBadges
              goals={player.goals}
              yellow={player.yellow}
              red={player.red}
              substituted={player.substituted}
              injured={player.injured}
              className="flex-col drop-shadow-[0_6px_10px_rgba(15,23,42,0.3)]"
            />
          </div>

          {/* Jugador sustituido */}
          {player.substituted ? (
            <span className="absolute -left-2 -top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-rose-500 text-white shadow-[0_6px_14px_rgba(190,18,60,0.4)]">
              <ArrowDown className="h-3 w-3" />
            </span>
          ) : null}

          {/* Minuto de sustitución si existe */}
          {player.substitutionMinute ? (
            <span className="absolute -bottom-1 -right-2 z-20 rounded-full border border-white/60 bg-slate-950/75 px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-sm backdrop-blur-sm">
              {player.substitutionMinute}&apos;
            </span>
          ) : null}

          {player.injuryMinute ? (
            <span className="absolute -bottom-1 -left-2 z-20 rounded-full border border-white/60 bg-orange-500/85 px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-sm backdrop-blur-sm">
              {player.injuryMinute}&apos;
            </span>
          ) : null}
        </div>

        {/* Nombre del jugador */}
        <div className="relative mt-1.5 max-w-full rounded-full border border-white/25 bg-slate-950/55 px-2.5 py-1 text-center shadow-[0_8px_18px_rgba(15,23,42,0.25)] backdrop-blur-md transition-all duration-200 group-hover:bg-slate-950/70">
          <p className="max-w-[82px] overflow-hidden text-[10px] font-black leading-none text-white md:max-w-[102px] md:text-[11px]">
            <span className="block truncate">
              {playerNumber ? (
                <span className="mr-1 text-[#AEEBFF]">{playerNumber}</span>
              ) : null}
              {player.nombre}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
