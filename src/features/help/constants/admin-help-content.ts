import {
  AlertTriangle,
  ClipboardList,
  Medal,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { HelpFaqItem, HelpSection } from "../types/help-content.types";

export const ADMIN_HELP_INTRO = {
  badge: "Ayuda para administradores",
  title: "Guía del panel administrativo del Prode Mundial 2026",
  description:
    "Esta guía resume cómo gestionar usuarios, fixture, resultados y ranking sin tocar la lógica interna del sistema.",
};

export const ADMIN_HELP_SECTIONS: HelpSection[] = [
  {
    title: "Panel de administración",
    description:
      "Desde el panel admin podés revisar usuarios, partidos, resultados, ranking y configuraciones relacionadas al Mundial.",
    icon: ShieldCheck,
    points: [
      "Usá el dashboard para detectar acciones urgentes.",
      "Revisá siempre estados y permisos antes de editar.",
      "Priorizá mantener datos oficiales consistentes.",
    ],
  },
  {
    title: "Gestión de usuarios",
    icon: Users,
    steps: [
      {
        title: "Ver usuarios registrados",
        description:
          "Entrá a la administración de usuarios para revisar quiénes están activos, pendientes o con estado especial.",
      },
      {
        title: "Aprobar usuarios pendientes",
        description:
          "Las altas pendientes deben aprobarse antes de que puedan participar del Prode.",
      },
      {
        title: "Rechazar o bloquear usuarios",
        description:
          "Usá las acciones disponibles cuando un usuario no deba participar o necesite un ajuste administrativo.",
      },
    ],
  },
  {
    title: "Gestión de partidos",
    icon: ClipboardList,
    steps: [
      {
        title: "Revisá el fixture",
        description:
          "Confirmá que cada partido tenga selecciones, fase, fecha y horario correctos.",
      },
      {
        title: "Actualizá estados",
        description:
          "Los partidos deben pasar por los estados correspondientes para que el frontend muestre la situación real.",
      },
      {
        title: "Validá datos antes de publicar",
        description:
          "Chequeá que no falten relaciones, grupos o selecciones antes de cerrar la edición.",
      },
    ],
  },
  {
    title: "Carga de resultados",
    icon: AlertTriangle,
    steps: [
      {
        title: "Cargá el resultado oficial",
        description:
          "Ingresá los goles reales cuando el partido haya finalizado o cuando corresponda corregir un marcador.",
      },
      {
        title: "Revisá antes de guardar",
        description:
          "Un resultado mal cargado impacta directamente en puntos, ranking y vistas de seguimiento.",
      },
      {
        title: "Confirmá el impacto",
        description:
          "Después de guardar, revisá el ranking y la actualización de puntajes para asegurar consistencia.",
      },
    ],
  },
  {
    title: "Ranking y puntos",
    icon: Medal,
    points: [
      "El ranking depende de los resultados oficiales cargados en el sistema.",
      "Cada corrección de resultados puede modificar posiciones y puntajes.",
      "El ranking general se recalcula una vez por día.",
      "Si un ranking o puntaje no se ve actualizado todavía, puede depender del horario de ejecución o de la zona horaria configurada.",
    ],
  },
];

export const ADMIN_RECOMMENDATIONS: string[] = [
  "Revisá los datos del partido antes de pasarlo a finalizado.",
  "No modifiques resultados ya publicados salvo que haga falta una corrección real.",
  "Mantené las reglas del Prode claras y visibles para todos los participantes.",
];

export const ADMIN_HELP_FAQS: HelpFaqItem[] = [
  {
    question: "¿Qué hago si un usuario no puede entrar?",
    answer:
      "Primero revisá si está aprobado, activo y con el rol correcto. Después confirmá que tenga los permisos esperados para la sección que intenta abrir.",
  },
  {
    question: "¿Qué pasa si un partido se cargó con resultado incorrecto?",
    answer:
      "Corregí el resultado oficial desde la gestión correspondiente y verificá luego el impacto en ranking y puntos.",
  },
  {
    question: "¿Cómo se recalculan los puntos?",
    answer:
      "Los puntos se recalculan a partir de los resultados oficiales guardados y el ranking general se actualiza en el proceso diario del sistema. Si hay diferencias temporales, conviene revisar el horario de corte y la zona horaria.",
  },
  {
    question: "¿Qué usuarios pueden participar?",
    answer:
      "Solo los usuarios registrados y habilitados por la administración. Los pendientes, rechazados o bloqueados no deberían participar.",
  },
  {
    question: "¿Cómo se gestionan usuarios pendientes?",
    answer:
      "Desde la administración de usuarios podés revisar el listado pendiente y aprobar o rechazar cada alta según corresponda.",
  },
];
