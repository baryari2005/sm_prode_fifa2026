export const TEAM_STAT_DEFINITIONS = [
  {
    key: "shots",
    label: "Remates",
    unit: "",
    highlight: "higher",
  },
  {
    key: "shotsOnTarget",
    label: "Remates al arco",
    unit: "",
    highlight: "higher",
  },
  {
    key: "possession",
    label: "Posesión",
    unit: "%",
    highlight: "higher",
  },
  {
    key: "passes",
    label: "Pases",
    unit: "",
    highlight: "higher",
  },
  {
    key: "passAccuracy",
    label: "Precisión de los pases",
    unit: "%",
    highlight: "higher",
  },
  {
    key: "fouls",
    label: "Faltas",
    unit: "",
    highlight: "lower",
  },
  {
    key: "yellowCards",
    label: "Tarjetas amarillas",
    unit: "",
    highlight: "lower",
  },
  {
    key: "redCards",
    label: "Tarjetas rojas",
    unit: "",
    highlight: "lower",
  },
  {
    key: "offsides",
    label: "Posición adelantada",
    unit: "",
    highlight: "lower",
  },
  {
    key: "corners",
    label: "Tiros de esquina",
    unit: "",
    highlight: "higher",
  },
] as const;

export type TeamStatKey = (typeof TEAM_STAT_DEFINITIONS)[number]["key"];

export type TeamStats = Record<TeamStatKey, number>;

export type LineupPlayer = {
  jugadorId: string;
  nombre: string;
  numero: number | null;
  posicion: string;
  x: number | null;
  y: number | null;
  goals: number;
  yellow: boolean;
  red: boolean;
  substituted: boolean;
};

export type TeamLineup = {
  formacion: string;
  entrenador: string;
  titulares: LineupPlayer[];
  suplentes: LineupPlayer[];
};

export type GoalDetail = {
  jugadorId: string;
  nombre: string;
  minuto: number;
  penal: boolean;
};

export const DEFAULT_TEAM_STATS: TeamStats = {
  shots: 0,
  shotsOnTarget: 0,
  possession: 0,
  passes: 0,
  passAccuracy: 0,
  fouls: 0,
  yellowCards: 0,
  redCards: 0,
  offsides: 0,
  corners: 0,
};

export const DEFAULT_TEAM_LINEUP: TeamLineup = {
  formacion: "",
  entrenador: "",
  titulares: [],
  suplentes: [],
};