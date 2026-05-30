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
    <div className="grid grid-cols-[72px_1fr_72px] items-center gap-3 rounded-[20px] border border-white/8 bg-[#0E1D30]/72 px-4 py-3 transition hover:border-[#5993B6]/24 md:grid-cols-[96px_1fr_96px]">
      <TeamStatBadge
        value={localValue}
        unit={unit}
        active={localActive}
        side="local"
      />

      <div className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-white/74 md:text-[0.95rem]">
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
