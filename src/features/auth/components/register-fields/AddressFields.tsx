"use client";

import { Input } from "@/components/ui/input";
import { LOCALIDAD_OPCIONES } from "@/constants/localidades";

import { ControlledSelectField } from "./ControlledSelectField";
import { FormSection } from "./FormSection";
import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { Label } from "@/components/ui/label";

export function AddressFields({ form }: RegisterFieldsSectionProps) {
  const { register, control } = form;

  return (
    <FormSection title="Domicilio">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">Domicilio</Label>
          <Input
            {...register("domicilio")}
            className="h-11 rounded-2xl border px-3"
          />
        </div>

        <ControlledSelectField
          control={control}
          name="localidad"
          label="Partido"
          options={LOCALIDAD_OPCIONES}
        />

        <div className="min-w-0 space-y-1">
          <Label className="text-sm text-muted-foreground">
            Código postal
          </Label>
          <Input
            {...register("codigoPostal")}
            className="h-11 rounded-2xl border px-3"
          />
        </div>
      </div>
    </FormSection>
  );
}