"use client";

import { Input } from "@/components/ui/input";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { FormSection } from "./FormSection";

export function PersonalDataFields({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
        <div className="mb-4 space-y-1">
          <p className="text-xs leading-5 text-white/58">
            Completá tu información principal para identificar tu cuenta.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-1">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.nombre?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.nombre.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1">
            <label className="text-sm text-muted-foreground">Apellido</label>
            <Input
              {...register("apellido")}
              aria-invalid={!!errors.apellido}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.apellido?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.apellido.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1">
            <label className="text-sm text-muted-foreground">
              Número de teléfono
            </label>
            <Input
              {...register("celular")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={!!errors.celular}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.celular?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.celular.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
