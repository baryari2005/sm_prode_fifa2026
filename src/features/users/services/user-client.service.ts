function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function approveAllUsers(): Promise<{
  message: string;
  count: number;
}> {
  const res = await fetch("/api/users", {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = (await res.json()) as {
    message?: string;
    count?: number;
  };

  if (!res.ok) {
    throw new Error(data.message || "Error al aprobar usuarios");
  }

  return {
    message: data.message || "Usuarios aprobados correctamente",
    count: data.count ?? 0,
  };
}
