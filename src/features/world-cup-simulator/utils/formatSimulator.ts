export function parseSimulatorScoreInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;

  return Number(trimmed);
}

export function formatTeamCode(value?: string | null) {
  return value?.trim().toUpperCase() || "N/D";
}
