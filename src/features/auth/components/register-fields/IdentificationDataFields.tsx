"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIPOS_DOCUMENTO_OPCIONES } from "@/constants/tiposDocumento";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { ControlledSelectField } from "./ControlledSelectField";
import { FormSection } from "./FormSection";

export function IdentificationDataFields({
  form,
}: RegisterFieldsSectionProps) {
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
            Cargá únicamente la información necesaria para validar tu solicitud.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ControlledSelectField
            control={control}
            name="tipoDocumento"
            label="Tipo de documento"
            options={TIPOS_DOCUMENTO_OPCIONES}
            errorMessage={errors.tipoDocumento?.message}
          />

          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">Documento</Label>
            <Input
              {...register("documento")}
              aria-invalid={!!errors.documento}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.documento?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.documento.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
