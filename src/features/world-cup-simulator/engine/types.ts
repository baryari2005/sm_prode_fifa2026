export type SimulatorTeam = {
  id: string;
  nombre: string;
  codigo?: string | null;
  banderaUrl?: string | null;
  grupo: string;
  rankingFifa?: number | null;
  fairPlayScore?: number | null;
};

export type SimulatorMatch = {
  id: string;
  grupo: string;
  fecha?: string | Date | null;
  local: SimulatorTeam;
  visitante: SimulatorTeam;
  golesLocal: number | null;
  golesVisitante: number | null;
};

export type SimulatorGroup = {
  grupo: string;
  equipos: SimulatorTeam[];
  partidos: SimulatorMatch[];
};

export type TeamStanding = {
  seleccionId: string;
  nombre: string;
  codigo?: string | null;
  banderaUrl?: string | null;
  grupo: string;
  puntos: number;
  partidosJugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesFavor: number;
  golesContra: number;
  diferenciaGol: number;
  posicionGrupo?: number;
  rankingFifa?: number | null;
  fairPlayScore?: number | null;
};

export type QualifiedTeams = {
  primeros: TeamStanding[];
  segundos: TeamStanding[];
  terceros: TeamStanding[];
  mejoresTerceros: TeamStanding[];
  eliminados: TeamStanding[];
};

export type KnockoutSlot = {
  slot: string;
  team: TeamStanding | null;
};

export type KnockoutRound =
  | "ROUND_OF_32"
  | "ROUND_OF_16"
  | "QUARTER_FINAL"
  | "SEMI_FINAL"
  | "THIRD_PLACE"
  | "FINAL";

export type KnockoutMatch = {
  id: string;
  ronda: KnockoutRound;
  orden: number;
  local: KnockoutSlot;
  visitante: KnockoutSlot;
  golesLocal?: number | null;
  golesVisitante?: number | null;
  penaltyWinner?: "local" | "visitante" | null;
  ganador?: TeamStanding | null;
};

export type KnockoutRounds = {
  roundOf32: KnockoutMatch[];
  roundOf16: KnockoutMatch[];
  quarterFinals: KnockoutMatch[];
  semiFinals: KnockoutMatch[];
  final: KnockoutMatch[];
  thirdPlace: KnockoutMatch[];
};
