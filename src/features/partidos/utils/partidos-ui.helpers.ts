import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Fase,
  Partido,
  PrediccionPartido,
  Seleccion,
} from "@/features/partidos/types/types";

type GrupoLike = {
  nombre?: string | null;
  codigo?: string | null;
};

type FaseConGrupo = Fase & {
  grupo?: string | GrupoLike | null;
  grupoNombre?: string | null;
  grupoCodigo?: string | null;
};

export type PartidoConRelaciones = Partido & {
  seleccionLocal?: Seleccion | null;
  seleccionVisitante?: Seleccion | null;
  fase?: FaseConGrupo | null;
  miPrediccion?: PrediccionPartido | null;

  grupo?: string | GrupoLike | null;
  grupoNombre?: string | null;
  grupoCodigo?: string | null;
};

export type SeleccionResumen = {
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
};

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
  fecha: string | Date,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE
) {
  const matchTime = new Date(fecha).getTime();

  if (Number.isNaN(matchTime)) {
    return 0;
  }

  return matchTime - minutesBefore * 60 * 1000;
}

export function isPredictionClosed(
  fecha: string | Date,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE,
  now = Date.now()
) {
  const closeTime = getPredictionCloseTimestamp(fecha, minutesBefore);

  if (!closeTime) {
    return true;
  }

  return now >= closeTime;
}

export function getPredictionCountdownLabel(
  fecha: string | Date,
  minutesBefore = PREDICTION_CLOSE_MINUTES_BEFORE,
  now = Date.now()
) {
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
    return `Cierra en ${hours} h ${minutes} min`;
  }

  return `Cierra en ${minutes} min`;
}