import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, requirePermission } from "@/lib/server-auth";
import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";
import {
  generateAllKnockoutMatches,
  generateMockPredictionsForPhase,
  simulatePhaseResults,
} from "@/features/world-cup-simulator/services/simulator-persistence.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const phaseSchema = z.enum([
  "grupos",
  "dieciseisavos",
  "octavos",
  "cuartos",
  "semis",
  "tercer-puesto",
  "final",
]);

const requestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("generate_knockout_matches"),
  }),
  z.object({
    action: z.literal("simulate_phase_results"),
    phase: phaseSchema,
  }),
  z.object({
    action: z.literal("generate_mock_predictions"),
    phase: phaseSchema,
    userCount: z.number().int().min(1).max(8).optional(),
  }),
]);

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    requirePermission(user, "partidos", "crear");

    const body = await req.json();
    const parsed = requestSchema.parse(body);

    if (parsed.action === "generate_knockout_matches") {
      const data = await generateAllKnockoutMatches();

      return NextResponse.json({
        message: "Se cargaron o regeneraron los partidos de fases eliminatorias.",
        data,
      });
    }

    if (parsed.action === "simulate_phase_results") {
      const data = await simulatePhaseResults(parsed.phase as FixturePhaseSlug);

      return NextResponse.json({
        message: `Se simularon y finalizaron los resultados de ${data.phaseName}.`,
        data,
      });
    }

    const data = await generateMockPredictionsForPhase(
      parsed.phase as FixturePhaseSlug,
      parsed.userCount ?? 4,
    );

    return NextResponse.json({
      message: `Se generaron pronosticos mock para ${data.phaseName}.`,
      data,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Acceso denegado." }, { status: 403 });
    }

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Solicitud invalida.",
          issues: err.issues,
        },
        { status: 400 },
      );
    }

    console.error("POST /api/simulador-mundial/tools error:", err);

    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
