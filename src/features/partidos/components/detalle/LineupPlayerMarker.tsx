type LineupPositionPlayer = {
  jugadorId: string;
  nombre: string;
  numero?: number | null;
  x: number;
  y: number;
  goals: number;
  yellow: boolean;
  red: boolean;
  substituted: boolean;
};

type LineupPlayerMarkerProps = {
  player: LineupPositionPlayer;
};

export function LineupPlayerMarker({ player }: LineupPlayerMarkerProps) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#0B66C3] text-lg font-bold shadow-lg">
        {player.numero ?? "-"}
      </div>

      <p className="mt-2 whitespace-nowrap text-sm font-semibold">
        {player.nombre}
      </p>

      <div className="mt-1 flex items-center justify-center gap-1 text-xs">
        {player.goals > 0 && <span>{`⚽ ${player.goals}`}</span>}
        {player.yellow && <span>🟨</span>}
        {player.red && <span>🟥</span>}
        {player.substituted && <span>↕</span>}
      </div>
    </div>
  );
}