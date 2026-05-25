import {
  CalendarClock,
  CircleHelp,
  ClipboardList,
  Eye,
  ListOrdered,
  RadioTower,
  Target,
} from "lucide-react";

import { PREDICTION_CLOSE_MINUTES_BEFORE } from "@/features/partidos/utils/partidos-ui.helpers";
import type { HelpScoreRuleSummary } from "../lib/help-score-rules";
import type { HelpFaqItem, HelpSection } from "../types/help-content.types";

export const USER_HELP_INTRO = {
  badge: "Ayuda para usuarios",
  title: "Todo lo que necesitás para jugar el Prode Mundial 2026",
  description:
    "Esta guía explica cómo cargar pronósticos, hasta cuándo podés editarlos, cómo se suman los puntos y dónde seguir tu avance dentro del sistema.",
};

export function buildUserHelpSections(
  scoreRule: HelpScoreRuleSummary
): HelpSection[] {
  const notaReglasPorFase = scoreRule.usaMultiplesReglas
    ? `Los puntos pueden variar según la fase. En este momento se muestran los valores de ${scoreRule.faseNombre ?? "la fase actual de referencia"}.`
    : `Los puntos visibles corresponden a ${scoreRule.faseNombre ?? "la configuración activa actual"}.`;

  return [
    {
      title: "¿Qué es el Prode Mundial 2026?",
      description:
        "El Prode Mundial 2026 te permite participar pronosticando resultados de los partidos del Mundial y competir con otros usuarios según los puntos acumulados.",
      icon: CircleHelp,
      points: [
        "Cada partido habilitado acepta un pronóstico por usuario.",
        "El objetivo es sumar puntos acertando resultados y tendencias.",
        "El ranking general muestra cómo va cada participante.",
      ],
    },
    {
      title: "¿Cómo cargar un pronóstico?",
      icon: ClipboardList,
      steps: [
        {
          title: "Entrá a la sección de pronósticos",
          description:
            "Podés hacerlo desde Mis pronósticos o desde cualquier acceso directo disponible en el dashboard.",
        },
        {
          title: "Buscá el partido habilitado",
          description:
            "Filtrá por fase o revisá el partido puntual que todavía esté abierto a pronosticar.",
        },
        {
          title: "Ingresá el resultado local y visitante",
          description:
            "Cargá los goles estimados para cada selección y revisá que el marcador sea el correcto.",
        },
        {
          title: "Guardá el pronóstico",
          description:
            "Una vez guardado, el sistema lo deja asociado a tu usuario y podés volver a editarlo mientras siga abierto.",
        },
      ],
    },
    {
      title: "¿Hasta cuándo puedo cargar o editar un pronóstico?",
      description: `Los pronósticos se cierran ${PREDICTION_CLOSE_MINUTES_BEFORE} minutos antes del inicio del partido. Mientras el partido siga abierto, podés actualizar tu resultado las veces que necesites.`,
      icon: CalendarClock,
      note:
        "Cuando un partido llega al horario de cierre, el backend deja de aceptar cambios aunque todavía tengas la pantalla abierta.",
    },
    {
      title: "¿Cómo se calculan los puntos?",
      description:
        "Los puntos se asignan automáticamente cuando la administración carga el resultado oficial del partido.",
      icon: Target,
      points: [
        `Resultado exacto: ${scoreRule.puntosExacto} puntos.`,
        `Tendencia correcta, ganador o empate: ${scoreRule.puntosParcial} punto${scoreRule.puntosParcial === 1 ? "" : "s"}.`,
        `Pronóstico incorrecto: ${scoreRule.puntosSinAcierto} puntos.`,
      ],
      note: notaReglasPorFase,
    },
    {
      title: "¿Dónde veo mis pronósticos y el ranking?",
      icon: ListOrdered,
      points: [
        "Mis pronósticos muestra los partidos que ya cargaste y los que siguen pendientes.",
        "Mi ranking refleja tu posición comparada con el resto de los participantes.",
        "El ranking general se recalcula una vez por día.",
        "Si el ranking o los puntos no se actualizaron todavía, puede deberse al horario de ejecución o a la zona horaria del sistema.",
      ],
    },
    {
      title: "Estados de los partidos",
      icon: RadioTower,
      points: [
        "Abierto a pronosticar: todavía podés cargar o editar tu marcador.",
        "Predicción cerrada: el tiempo de carga ya venció.",
        "Partido en vivo: el encuentro está en juego y ya no acepta cambios.",
        "Partido finalizado: el resultado oficial quedó cerrado y suma puntos.",
      ],
    },
    {
      title: "¿Dónde veo el detalle del partido?",
      description:
        "En las cards de partidos en juego, próximos partidos y fixture podés abrir el encuentro para seguirlo o cargar la predicción cuando esté disponible.",
      icon: Eye,
    },
  ];
}

export const USER_HELP_FAQS: HelpFaqItem[] = [
  {
    question: "¿Puedo cambiar mi pronóstico?",
    answer: `Sí. Podés editarlo mientras el partido siga abierto y no haya llegado al cierre de ${PREDICTION_CLOSE_MINUTES_BEFORE} minutos previos al inicio.`,
  },
  {
    question: "¿Qué pasa si no cargo un pronóstico?",
    answer:
      "Ese partido no suma puntos para tu usuario, porque el sistema necesita un marcador guardado para evaluar el resultado.",
  },
  {
    question: "¿Cuándo se actualizan los puntos?",
    answer:
      "Los puntos dependen del resultado oficial cargado y del proceso diario de actualización del ranking. Si hay una demora, puede estar relacionada con el horario o la zona horaria usada por el sistema.",
  },
  {
    question: "¿Qué pasa si un partido cambia de horario?",
    answer:
      "El cierre de pronóstico se ajusta según la nueva fecha oficial cargada en el sistema. Siempre conviene revisar el fixture actualizado.",
  },
  {
    question: "¿Puedo ver los pronósticos de otros usuarios?",
    answer:
      "Depende de la visibilidad que tenga habilitada la organización. Si no existe una pantalla específica, el sistema prioriza mostrar tu desempeño y el ranking.",
  },
];
