import type { PrediccionPartido } from "@/features/partidos/types/types";
import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

type FixturePronosticosResponse = {
  data?: PartidoConRelaciones[];
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFixturePronosticos(): Promise<PartidoConRelaciones[]> {
  const res = await fetch("/api/pronosticos/fixture", {
    method: "GET",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as FixturePronosticosResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar fixture de pronósticos");
  }

  return data.data || [];
}

export async function upsertPronostico(input: {
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
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
    throw new Error(data.message || "Error al guardar el pronóstico");
  }

  return data;
}
