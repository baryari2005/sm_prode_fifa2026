"use client";

import { Controller } from "react-hook-form";

import { CuilInput } from "@/components/forms/CuilInput";
import { Input } from "@/components/ui/input";
import { ESTADO_CIVIL_OPCIONES } from "@/constants/estadocivil";
import { GENERO_OPCIONES } from "@/constants/genero";
import { NACIONALIDAD_VALUES } from "@/constants/nacionalidad";
import { TIPOS_DOCUMENTO_OPCIONES } from "@/constants/tiposDocumento";

import { BirthDateField } from "./BirthDateField";
import { ControlledSelectField } from "./ControlledSelectField";
import { FormSection } from "./FormSection";
import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { formatEnumLabel, formatSimpleCapitalized } from "../helpers/registerFields.helpers";
import { Label } from "@/components/ui/label";

export function PersonalDataFields({ form }: RegisterFieldsSectionProps) {
  const { register, control } = form;

  return (
    <FormSection title="Datos personales">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">Nombre</Label>
          <Input {...register("nombre")} className="h-11 rounded-2xl border px-3" />
        </div>

        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">Apellido</Label>
          <Input {...register("apellido")} className="h-11 rounded-2xl border px-3" />
        </div>

        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">Celular</Label>
          <Input {...register("celular")} className="h-11 rounded-2xl border px-3" />
        </div>

        <ControlledSelectField
          control={control}
          name="tipoDocumento"
          label="Tipo de documento"
          options={TIPOS_DOCUMENTO_OPCIONES}
        />

        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">Documento</Label>
          <Input
            {...register("documento")}
            className="h-11 rounded-2xl border px-3"
          />
        </div>

        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">CUIL</Label>

          <Controller
            name="cuil"
            control={control}
            render={({ field }) => (
              <CuilInput
                className="h-11 rounded-2xl border pr-3"
                value={field.value ?? ""}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                onValueChange={(digits) => field.onChange(digits)}
              />
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BirthDateField form={form} />

        <ControlledSelectField
          control={control}
          name="genero"
          label="Género"
          options={GENERO_OPCIONES}
          formatOption={formatEnumLabel}
        />

        <ControlledSelectField
          control={control}
          name="nacionalidad"
          label="Nacionalidad"
          options={NACIONALIDAD_VALUES}
          formatOption={formatEnumLabel}
        />

        <ControlledSelectField
          control={control}
          name="estadoCivil"
          label="Estado civil"
          options={ESTADO_CIVIL_OPCIONES}
          formatOption={formatSimpleCapitalized}
        />
      </div>
    </FormSection>
  );
}