import { z } from "zod";

export const partidoCreateSchema = z.object({
  footballDataId: z.coerce.number().int().positive().optional(),
  fecha: z.coerce.date(),

  estadio: z.string().optional(),
  ciudad: z.string().optional(),

  faseId: z.coerce.number().int().positive(),

  seleccionLocalId: z.string().uuid(),
  seleccionVisitanteId: z.string().uuid(),
});

export const partidoUpdateSchema = z.object({
  footballDataId: z.coerce.number().int().positive().optional(),
  fecha: z.coerce.date().optional(),

  estadio: z.string().optional(),
  ciudad: z.string().optional(),

  faseId: z.coerce.number().int().positive().optional(),

  seleccionLocalId: z.string().uuid().optional(),
  seleccionVisitanteId: z.string().uuid().optional(),

  activo: z.boolean().optional(),
});

export const partidoListParamsSchema = z.object({
  faseId: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export type PartidoCreateInput = z.infer<typeof partidoCreateSchema>;
export type PartidoUpdateInput = z.infer<typeof partidoUpdateSchema>;
