import { NextRequest, NextResponse } from "next/server";

import { dispatchAutomaticPushNotifications } from "@/features/push/services/push-automation.service";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const loggedInUser = await requireAuth(req);
  requirePermission(loggedInUser, "resultados", "editar");
}

function getPositiveIntegerParam(url: URL, key: string, fallback: number) {
  const raw = url.searchParams.get(key);

  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.trunc(parsed);
}

async function execute(req: NextRequest) {
  await authorize(req);
  const url = new URL(req.url);

  const summary = await dispatchAutomaticPushNotifications({
    reminderToleranceMinutes: getPositiveIntegerParam(url, "reminderToleranceMinutes", 5),
    finalLookbackMinutes: getPositiveIntegerParam(url, "finalLookbackMinutes", 15),
  });

  return NextResponse.json(
    {
      message:
        `Push automaticas procesadas. ` +
        `Recordatorios: ${summary.reminder.notifiedMatches}/${summary.reminder.scannedMatches}. ` +
        `Finalizados: ${summary.finished.notifiedMatches}/${summary.finished.scannedMatches}.`,
      data: summary,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
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
      { message: "No tenes permisos para enviar push automaticas." },
      { status: 403 },
    );
  }

  console.error(`${method} /api/push/dispatch-automatic error:`, err);

  return NextResponse.json(
    {
      message: err instanceof Error ? err.message : "Error interno del servidor",
    },
    { status: 500 },
  );
}

export async function GET(req: NextRequest) {
  try {
    return await execute(req);
  } catch (err) {
    return handleRouteError("GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    return await execute(req);
  } catch (err) {
    return handleRouteError("POST", err);
  }
}
