"use client";

import { Controller } from "react-hook-form";

import { CuilInput } from "@/components/forms/CuilInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ESTADO_CIVIL_OPCIONES } from "@/constants/estadocivil";
import { NACIONALIDAD_VALUES } from "@/constants/nacionalidad";
import { TIPOS_DOCUMENTO_OPCIONES } from "@/constants/tiposDocumento";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import {
  formatEnumLabel,
  formatSimpleCapitalized,
} from "../helpers/registerFields.helpers";
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
            Carga la informacion documental y civil necesaria para la solicitud.
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

          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">CUIL</Label>

            <Controller
              name="cuil"
              control={control}
              render={({ field }) => (
                <CuilInput
                  className="h-11 rounded-2xl border pr-3"
                  aria-invalid={!!errors.cuil}
                  value={field.value ?? ""}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  onValueChange={(digits) => field.onChange(digits)}
                />
              )}
            />
            {errors.cuil?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.cuil.message}
              </p>
            ) : null}
          </div>

          <ControlledSelectField
            control={control}
            name="nacionalidad"
            label="Nacionalidad"
            options={NACIONALIDAD_VALUES}
            formatOption={formatEnumLabel}
            errorMessage={errors.nacionalidad?.message}
          />

          <ControlledSelectField
            control={control}
            name="estadoCivil"
            label="Estado civil"
            options={ESTADO_CIVIL_OPCIONES}
            formatOption={formatSimpleCapitalized}
            errorMessage={errors.estadoCivil?.message}
            className="md:col-span-2"
          />
        </div>
      </div>
    </FormSection>
  );
}
