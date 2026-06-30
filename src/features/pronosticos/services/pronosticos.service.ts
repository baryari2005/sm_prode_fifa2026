import type { PrediccionPartido } from "@/features/partidos/types/types";
import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

type FixturePronosticosResponse = {
  data?: PartidoConRelaciones[];
  meta?: {
    total?: number;
    serverNow?: string;
  };
};

export type FixturePronosticosPayload = {
  data: PartidoConRelaciones[];
  serverNow: string | null;
};

export class PronosticosApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PronosticosApiError";
    this.status = status;
  }
}

export type BulkPronosticoInput = {
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
  equipoClasificadoId?: string | null;
};

export type BulkPronosticoResponse = {
  message: string;
  savedCount: number;
  skippedCount: number;
  errors: Array<{
    partidoId: string;
    message: string;
  }>;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFixturePronosticos(): Promise<FixturePronosticosPayload> {
  const res = await fetch("/api/pronosticos/fixture", {
    method: "GET",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      ...getAuthHeaders(),
    },
  });

  const data = (await res.json()) as FixturePronosticosResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new PronosticosApiError(
      data.message || "Error al cargar fixture de pronosticos",
      res.status
    );
  }

  return {
    data: data.data || [],
    serverNow: data.meta?.serverNow ?? null,
  };
}

export async function upsertPronostico(input: {
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
  equipoClasificadoId?: string | null;
}): Promise<PrediccionPartido> {
  const res = await fetch("/api/pronosticos", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as PrediccionPartido & { message?: string };

  if (!res.ok) {
    throw new PronosticosApiError(
      data.message || "Error al guardar el pronostico",
      res.status
    );
  }

  return data;
}

export async function bulkUpsertPronosticos(
  pronosticos: BulkPronosticoInput[]
): Promise<BulkPronosticoResponse> {
  const res = await fetch("/api/pronosticos/bulk", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      pronosticos,
    }),
  });

  const data = (await res.json()) as BulkPronosticoResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new PronosticosApiError(
      data.message || "Error al guardar los pronosticos",
      res.status
    );
  }

  return {
    message: data.message ?? "Pronosticos guardados correctamente",
    savedCount: data.savedCount ?? 0,
    skippedCount: data.skippedCount ?? 0,
    errors: data.errors ?? [],
  };
}
