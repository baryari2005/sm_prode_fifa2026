export type DashboardPreviewVariant = "admin" | "user";

export type PreviewKpi = {
  label: string;
  value: string;
  detail: string;
  tone: "navy" | "sky" | "gold" | "mint";
};

export type PreviewAction = {
  title: string;
  description: string;
  badge?: string;
};

export type PreviewMatch = {
  id: string;
  local: string;
  visitante: string;
  fase: string;
  dateLabel: string;
  status: string;
  tone: "gold" | "sky" | "mint";
};

export type PreviewRankingRow = {
  position: string;
  name: string;
  points: string;
  detail: string;
  highlighted?: boolean;
};

export type PreviewQuickLink = {
  label: string;
  caption: string;
};

export type PreviewDashboardContent = {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  statusTitle: string;
  statusBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroStats: PreviewKpi[];
  kpis: PreviewKpi[];
  importantActions: PreviewAction[];
  primaryPanelTitle: string;
  primaryPanelDescription: string;
  primaryMatches: PreviewMatch[];
  secondaryPanelTitle: string;
  secondaryPanelDescription: string;
  ranking: PreviewRankingRow[];
  quickLinks: PreviewQuickLink[];
  notes: string[];
};

export const dashboardPreviewContent: Record<
  DashboardPreviewVariant,
  PreviewDashboardContent
> = {
  admin: {
    label: "Mock Admin",
    title: "Tenes el torneo bajo control",
    subtitle: "Panel de control del torneo",
    description:
      "Gestiona usuarios, partidos, resultados y el avance del Prode con una vista compacta, operativa y con identidad Mas San Miguel.",
    badge: "Vista operativa",
    statusTitle: "Estado del sistema",
    statusBody:
      "Usuarios pendientes, partidos en juego y accesos administrativos priorizados en una grilla corta y accionable.",
    ctaPrimary: "Cargar resultados",
    ctaSecondary: "Gestionar fixture",
    heroStats: [
      { label: "En juego", value: "4", detail: "partidos activos", tone: "mint" },
      { label: "Pendientes", value: "7", detail: "usuarios a revisar", tone: "gold" },
      { label: "Auto refresh", value: "30s", detail: "estado live", tone: "sky" },
    ],
    kpis: [
      { label: "Pronosticos cargados", value: "548", detail: "sobre 672 posibles", tone: "mint" },
      { label: "Participantes activos", value: "186", detail: "usuarios con actividad", tone: "sky" },
      { label: "Partidos en juego", value: "4", detail: "con seguimiento ahora", tone: "navy" },
      { label: "Sistema", value: "OK", detail: "sin alertas criticas", tone: "gold" },
    ],
    importantActions: [
      {
        title: "Aprobar usuarios pendientes",
        description: "Revisa altas nuevas y habilita acceso al torneo.",
        badge: "7 pendientes",
      },
      {
        title: "Cargar resultado oficial",
        description: "Impacta marcadores reales sin salir del flujo operativo.",
      },
      {
        title: "Gestionar fixture",
        description: "Controla horarios, fases y estados del calendario.",
      },
    ],
    primaryPanelTitle: "Partidos en juego y proximos cierres",
    primaryPanelDescription:
      "Bloque central para control live, con prioridad en estados y accesos de administracion.",
    primaryMatches: [
      {
        id: "1",
        local: "Argentina",
        visitante: "Mexico",
        fase: "Grupo A",
        dateLabel: "Ahora · 63'",
        status: "EN VIVO",
        tone: "mint",
      },
      {
        id: "2",
        local: "Canada",
        visitante: "Japon",
        fase: "Grupo C",
        dateLabel: "Hoy · 21:00",
        status: "Cierra en 18m",
        tone: "gold",
      },
      {
        id: "3",
        local: "Brasil",
        visitante: "Estados Unidos",
        fase: "Grupo D",
        dateLabel: "Mañana · 18:30",
        status: "Abierto",
        tone: "sky",
      },
    ],
    secondaryPanelTitle: "Ranking rapido y estado general",
    secondaryPanelDescription:
      "Resumen corto para ver lideres, actividad y salud competitiva del Prode.",
    ranking: [
      { position: "#1", name: "Lucia Fernandez", points: "97", detail: "lider del torneo" },
      { position: "#2", name: "Matias Gomez", points: "95", detail: "acechando la cima" },
      { position: "#3", name: "Paula Diaz", points: "92", detail: "podio parcial" },
    ],
    quickLinks: [
      { label: "Usuarios", caption: "Aprobaciones y gestion" },
      { label: "Resultados", caption: "Carga oficial" },
      { label: "Fixture", caption: "Partidos y fases" },
      { label: "Cruces", caption: "Simulacion y llaves" },
    ],
    notes: [
      "Mantiene el tono de panel operativo, no de home de jugador.",
      "La grilla replica la densidad del dashboard actual con branding mas institucional.",
      "Los bloques grandes del mock anterior se compactan en cards de control.",
    ],
  },
  user: {
    label: "Mock User",
    title: "Tu barrio tambien juega el Mundial",
    subtitle: "Mi entrada al Prode Mundial",
    description:
      "Carga tus pronosticos, sigue tu ranking y vive cada fecha con una home mas identitaria, pero igual de compacta y funcional.",
    badge: "Vista jugador",
    statusTitle: "Estado de tu participacion",
    statusBody:
      "Prioriza proximo cierre, puntos, ranking y accesos rapidos para jugar el Prode sin ruido administrativo.",
    ctaPrimary: "Cargar pronostico",
    ctaSecondary: "Ver mi ranking",
    heroStats: [
      { label: "Proximo cierre", value: "21:00", detail: "hoy", tone: "gold" },
      { label: "Puntos", value: "84", detail: "acumulados", tone: "sky" },
      { label: "Posicion", value: "#12", detail: "ranking general", tone: "mint" },
    ],
    kpis: [
      { label: "Pronosticos cargados", value: "18/24", detail: "fecha actual", tone: "mint" },
      { label: "Ranking actual", value: "#12", detail: "subiste 3 puestos", tone: "sky" },
      { label: "Puntos totales", value: "84", detail: "con 9 exactos", tone: "gold" },
      { label: "Estado", value: "Abierto", detail: "todavia podes jugar", tone: "navy" },
    ],
    importantActions: [
      {
        title: "Pronosticar partidos de hoy",
        description: "Entra directo a la fecha abierta antes del cierre.",
        badge: "2 por cargar",
      },
      {
        title: "Revisar mis pronosticos",
        description: "Consulta rapido lo guardado y lo ya cerrado.",
      },
      {
        title: "Seguir el ranking",
        description: "Compara tu avance contra el top del torneo.",
      },
    ],
    primaryPanelTitle: "Proximos partidos para pronosticar",
    primaryPanelDescription:
      "Lista corta, visible y bien accionable para entrar a jugar sin demasiado scroll.",
    primaryMatches: [
      {
        id: "1",
        local: "Argentina",
        visitante: "Estados Unidos",
        fase: "Grupo A",
        dateLabel: "Hoy · 21:00",
        status: "Cierra en 2h",
        tone: "gold",
      },
      {
        id: "2",
        local: "Mexico",
        visitante: "Canada",
        fase: "Grupo B",
        dateLabel: "Mañana · 19:30",
        status: "Abierto",
        tone: "sky",
      },
      {
        id: "3",
        local: "Brasil",
        visitante: "Japon",
        fase: "Octavos",
        dateLabel: "30 Jun · 17:00",
        status: "Cerrado",
        tone: "mint",
      },
    ],
    secondaryPanelTitle: "Mi ranking y accesos rapidos",
    secondaryPanelDescription:
      "Combina posicion personal, podio visible y entradas directas a ranking, fixture y pronosticos.",
    ranking: [
      { position: "#1", name: "Lucia Fernandez", points: "97", detail: "lider del barrio" },
      {
        position: "#12",
        name: "Sergio Ariel",
        points: "84",
        detail: "tu lugar actual",
        highlighted: true,
      },
      { position: "#13", name: "Mariano Costa", points: "83", detail: "muy cerca tuyo" },
    ],
    quickLinks: [
      { label: "Mis pronosticos", caption: "Carga y seguimiento" },
      { label: "Fixture", caption: "Calendario completo" },
      { label: "Ranking", caption: "Tabla general" },
      { label: "Mi participacion", caption: "Estado y puntos" },
    ],
    notes: [
      "El tono pasa a jugador sin perder compactacion ni densidad.",
      "El hero baja de escala y deja ver cards utiles desde arriba.",
      "La identidad barrial queda en color, pattern y mensajes, no en bloques gigantes.",
    ],
  },
};
