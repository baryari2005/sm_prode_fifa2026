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

const POSITION_CODE_ALIASES: Record<string, string> = {
  A: "A",
  GK: "A",
  GOALKEEPER: "A",
  ARQUERO: "A",
  PORTERO: "A",
  GUARDAMETA: "A",

  D: "D",
  DF: "D",
  DEFENDER: "D",
  DEFENCE: "D",
  DEFENSA: "D",

  LI: "LI",
  "LEFT BACK": "LI",
  LEFTBACK: "LI",
  "LATERAL IZQUIERDO": "LI",

  LD: "LD",
  "RIGHT BACK": "LD",
  RIGHTBACK: "LD",
  "LATERAL DERECHO": "LD",

  DC: "DC",
  "CENTRE BACK": "DC",
  CENTREBACK: "DC",
  "CENTER BACK": "DC",
  CENTERBACK: "DC",
  "DEFENSA CENTRAL": "DC",
  CENTRAL: "DC",

  M: "M",
  MF: "M",
  MIDFIELDER: "M",
  MIDFIELD: "M",
  MEDIOCAMPISTA: "M",
  CENTROCAMPISTA: "M",
  VOLANTE: "M",

  MO: "MO",
  "ATTACKING MIDFIELD": "MO",
  "MEDIOCAMPISTA OFENSIVO": "MO",
  "CENTROCAMPISTA OFENSIVO": "MO",
  ENGANCHE: "MO",

  MC: "MC",
  "CENTRAL MIDFIELD": "MC",
  "MEDIOCAMPISTA CENTRAL": "MC",
  "CENTROCAMPISTA CENTRAL": "MC",

  MD: "MD",
  "DEFENSIVE MIDFIELD": "MD",
  "MEDIOCAMPISTA DEFENSIVO": "MD",
  "CENTROCAMPISTA DEFENSIVO": "MD",
  "VOLANTE DEFENSIVO": "MD",

  ED: "ED",
  "RIGHT WINGER": "ED",
  EXTREMO: "ED",
  "EXTREMO DERECHO": "ED",

  EI: "EI",
  "LEFT WINGER": "EI",
  "EXTREMO IZQUIERDO": "EI",

  FC: "FC",
  "CENTRE FORWARD": "FC",
  CENTREFORWARD: "FC",
  "CENTER FORWARD": "FC",
  CENTERFORWARD: "FC",
  "CENTRODELANTERO": "FC",
  "DELANTERO CENTRO": "FC",
  "DELANTERO CENTRAL": "FC",

  F: "F",
  FW: "F",
  FORWARD: "F",
  DELANTERO: "F",
  ATACANTE: "F",
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

export function normalizePlantelPositionCode(position?: string | null) {
  const normalizedPosition = normalizePositionAlias(position);

  if (!normalizedPosition) {
    return "M";
  }

  return POSITION_CODE_ALIASES[normalizedPosition] ?? normalizedPosition;
}

export function getPlantelGroupForPosition(
  position?: string | null,
): PlantelPositionGroupKey {
  const normalizedPosition = normalizePlantelPositionCode(position);

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

  const normalizedPosition = normalizePlantelPositionCode(position);

  return POSITION_LABELS[normalizedPosition] ?? position;
}

function normalizePositionAlias(position?: string | null) {
  return position
    ?.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .toUpperCase();
}
