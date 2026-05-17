import { getStatActive } from "@/features/partidos/helpers/partido-stats.helpers";
import { TeamStatBadge } from "./TeamStatBadge";

type PartidoStatRowProps = {
  label: string;
  localValue: number;
  visitanteValue: number;
  unit?: string;
  highlight: "higher" | "lower" | "none";
};

export function PartidoStatRow({
  label,
  localValue,
  visitanteValue,
  unit,
  highlight,
}: PartidoStatRowProps) {
  const localActive = getStatActive({
    value: localValue,
    opponentValue: visitanteValue,
    highlight,
  });

  const visitanteActive = getStatActive({
    value: visitanteValue,
    opponentValue: localValue,
    highlight,
  });

  return (
    <div className="grid grid-cols-[72px_1fr_72px] items-center gap-3  px-4 py-2 shadow-sm shadow-slate-200/30 transition hover:border-slate-300 md:grid-cols-[96px_1fr_96px]">
      <TeamStatBadge
        value={localValue}
        unit={unit}
        active={localActive}
        side="local"
      />

      <div className="text-center text-base font-medium text-slate-950 md:text-lg">
        {label}
      </div>

      <TeamStatBadge
        value={visitanteValue}
        unit={unit}
        active={visitanteActive}
        side="visitante"
      />
    </div>
  );
}
