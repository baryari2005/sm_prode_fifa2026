import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";

import { generateKnockoutPartidosForPhase } from "@/features/partidos/services/partido.service";
import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_PHASES: Exclude<FixturePhaseSlug, "grupos">[] = [
  "dieciseisavos",
  "octavos",
  "cuartos",
  "semis",
  "tercer-puesto",
  "final",
];

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");

    const body = (await req.json().catch(() => ({}))) as {
      fase?: FixturePhaseSlug;
    };

    if (
      !body.fase ||
      !ALLOWED_PHASES.includes(
        body.fase as Exclude<FixturePhaseSlug, "grupos">
      )
    ) {
      return NextResponse.json(
        { message: "Fase inválida para generar cruces." },
        { status: 400 }
      );
    }

    const result = await generateKnockoutPartidosForPhase(
      body.fase as Exclude<FixturePhaseSlug, "grupos">
    );

    return NextResponse.json({
      message: `Se regeneraron ${result.generatedCount} partidos de ${result.phaseName}.`,
      ...result,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para generar cruces." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/generar-cruces error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
