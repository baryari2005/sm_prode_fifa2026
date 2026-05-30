import { ArrowDownUp, Bandage, CircleDot } from "lucide-react";

type PlayerActionBadgesProps = {
  goals?: number;
  yellow?: boolean;
  red?: boolean;
  substituted?: boolean;
  injured?: boolean;
  className?: string;
};

export function PlayerActionBadges({
  goals = 0,
  yellow = false,
  red = false,
  substituted = false,
  injured = false,
  className = "",
}: PlayerActionBadgesProps) {
  const hasActions = goals > 0 || yellow || red || substituted || injured;

  if (!hasActions) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`.trim()}>
      {goals > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#5993B6]/18 bg-[#5993B6]/14 px-2 py-0.5 text-[11px] font-semibold text-[#AEEBFF]">
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
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/16 text-emerald-200"
          title="Ingreso o cambio"
        >
          <ArrowDownUp className="h-3 w-3" />
        </span>
      ) : null}

      {injured ? (
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-400/16 text-orange-200"
          title="Lesion"
        >
          <Bandage className="h-3 w-3" />
        </span>
      ) : null}
    </div>
  );
}
