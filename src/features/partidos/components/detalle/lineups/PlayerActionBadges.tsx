import { ArrowDownUp, CircleDot } from "lucide-react";

type PlayerActionBadgesProps = {
  goals?: number;
  yellow?: boolean;
  red?: boolean;
  substituted?: boolean;
  className?: string;
};

export function PlayerActionBadges({
  goals = 0,
  yellow = false,
  red = false,
  substituted = false,
  className = "",
}: PlayerActionBadgesProps) {
  const hasActions = goals > 0 || yellow || red || substituted;

  if (!hasActions) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`.trim()}>
      {goals > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
          <CircleDot className="h-3 w-3" />
          {goals > 1 ? goals : ""}
        </span>
      ) : null}

      {yellow ? (
        <span
          className="inline-block h-4 w-3 rounded-[3px] bg-yellow-400 shadow-sm"
          title="Tarjeta amarilla"
        />
      ) : null}

      {red ? (
        <span
          className="inline-block h-4 w-3 rounded-[3px] bg-red-500 shadow-sm"
          title="Tarjeta roja"
        />
      ) : null}

      {substituted ? (
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          title="Ingreso o cambio"
        >
          <ArrowDownUp className="h-3 w-3" />
        </span>
      ) : null}
    </div>
  );
}
