import { NextRequest, NextResponse } from "next/server";

import { syncLiveMatches } from "@/features/live-control/services/live-control.service";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const incomingCronSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");

  if (
    cronSecret &&
    (incomingCronSecret === cronSecret || authHeader === `Bearer ${cronSecret}`)
  ) {
    return;
  }

  const user = await requireAuth(req);

  try {
    requirePermission(user, "resultados", "editar");
    return;
  } catch {}

  requirePermission(user, "resultados", "crear");
}

async function execute(req: NextRequest) {
  await authorize(req);
  const url = new URL(req.url);
  const partidoId = url.searchParams.get("partidoId") ?? undefined;
  const useMock = url.searchParams.get("mock") === "1";

  return syncLiveMatches({
    partidoId,
    useMock,
  });
}

function handleRouteError(method: "GET" | "POST", err: unknown) {
  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { message: "No autorizado. Debes iniciar sesion." },
      { status: 401 },
    );
  }

  if (err instanceof Error && err.message === "FORBIDDEN") {
    return NextResponse.json(
      { message: "No tenés permisos para sincronizar partidos en juego." },
      { status: 403 },
    );
  }

  console.error(`${method} /api/partidos/actualizar-en-juego-api error:`, err);

  return NextResponse.json(
    {
      message: err instanceof Error ? err.message : "Error interno del servidor",
    },
    { status: 500 },
  );
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(await execute(req));
  } catch (err) {
    return handleRouteError("GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(await execute(req));
  } catch (err) {
    return handleRouteError("POST", err);
  }
}
