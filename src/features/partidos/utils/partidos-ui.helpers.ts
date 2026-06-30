import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Fase,
  Partido,
  PrediccionPartido,
  Seleccion,
} from "@/features/partidos/types/types";
import { EstadoPartido } from "@prisma/client";

type GrupoLike = {
  nombre?: string | null;
  codigo?: string | null;
};

type FaseConGrupo = Fase & {
  grupo?: string | GrupoLike | null;
  grupoNombre?: string | null;
  grupoCodigo?: string | null;
};

function isPartidoConRelaciones(
  value: string | Date | PartidoConRelaciones,
): value is PartidoConRelaciones {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "fecha" in value
  );
}

export type PredictionStatus =
  | "pendiente"
  | "cargado"
  | "cerrado"
  | "partido_iniciado"
  | "finalizado";

export type PredictionMeta = {
  canEdit: boolean;
  isClosed: boolean;
  isBlocked: boolean;
  status: PredictionStatus;
  closeAt: string | null;
  evaluatedAt: string;
};

export type PartidoConRelaciones = Partido & {
  seleccionLocal?: Seleccion | null;
  seleccionVisitante?: Seleccion | null;
  fase?: FaseConGrupo | null;
  miPrediccion?: PrediccionPartido | null;
  predictionMeta?: PredictionMeta | null;

  grupo?: string | GrupoLike | null;
  grupoNombre?: string | null;
  grupoCodigo?: string | null;
};

export type SeleccionResumen = {
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
};

export type MatchStatusMeta = {
  label: string;
  toneClassName: string;
};

export type PredictionStatusMeta = {
  label: string;
  toneClassName: string;
};

export const ESTADO_PARTIDO_OPTIONS: Array<{
  value: EstadoPartido;
  label: string;
}> = [
  { value: EstadoPartido.PENDIENTE, label: "Pendiente" },
  { value: EstadoPartido.EN_JUEGO, label: "En juego" },
  { value: EstadoPartido.ENTRETIEMPO, label: "Entretiempo" },
  { value: EstadoPartido.FINALIZADO, label: "Finalizado" },
  { value: EstadoPartido.SUSPENDIDO, label: "Suspendido" },
  { value: EstadoPartido.CANCELADO, label: "Cancelado" },
];

export function getSeleccionResumen(
  partido: PartidoConRelaciones,
  tipo: "local" | "visitante",
  selecciones: Seleccion[]
): SeleccionResumen {
  const seleccionDirecta =
    tipo === "local" ? partido.seleccionLocal : partido.seleccionVisitante;

  if (seleccionDirecta) {
    return {
      nombre: seleccionDirecta.nombre,
      bandera: seleccionDirecta.bandera ?? null,
      codigo: seleccionDirecta.codigo ?? null,
    };
  }

  const seleccionId =
    tipo === "local" ? partido.seleccionLocalId : partido.seleccionVisitanteId;

  const seleccion = selecciones.find((item) => item.id === seleccionId);

  if (!seleccion) {
    return {
      nombre: "A definir",
      bandera: null,
      codigo: null,
    };
  }

  return {
    nombre: seleccion.nombre,
    bandera: seleccion.bandera ?? null,
    codigo: seleccion.codigo ?? null,
  };
}

export function getFaseNombre(
  partido: PartidoConRelaciones,
  fases: Fase[]
): string {
  if (partido.fase?.nombre) return partido.fase.nombre;

  const fase = fases.find((item) => Number(item.id) === Number(partido.faseId));

  return fase?.nombre ?? "Sin fase";
}

export function isKnockoutPhaseName(faseNombre?: string | null): boolean {
  if (!faseNombre) return false;

  const normalized = faseNombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return [
    "dieciseisavos",
    "16vos",
    "octavos",
    "8vos",
    "cuartos",
    "4tos",
    "semifinal",
    "semi",
    "final",
    "tercer puesto",
    "3 y 4",
  ].some((keyword) => normalized.includes(keyword));
}

export function isKnockoutPartido(partido: PartidoConRelaciones): boolean {
  return isKnockoutPhaseName(getFaseNombre(partido, []));
}

export function getGrupoNombre(partido: PartidoConRelaciones): string {
  const grupoFromPartido = resolveGrupoValue(partido.grupo);
  const grupoFromFase = resolveGrupoValue(partido.fase?.grupo);

  const grupo =
    partido.grupoNombre ||
    partido.grupoCodigo ||
    grupoFromPartido ||
    partido.seleccionLocal?.grupo ||
    partido.fase?.grupoNombre ||
    partido.fase?.grupoCodigo ||
    grupoFromFase;

  if (!grupo) return "Grupo sin definir";

  const normalized = grupo.trim();

  if (normalized.toLowerCase().startsWith("grupo")) {
    return normalized;
  }

  return `Grupo ${normalized}`;
}

export function getEstadioCiudad(partido: PartidoConRelaciones): string {
  const estadio = partido.estadio?.trim();
  const ciudad = partido.ciudad?.trim();

  if (estadio && ciudad) return `${estadio} (${ciudad})`;
  if (estadio) return estadio;
  if (ciudad) return ciudad;

  return "";
}

export function formatMatchHour(fecha: string | Date): string {
  return format(new Date(fecha), "HH:mm", {
    locale: es,
  });
}

export function formatDateTitle(fecha: string | Date): string {
  const value = format(new Date(fecha), "EEEE d MMMM yyyy", {
    locale: es,
  });

  return capitalizeFirst(value);
}

export function buildPartidoSearchText(
  partido: PartidoConRelaciones,
  selecciones: Seleccion[],
  fases: Fase[]
): string {
  const local = getSeleccionResumen(partido, "local", selecciones);
  const visitante = getSeleccionResumen(partido, "visitante", selecciones);
  const fase = getFaseNombre(partido, fases);
  const grupo = getGrupoNombre(partido);
  const estadioCiudad = getEstadioCiudad(partido);

  return [
    local.nombre,
    visitante.nombre,
    fase,
    grupo,
    estadioCiudad,
    partido.estadio,
    partido.ciudad,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function groupPartidosByDate(partidos: PartidoConRelaciones[]) {
  const map = new Map<string, PartidoConRelaciones[]>();

  partidos.forEach((partido) => {
    const key = format(new Date(partido.fecha), "yyyy-MM-dd");

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)?.push(partido);
  });

  return Array.from(map.entries()).map(([key, items]) => ({
    key,
    titulo: formatDateTitle(items[0].fecha),
    partidos: items.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    ),
  }));
}

function resolveGrupoValue(value?: string | GrupoLike | null): string | null {
  if (!value) return null;

  if (typeof value === "string") return value;

  return value.nombre || value.codigo || null;
}

function capitalizeFirst(value: string): string {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}


export const PREDICTION_CLOSE_MINUTES_BEFORE = 60;

export function getPredictionCloseTimestamp(
  fecha: string | Date | PartidoConRelaciones,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE
) {
  let baseFecha: string | Date;

  if (isPartidoConRelaciones(fecha)) {
    const closeAt = fecha.predictionMeta?.closeAt;

    if (closeAt) {
      const closeTime = new Date(closeAt).getTime();
      return Number.isNaN(closeTime) ? 0 : closeTime;
    }

    baseFecha = fecha.fecha;
  } else {
    baseFecha = fecha;
  }

  const matchTime = new Date(baseFecha).getTime();

  if (Number.isNaN(matchTime)) {
    return 0;
  }

  return matchTime - minutesBefore * 60 * 1000;
}

export function isPredictionClosed(
  fecha: string | Date | PartidoConRelaciones,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE,
  now = Date.now()
) {
  if (isPartidoConRelaciones(fecha)) {
    const predictionMeta = fecha.predictionMeta;

    if (predictionMeta) {
      return predictionMeta.isClosed;
    }
  }

  const closeTime = getPredictionCloseTimestamp(fecha, minutesBefore);

  if (!closeTime) {
    return true;
  }

  return now >= closeTime;
}

export function hasMatchStartedForPrediction(partido: PartidoConRelaciones) {
  const estado = partido.resultado?.estado;

  if (!estado) {
    return false;
  }

  return estado !== "PENDIENTE";
}

export function isPredictionBlocked(
  partido: PartidoConRelaciones,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE,
  now = Date.now()
) {
  if (partido.predictionMeta) {
    return partido.predictionMeta.isBlocked;
  }

  return (
    hasMatchStartedForPrediction(partido) ||
    isPredictionClosed(partido.fecha, minutesBefore, now)
  );
}

export function getPredictionCountdownLabel(
  fecha: string | Date | PartidoConRelaciones,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE,
  now = Date.now()
) {
  if (isPartidoConRelaciones(fecha)) {
    const predictionMeta = fecha.predictionMeta;

    if (predictionMeta) {
      if (predictionMeta.status === "finalizado") {
        return "Finalizado";
      }

      if (predictionMeta.status === "partido_iniciado") {
        return "Partido iniciado";
      }

      if (predictionMeta.isClosed || predictionMeta.status === "cerrado") {
        return "Pronostico cerrado";
      }
    }
  }

  const closeTime = getPredictionCloseTimestamp(fecha, minutesBefore);

  if (!closeTime) {
    return "Fecha inválida";
  }

  const diffMs = closeTime - now;

  if (diffMs <= 0) {
    return "Pronóstico cerrado";
  }

  const totalMinutes = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Cierra en ${days} d ${hours} h`;
  }

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `Cierra en ${minutes} min`;
}

export function getMatchStatusMeta(
  partido: PartidoConRelaciones
): MatchStatusMeta {
  const estado = partido.resultado?.estado;

  if (estado === "FINALIZADO") {
    return {
      label: "Finalizado",
      toneClassName: "bg-emerald-50 text-emerald-700",
    };
  }

  if (estado === "EN_JUEGO") {
    return {
      label: "En juego",
      toneClassName: "bg-emerald-50 text-emerald-700",
    };
  }

  if (estado === "ENTRETIEMPO") {
    return {
      label: "Entretiempo",
      toneClassName: "bg-sky-50 text-sky-700",
    };
  }

  return {
    label: "Pendiente",
    toneClassName: "bg-slate-100 text-slate-700",
  };
}

export function getEstadoPartidoLabel(
  estado?: string | null
): string | null {
  if (!estado) return null;

  const normalized = estado.trim().toUpperCase();
  const match = ESTADO_PARTIDO_OPTIONS.find(
    (item) => item.value === normalized
  );

  return match?.label ?? estado;
}

export function getPredictionStatusMeta(
  partido: PartidoConRelaciones,
  now = Date.now(),
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE
): PredictionStatusMeta {
  if (partido.predictionMeta) {
    switch (partido.predictionMeta.status) {
      case "finalizado":
        return {
          label: "Finalizado",
          toneClassName: "bg-emerald-50 text-emerald-700",
        };
      case "partido_iniciado":
        return {
          label: "Partido iniciado",
          toneClassName: "bg-red-50 text-red-700",
        };
      case "cargado":
        return {
          label: "Cargado",
          toneClassName: "bg-green-50 text-green-700",
        };
      case "cerrado":
        return {
          label: "Pronostico cerrado",
          toneClassName: "bg-amber-50 text-amber-700",
        };
      default:
        return {
          label: "Pendiente",
          toneClassName: "bg-[#FFF7E1] text-[#9A6500]",
        };
    }
  }

  if (partido.resultado?.estado === "FINALIZADO") {
    return {
      label: "Finalizado",
      toneClassName: "bg-emerald-50 text-emerald-700",
    };
  }

  if (hasMatchStartedForPrediction(partido)) {
    return {
      label: "Partido iniciado",
      toneClassName: "bg-red-50 text-red-700",
    };
  }

  if (partido.miPrediccion) {
    return {
      label: "Cargado",
      toneClassName: "bg-green-50 text-green-700",
    };
  }

  if (isPredictionClosed(partido.fecha, minutesBefore, now)) {
    return {
      label: "Pronostico cerrado",
      toneClassName: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Pendiente",
    toneClassName: "bg-[#FFF7E1] text-[#9A6500]",
  };
}
