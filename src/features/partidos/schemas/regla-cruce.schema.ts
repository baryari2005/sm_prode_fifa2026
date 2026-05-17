import { z } from "zod";

export const reglaCruceCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  partidoNumero: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "El número de partido es requerido y debe ser mayor que 0",
    }),
  faseId: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "La fase es requerida",
    }),
  localOrigen: z.string().min(1, "La ubicación local es requerida"),
  visitanteOrigen: z.string().min(1, "La ubicación visitante es requerida"),
  estadio: z.string().optional(),
  fecha: z.string().optional(),
  hora: z
    .string()
    .optional()
    .refine((value) => !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value), {
      message: "La hora debe tener formato HH:mm",
    }),
  orden: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (typeof value === "string" && value.trim() === "") {
        return 0;
      }
      return value ? Number(value) : 0;
    })
    .refine(
      (value) => value === undefined || (!Number.isNaN(value) && value >= 0),
      {
        message: "El orden debe ser un número válido",
      }
    ),
});

export const reglaCruceUpdateSchema = reglaCruceCreateSchema.partial();

export type ReglaCruceCreateDto = z.infer<typeof reglaCruceCreateSchema>;
export type ReglaCruceUpdateDto = z.infer<typeof reglaCruceUpdateSchema>;
