import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Goal,
  ShieldAlert,
  Siren,
  Square,
  Video,
} from "lucide-react";

export type IncidentTypeKey =
  | "gol"
  | "tarjeta"
  | "cambio"
  | "lesion"
  | "penal"
  | "var";

export type IncidentTypeOption = {
  key: IncidentTypeKey;
  label: string;
  icon: LucideIcon;
  toneClassName: string;
};

export type IncidentTimelineEntry = {
  minute: string;
  type: IncidentTypeKey;
  team: string;
  player: string;
  description: string;
};

export const incidentTypeOptions: IncidentTypeOption[] = [
  { key: "gol", label: "Gol", icon: Goal, toneClassName: "text-[#84F0C8]" },
  { key: "tarjeta", label: "Tarjeta", icon: Square, toneClassName: "text-[#FFE4A3]" },
  { key: "cambio", label: "Cambio", icon: ArrowRightLeft, toneClassName: "text-[#AEEBFF]" },
  { key: "lesion", label: "Lesion", icon: ShieldAlert, toneClassName: "text-rose-300" },
  { key: "penal", label: "Penal", icon: Siren, toneClassName: "text-[#FAB438]" },
  { key: "var", label: "VAR", icon: Video, toneClassName: "text-[#C7D8FF]" },
];

export const incidentFormMock = {
  gol: {
    equipo: "Mexico",
    jugador: "Santiago Gimenez",
    asistidor: "Orbelin Pineda",
    minuto: "12",
    descripcion: "Definicion cruzada dentro del area",
  },
  tarjeta: {
    equipo: "Sudafrica",
    jugador: "Percy Tau",
    tipo: "Amarilla",
    minuto: "34",
    descripcion: "Falta tactica en mitad de cancha",
  },
  cambio: {
    equipo: "Mexico",
    sale: "Raul Jimenez",
    entra: "Santiago Gimenez",
    minuto: "61",
    descripcion: "Cambio ofensivo para sostener la presion",
  },
  lesion: {
    equipo: "Sudafrica",
    jugador: "Teboho Mokoena",
    minuto: "71",
    descripcion: "Molestia muscular y asistencia medica",
  },
  penal: {
    equipo: "Mexico",
    jugador: "Santiago Gimenez",
    minuto: "76",
    descripcion: "Penal convertido tras revision",
  },
  var: {
    equipo: "General",
    minuto: "78",
    descripcion: "Gol confirmado luego de revision VAR",
  },
};

export const incidentTimelineMock: IncidentTimelineEntry[] = [
  {
    minute: "12'",
    type: "gol",
    team: "Mexico",
    player: "Santiago Gimenez",
    description: "Asistencia de Orbelin y definicion al segundo palo.",
  },
  {
    minute: "34'",
    type: "tarjeta",
    team: "Sudafrica",
    player: "Percy Tau",
    description: "Amarilla por cortar avance en mitad de cancha.",
  },
  {
    minute: "61'",
    type: "cambio",
    team: "Mexico",
    player: "Sale Raul / Entra Santiago",
    description: "Cambio ofensivo para atacar los ultimos 30 minutos.",
  },
  {
    minute: "71'",
    type: "lesion",
    team: "Sudafrica",
    player: "Teboho Mokoena",
    description: "Lesion muscular con ingreso del cuerpo medico.",
  },
  {
    minute: "78'",
    type: "var",
    team: "General",
    player: "Gol confirmado",
    description: "Revision finalizada, se mantiene el 2-1.",
  },
];
