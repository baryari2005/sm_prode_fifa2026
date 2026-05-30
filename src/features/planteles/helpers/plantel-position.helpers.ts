import { POSITION_OPTIONS } from "../types/constants";

export type PlantelPositionGroupKey =
  | "arqueros"
  | "defensores"
  | "mediocampo"
  | "delanteros"
  | "otros";

export type PlantelPositionGroup = {
  key: PlantelPositionGroupKey;
  label: string;
  codes: string[];
};

export const POSITION_LABELS = Object.fromEntries(
  POSITION_OPTIONS.map((option) => [option.value, option.label.replace(/^[A-Z]+\s-\s/, "")]),
) as Record<string, string>;

export const POSITION_GROUPS: PlantelPositionGroup[] = [
  { key: "arqueros", label: "Arqueros", codes: ["A"] },
  { key: "defensores", label: "Defensores", codes: ["D", "LI", "LD", "DC"] },
  { key: "mediocampo", label: "Mediocampo", codes: ["M", "MO", "MC", "MD"] },
  { key: "delanteros", label: "Delanteros", codes: ["ED", "EI", "FC", "F"] },
  { key: "otros", label: "Otros", codes: [] },
];

export function getPlantelGroupForPosition(
  position?: string | null,
): PlantelPositionGroupKey {
  const normalizedPosition = position?.trim().toUpperCase();

  if (!normalizedPosition) {
    return "otros";
  }

  const match = POSITION_GROUPS.find((group) =>
    group.codes.includes(normalizedPosition),
  );

  return match?.key ?? "otros";
}

export function getPlantelPositionLabel(position?: string | null) {
  if (!position) {
    return "Sin definir";
  }

  return POSITION_LABELS[position.trim().toUpperCase()] ?? position;
}
