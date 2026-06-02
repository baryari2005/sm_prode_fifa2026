import { CheckCircle2, Lock, Medal } from "lucide-react";

import { PREDICTION_CLOSE_MINUTES_BEFORE } from "@/features/partidos/utils/partidos-ui.helpers";
import type { HelpScoreRuleSummary } from "../lib/help-score-rules";
import type { HelpSection, RulesEditableContent } from "../types/help-content.types";

export const RULES_PAGE_INTRO = {
  badge: "Reglas y condiciones",
  title: "Bases informativas del Prode Mundial 2026",
  description:
    "Estas reglas explican quién puede participar, cómo se cargan los pronósticos, cómo se suman los puntos y qué condiciones generales se aplican para premios y desempates.",
};

export const RULES_EDITABLE_CONTENT: RulesEditableContent = {
  premios: {
    InstanciasDePremiacion: "Habrá dos entregas de premios: una al finalizar la fase de grupos y otra al terminar la fase de eliminación directa.",
    FaseDeGrupos: "Premio : 1 Camiseta de la Selección para los 5 primeros puestos.",
    FaseDeEliminatorias: "Premio :  1 Camiseta de la Selección para los 5 primeros puestos.",
  },
  participantesHabilitados: [
    "Usuarios registrados dentro del sistema.",
    "Usuarios aprobados por la administración.",
    "Usuarios con estado activo al momento de participar.",
    "Usuarios que residan en San Miguel.",
  ],
  participantesExcluidos: [
    "Usuarios no aprobados.",
    "Usuarios rechazados.",
    "Usuarios bloqueados o suspendidos.",
    "Usuarios que no residan en San Miguel.",
    "Usuarios que participen fuera de las reglas definidas por la organización.",
    "Cuentas duplicadas si la organización decide excluirlas.",
    "Administradores u organizadores, si la organización así lo define.",
  ],
  criteriosDesempate: [
    "Mayor cantidad de resultados exactos.",
    "Mayor cantidad de tendencias acertadas.",
    "Cualquier otro criterio informado previamente por la organización.",
  ],
  condicionesPremio: [
    "El usuario debe estar registrado y aprobado.",
    "El usuario debe residir en San Miguel.",
    "El usuario debe mantener estado activo.",
    "El usuario debe cumplir las reglas del Prode.",
  ],
};

export function buildRulesSections(
  scoreRule: HelpScoreRuleSummary
): HelpSection[] {
  const notaReglasPorFase = scoreRule.usaMultiplesReglas
    ? `Los puntos pueden variar según la fase. En esta pantalla se muestran los valores de ${scoreRule.faseNombre ?? "la fase actual de referencia"}.`
    : `Los puntos visibles corresponden a ${scoreRule.faseNombre ?? "la configuración activa actual"}.`;

  return [
    {
      title: "Participación",
      description:
        "Podrán participar del Prode Mundial 2026 solo los usuarios que residan en San Miguel, estén registrados y hayan sido aprobados por la administración del sistema. En caso de ganar deberán presentar el DNI con dirección en San Miguel.",
      icon: CheckCircle2,
    },
    {
      title: "Usuarios habilitados",
      description:
        "Solo los usuarios con estado activo y residencia en San Miguel pueden participar y cargar pronósticos dentro del sistema.",
      icon: CheckCircle2,
      points: RULES_EDITABLE_CONTENT.participantesHabilitados,
    },
    {
      title: "Usuarios no habilitados",
      description:
        "Los usuarios pendientes, rechazados, bloqueados, sin aprobación administrativa o que no residan en San Miguel no podrán participar ni acceder a premios.",
      icon: Lock,
      points: RULES_EDITABLE_CONTENT.participantesExcluidos,
    },
    {
      title: "Carga de pronósticos",
      description: `Cada usuario puede cargar un pronóstico por partido y modificarlo mientras el encuentro siga abierto. El cierre ocurre ${PREDICTION_CLOSE_MINUTES_BEFORE} minutos antes del inicio del partido.`,
      icon: Medal,
      points: [
        "Una vez cerrado el partido para pronosticar, ya no puede editarse.",
        "El backend siempre valida el cierre real del partido.",
        "Si cambia el horario del partido, el cierre se recalcula automáticamente.",
      ],
      note: notaReglasPorFase,
    },
  ];
}
