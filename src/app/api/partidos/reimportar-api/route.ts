import { NextRequest, NextResponse } from "next/server";

import { resetFixtureFromApi } from "@/features/partidos/services/fixture-reset.service";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");

    const result = await resetFixtureFromApi();

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para reimportar partidos." },
        { status: 403 },
      );
    }

    if (
      err instanceof Error &&
      (err.message.includes("FOOTBALL_DATA_API_TOKEN") ||
        err.message.includes("MUNDIAL_2026_API_URL"))
    ) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    console.error("POST /api/partidos/reimportar-api error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
