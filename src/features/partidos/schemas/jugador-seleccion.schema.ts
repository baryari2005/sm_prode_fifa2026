import { z } from "zod";

const statField = z.number().int().min(0).default(0);

export const jugadorSeleccionCreateSchema = z.object({
  seleccionId: z.string().uuid(),
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  fotoUrl: z.string().trim().url().nullable().optional().or(z.literal("")),
  numero: z.number().int().min(0).max(99).nullable().optional(),
  posicion: z.string().trim().min(1, "La posicion es obligatoria"),
  edad: z.number().int().min(0).max(60).nullable().optional(),
  estatura: z.string().trim().max(20).nullable().optional(),
  peso: z.string().trim().max(20).nullable().optional(),
  nacionalidad: z.string().trim().max(80).nullable().optional(),
  apariciones: statField.optional(),
  suplencias: statField.optional(),
  goles: statField.optional(),
  asistencias: statField.optional(),
  tiros: statField.optional(),
  tirosAlArco: statField.optional(),
  faltasCometidas: statField.optional(),
  faltasSufridas: statField.optional(),
  amarillas: statField.optional(),
  rojas: statField.optional(),
  atajadas: statField.optional(),
  golesConcedidos: statField.optional(),
});

export const jugadorSeleccionUpdateSchema =
  jugadorSeleccionCreateSchema.omit({ seleccionId: true }).partial().extend({
    activo: z.boolean().optional(),
  });
