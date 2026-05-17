import { z } from "zod";

export const paisCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  codigo: z.string().min(2, "El codigo debe tener al menos 2 caracteres").max(10),
  footballDataTeamId: z.coerce.number().int().positive().optional().nullable(),
  bandera: z.string().optional().nullable(),
  grupo: z.string().optional().nullable(),
  confederacion: z.string().optional().nullable(),
});

export const paisUpdateSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  codigo: z.string().min(2).max(10).optional(),
  footballDataTeamId: z.coerce.number().int().positive().optional().nullable(),
  bandera: z.string().optional().nullable(),
  grupo: z.string().optional().nullable(),
  confederacion: z.string().optional().nullable(),
  activo: z.boolean().optional(),
});

export const paisListParamsSchema = z.object({
  q: z.string().optional().default(""),
  page: z.string().optional().default("1"),
  pageSize: z.string().optional().default("10"),
  sortBy: z.string().optional().default("nombre"),
  sortDir: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type CreatePaisDto = z.infer<typeof paisCreateSchema>;
export type UpdatePaisDto = z.infer<typeof paisUpdateSchema>;
export type PaisListParamsDto = z.infer<typeof paisListParamsSchema>;
