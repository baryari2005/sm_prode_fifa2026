type HighlightMode = "higher" | "lower" | "none";

type GetStatActiveParams = {
  value: number;
  opponentValue: number;
  highlight: HighlightMode;
};

export function getStatActive({
  value,
  opponentValue,
  highlight,
}: GetStatActiveParams) {
  if (value === opponentValue) return false;

  if (highlight === "higher") {
    return value > opponentValue;
  }

  if (highlight === "lower") {
    return value < opponentValue;
  }

  return false;
}

export function formatStatValue(value: number, unit?: string) {
  if (!unit) return `${value}`;

  return `${value}${unit}`;
}