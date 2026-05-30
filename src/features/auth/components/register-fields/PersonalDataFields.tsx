"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GENERO_OPCIONES } from "@/constants/genero";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { formatEnumLabel } from "../helpers/registerFields.helpers";
import { BirthDateField } from "./BirthDateField";
import { ControlledSelectField } from "./ControlledSelectField";
import { FormSection } from "./FormSection";

export function PersonalDataFields({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <FormSection>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
        <div className="mb-4 space-y-1">          
          <p className="text-xs leading-5 text-white/58">
            Completa tu informacion principal para identificar tu cuenta.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">Nombre</Label>
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
            <Label className="text-sm text-muted-foreground">Apellido</Label>
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
            <Label className="text-sm text-muted-foreground">Celular</Label>
            <Input
              {...register("celular")}
              aria-invalid={!!errors.celular}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.celular?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.celular.message}
              </p>
            ) : null}
          </div>

          <BirthDateField form={form} />

          <ControlledSelectField
            control={control}
            name="genero"
            label="Genero"
            options={GENERO_OPCIONES}
            formatOption={formatEnumLabel}
            errorMessage={errors.genero?.message}
            className="md:col-span-2"
          />
        </div>
      </div>
    </FormSection>
  );
}
