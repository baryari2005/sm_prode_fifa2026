import { z } from "zod";

export const reglaPuntajeSchema = z
  .object({
    faseId: z.coerce.number().int("Fase inválida").min(1, "Seleccioná una fase"),

    puntosExacto: z.coerce
      .number()
      .int("Debe ser un número entero")
      .min(1, "Debe ser mayor a 0"),

    puntosParcial: z.coerce
      .number()
      .int("Debe ser un número entero")
      .min(0, "No puede ser negativo"),

    puntosClasificadoPenales: z.coerce
      .number()
      .int("Debe ser un numero entero")
      .min(0, "No puede ser negativo"),

    puntosSinAcierto: z.literal(0),
  })
  .refine((data) => data.puntosExacto > data.puntosParcial, {
    message: "El puntaje exacto debe ser mayor al parcial",
    path: ["puntosExacto"],
  });

export type ReglaPuntajeSchema = z.infer<typeof reglaPuntajeSchema>;
