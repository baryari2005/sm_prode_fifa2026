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
        className={`text-base font-semibold text-white/74 ${
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
      <div className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[#5993B6]/18 bg-[#5993B6]/14 px-3 text-base font-black text-[#AEEBFF] shadow-[0_10px_22px_rgba(89,147,182,0.18)]">
        {formatStatValue(value, unit)}
      </div>
    </div>
  );
}
