"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOCALIDAD_OPCIONES } from "@/constants/localidades";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { ControlledSelectField } from "./ControlledSelectField";
import { FormSection } from "./FormSection";

export function AddressFields({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const partidoOptions = LOCALIDAD_OPCIONES.filter(
    (localidad) => localidad !== "No Aplica"
  );

  return (
    <FormSection>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
        <div className="mb-4 space-y-1">          
          <p className="text-xs leading-5 text-white/58">
            Indica tu ubicacion para completar correctamente la solicitud.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">Domicilio</Label>
            <Input
              {...register("domicilio")}
              aria-invalid={!!errors.domicilio}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.domicilio?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.domicilio.message}
              </p>
            ) : null}
          </div>

          <ControlledSelectField
            control={control}
            name="localidad"
            label="Partido"
            options={partidoOptions}
            placeholder="Seleccionar partido"
            errorMessage={errors.localidad?.message}
          />

          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">
              Codigo postal
            </Label>
            <Input
              {...register("codigoPostal")}
              aria-invalid={!!errors.codigoPostal}
              className="h-11 rounded-2xl border px-3"
            />
            {errors.codigoPostal?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.codigoPostal.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
