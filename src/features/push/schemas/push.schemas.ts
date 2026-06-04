import { z } from "zod";

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url("El endpoint de la suscripcion es invalido"),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1, "La clave p256dh es obligatoria"),
    auth: z.string().min(1, "La clave auth es obligatoria"),
  }),
});

export const savePushSubscriptionSchema = z
  .object({
    endpoint: z.string().url("El endpoint es invalido"),
    scope: z.string().trim().min(1).optional().nullable(),
    userAgent: z.string().trim().min(1).optional().nullable(),
    subscription: pushSubscriptionSchema,
  })
  .superRefine((value, ctx) => {
    if (value.endpoint !== value.subscription.endpoint) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El endpoint principal debe coincidir con la suscripcion",
        path: ["endpoint"],
      });
    }
  });

export const unsubscribePushSchema = z.object({
  endpoint: z.string().url("El endpoint es invalido"),
});
