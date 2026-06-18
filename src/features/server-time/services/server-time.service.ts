export type ServerTimeResponse = {
  serverNow: string;
  serverNowMs: number;
  serverOffsetMinutes: number;
};

export async function getServerTime(): Promise<ServerTimeResponse> {
  const response = await fetch("/api/server-time", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  const data = (await response.json()) as
    | ServerTimeResponse
    | { message?: string };

  if (
    !response.ok ||
    !("serverNow" in data) ||
    typeof data.serverNow !== "string" ||
    !("serverNowMs" in data) ||
    typeof data.serverNowMs !== "number" ||
    !("serverOffsetMinutes" in data) ||
    typeof data.serverOffsetMinutes !== "number"
  ) {
    throw new Error(
      !("serverNow" in data) && data.message
        ? data.message
        : "No se pudo obtener la hora del servidor.",
    );
  }

  return data;
}
