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
  ]),
  partidoId: z.string().uuid().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
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
