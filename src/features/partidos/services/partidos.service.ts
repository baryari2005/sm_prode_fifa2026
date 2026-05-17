// src/features/partidos/services/partidos.service.ts

import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";
import { Fase, Seleccion } from "@/features/partidos/types/types";
import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

type PartidosResponse =
  | PartidoConRelaciones[]
  | {
      data?: PartidoConRelaciones[];
      partidos?: PartidoConRelaciones[];
    };

type PartidosOptionsResponse = {
  selecciones?: Seleccion[];
  fases?: Fase[];
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPartidos(): Promise<PartidoConRelaciones[]> {
  const res = await fetch("/api/partidos?limit=200&offset=0", {
    method: "GET",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Error al cargar los partidos";

    try {
      const errorData = (await res.json()) as { message?: string };
      message = errorData.message || message;
    } catch {
      message = `${message} (${res.status})`;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as PartidosResponse;

  if (Array.isArray(data)) return data;

  return data.data || data.partidos || [];
}

export async function getPartidosOptions(): Promise<{
  selecciones: Seleccion[];
  fases: Fase[];
}> {
  const res = await fetch("/api/partidos", {
    method: "OPTIONS",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    console.error("Error al cargar opciones de partidos", res.status);
    return {
      selecciones: [],
      fases: [],
    };
  }

  const data = (await res.json()) as PartidosOptionsResponse;

  return {
    selecciones: data.selecciones || [],
    fases: data.fases || [],
  };
}

export async function cargarPartidosDesdeApi(): Promise<string> {
  const res = await fetch("/api/partidos/cargar-api", {
    method: "POST",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar desde API");
  }

  return data.message || "Partidos cargados correctamente";
}

export type CargaPartidosApiItem = {
  success: boolean;
  partidoApiId?: number;
  action: "created" | "existing" | "updated" | "omitted" | "error";
  message: string;
};

export type CargaPartidosApiResult = {
  message: string;
  meta?: {
    fase?: string | null;
    stageFilter?: string | null;
    totalApi?: number;
    totalProcesados?: number;
    creados?: number;
    actualizados?: number;
    existentes?: number;
    omitidos?: number;
    fallidos?: number;
    totalEnBase?: number;
  };
  resultados: CargaPartidosApiItem[];
};

export async function cargarPartidosDesdeApiDetallado(
  fase?: FixturePhaseSlug | "todas"
): Promise<CargaPartidosApiResult> {
  const suffix =
    fase && fase !== "todas"
      ? `?fase=${encodeURIComponent(fase)}`
      : "";

  const res = await fetch(`/api/partidos/cargar-api${suffix}`, {
    method: "POST",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as {
    message?: string;
    meta?: CargaPartidosApiResult["meta"];
    resultados?: CargaPartidosApiItem[];
  };

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar desde API");
  }

  return {
    message: data.message || "Partidos cargados correctamente",
    meta: data.meta,
    resultados: data.resultados ?? [],
  };
}

export async function actualizarResultadosDesdeApi(
  useMock = false,
  fase?: FixturePhaseSlug | "todas"
): Promise<string> {
  const searchParams = new URLSearchParams();

  if (useMock) {
    searchParams.set("mock", "1");
  }

  if (fase && fase !== "todas") {
    searchParams.set("fase", fase);
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const res = await fetch(`/api/partidos/actualizar-resultados-api${suffix}`, {
    method: "POST",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar resultados desde API");
  }

  return data.message || "Resultados actualizados correctamente";
}

export async function reimportarPartidosDesdeApi(): Promise<{
  message: string;
  meta?: {
    totalApi?: number;
    partidosEliminados?: number;
    resultadosEliminados?: number;
    prediccionesEliminadas?: number;
    plantelesEliminados?: number;
    seleccionesEliminadas?: number;
    creados?: number;
    omitidos?: number;
    fallidos?: number;
  };
}> {
  const res = await fetch("/api/partidos/reimportar-api", {
    method: "POST",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as {
    message?: string;
    meta?: {
      totalApi?: number;
      partidosEliminados?: number;
      resultadosEliminados?: number;
      prediccionesEliminadas?: number;
      plantelesEliminados?: number;
      seleccionesEliminadas?: number;
      creados?: number;
      omitidos?: number;
      fallidos?: number;
    };
  };

  if (!res.ok) {
    throw new Error(data.message || "Error al reimportar partidos desde API");
  }

  return {
    message: data.message || "Partidos reimportados correctamente",
    meta: data.meta,
  };
}

export async function actualizarPartidosEnJuegoDesdeApi(): Promise<{
  message: string;
  meta?: {
    scanned?: number;
    updated?: number;
    created?: number;
    finished?: number;
    skipped?: number;
  };
}> {
  const res = await fetch("/api/partidos/actualizar-en-juego-api", {
    method: "POST",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as {
    message?: string;
    meta?: {
      scanned?: number;
      updated?: number;
      created?: number;
      finished?: number;
      skipped?: number;
    };
  };

  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar partidos en juego");
  }

  return {
    message: data.message || "Partidos en juego actualizados correctamente",
    meta: data.meta,
  };
}

export async function generarCrucesPorFase(
  fase: Exclude<FixturePhaseSlug, "grupos">
): Promise<string> {
  const res = await fetch("/api/partidos/generar-cruces", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ fase }),
  });

  const data = (await res.json().catch(() => null)) as { message?: string } | null;

  if (!res.ok) {
    throw new Error(data?.message || "Error al generar cruces");
  }

  return data?.message || "Cruces generados correctamente";
}
