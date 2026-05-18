import type { PhaseFilterValue } from "@/features/pronosticos/types/pronostico-rapido.types";

export const PHASE_FILTERS: Array<{
  label: string;
  value: PhaseFilterValue;
}> = [
  {
    label: "Todos",
    value: null,
  },
  {
    label: "Fase de Grupos",
    value: "grupos",
  },
  {
    label: "Dieciseisavos de Final",
    value: "dieciseisavos",
  },
  {
    label: "Octavos de Final",
    value: "octavos",
  },
  {
    label: "Cuartos de Final",
    value: "cuartos",
  },
  {
    label: "Semisfinales",
    value: "semis",
  },
  {
    label: "3° y 4° puesto",
    value: "tercer-puesto",
  },
  {
    label: "Final",
    value: "final",
  },
];
