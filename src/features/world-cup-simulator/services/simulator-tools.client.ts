import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function postSimulatorTool(body: Record<string, unknown>) {
  const response = await fetch("/api/simulador-mundial/tools", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo ejecutar la herramienta del simulador.");
  }

  return data?.message || "Operacion completada.";
}

export function generateKnockoutMatchesFromSimulator() {
  return postSimulatorTool({
    action: "generate_knockout_matches",
  });
}

export function simulatePhaseResultsFromSimulator(phase: FixturePhaseSlug) {
  return postSimulatorTool({
    action: "simulate_phase_results",
    phase,
  });
}

export function generateMockPredictionsFromSimulator(
  phase: FixturePhaseSlug,
  userCount = 4,
) {
  return postSimulatorTool({
    action: "generate_mock_predictions",
    phase,
    userCount,
  });
}
