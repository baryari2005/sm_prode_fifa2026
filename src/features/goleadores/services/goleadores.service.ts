import type { Goleador } from "@/features/goleadores/types/types";

type GoleadoresResponse = {
  data?: Goleador[];
  meta?: {
    total?: number;
    source?: "api" | "mock" | "db";
  };
  message?: string;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getGoleadores(useMock = false): Promise<{
  goleadores: Goleador[];
  source: "api" | "mock" | "db";
}> {
  const suffix = useMock ? "?mock=1" : "";

  const res = await fetch(`/api/goleadores${suffix}`, {
    method: "GET",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  const data = (await res.json()) as GoleadoresResponse;

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar goleadores");
  }

  return {
    goleadores: data.data || [],
    source: data.meta?.source || (useMock ? "mock" : "db"),
  };
}
