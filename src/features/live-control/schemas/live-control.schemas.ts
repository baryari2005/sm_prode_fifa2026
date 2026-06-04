import { EstadoPartido } from "@prisma/client";
import { z } from "zod";
import {
  teamLineupSchema,
  teamStatsSchema,
} from "@/features/partidos/schemas/resultado.schema";

export const manualGoalSchema = z.object({
  team: z.enum(["LOCAL", "VISITANTE"]),
  minute: z.number().int().min(0).max(190),
  playerId: z.string().uuid().optional(),
  description: z.string().trim().max(300).optional(),
});

export const liveStatusSchema = z.object({
  estado: z.nativeEnum(EstadoPartido),
  minuto: z.number().int().min(0).max(190).nullable().optional(),
  observacion: z.string().trim().max(300).nullable().optional(),
});

export const manualCardSchema = z.object({
  team: z.enum(["LOCAL", "VISITANTE"]),
  minute: z.number().int().min(0).max(190),
  playerId: z.string().uuid(),
  cardType: z.enum(["AMARILLA", "SEGUNDA_AMARILLA", "ROJA_DIRECTA"]),
  description: z.string().trim().max(300).optional(),
});

export const liveToolActionSchema = z.object({
  action: z.enum([
    "sync_match",
    "sync_live",
    "recalculate_score",
    "recalculate_points",
    "recalculate_ranking",
    "cleanup_duplicate_events",
    "validate_match",
    "set_live",
    "set_halftime",
    "set_finished",
    "update_minute",
    "update_partial_result",
    "create_manual_goal",
    "upsert_stats",
    "upsert_lineup",
    "upsert_squad_note",
    "upsert_scorer_note",
    "upsert_cards_note",
    "upsert_penalties_note",
    "simulate_phase_results",
    "generate_mock_predictions",
    "recalculate_phase_ranking",
    "bulk_update_selected_matches_metadata",
    "reset_fixture_from_api",
    "send_test_push",
    "notify_prediction_closing_soon",
    "notify_match_finished",
  ]),
  partidoId: z.string().uuid().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const simulatorPhaseSchema = z.enum([
  "grupos",
  "dieciseisavos",
  "octavos",
  "cuartos",
  "semis",
  "tercer-puesto",
  "final",
]);

export const simulatorPhaseResultsSchema = z.object({
  phase: simulatorPhaseSchema,
});

export const simulatorMockPredictionsSchema = z.object({
  phase: simulatorPhaseSchema,
  userCount: z.number().int().min(4).max(5),
});

export const simulatorPhaseRankingSchema = z.object({
  phase: simulatorPhaseSchema,
});

export const bulkSelectedMatchesMetadataSchema = z.object({
  partidoIds: z.array(z.string().uuid()).min(1, "Selecciona al menos un partido"),
  estadio: z.string().trim().min(1, "El estadio es requerido"),
  ciudad: z.string().trim().min(1, "La ciudad es requerida"),
  fecha: z.string().trim().optional(),
});

export const liveLineupPayloadSchema = z.union([
  z.object({
    side: z.enum(["LOCAL", "VISITANTE"]),
    lineup: teamLineupSchema,
  }),
  z.object({
    alineacionLocal: teamLineupSchema.optional(),
    alineacionVisitante: teamLineupSchema.optional(),
  }).refine(
    (value) => Boolean(value.alineacionLocal || value.alineacionVisitante),
    {
      message: "Debes enviar al menos una alineacion.",
    },
  ),
]);

export const liveStatsPayloadSchema = z.object({
  estadisticasLocal: teamStatsSchema,
  estadisticasVisitante: teamStatsSchema,
});
