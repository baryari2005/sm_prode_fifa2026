import { formatStatValue } from "@/features/partidos/helpers/partido-stats.helpers";

type TeamStatBadgeProps = {
  value: number;
  unit?: string;
  active: boolean;
  side: "local" | "visitante";
};

export function TeamStatBadge({
  value,
  unit,
  active,
  side,
}: TeamStatBadgeProps) {
  if (!active) {
    return (
      <div
        className={`text-base font-medium text-slate-950 ${
          side === "local" ? "text-left" : "text-right"
        }`}
      >
        {formatStatValue(value, unit)}
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        side === "local" ? "justify-start" : "justify-end"
      }`}
    >
      <div className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-[#008C93] px-3 text-base font-bold text-white shadow-sm shadow-[#008C93]/25">
        {formatStatValue(value, unit)}
      </div>
    </div>
  );
}
