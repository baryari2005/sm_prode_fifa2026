import { z } from "zod";

import { TIPOS_DOCUMENTO_OPCIONES } from "@/constants/tiposDocumento";

export const loginSchema = z.object({
  userId: z.string().min(1, "Ingrese su usuario"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  userId: z.string().min(1, "Ingrese su usuario"),
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  nombre: z.string().min(1, "Ingrese su nombre"),
  apellido: z.string().min(1, "Ingrese su apellido"),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO_OPCIONES, {
    message: "Seleccione un tipo de documento",
  }),
  documento: z.string().min(7, "Ingrese un documento válido"),
  domicilio: z.string().min(1, "Ingrese su domicilio"),
  localidad: z
    .string()
    .refine((value) => value === "San Miguel", {
      message: "El registro está disponible solo para residentes de San Miguel",
    }),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: "Debe aceptar las bases y condiciones",
  }),
});

export type RegisterSchemaInput = z.input<typeof registerSchema>;
export type RegisterSchemaValues = z.output<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Email inválido"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirm: z.string().min(8, "Confirmación requerida"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
