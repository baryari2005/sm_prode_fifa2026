"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { FormSection } from "./FormSection";

export function AddressFields({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
        <div className="mb-4 space-y-1">
          <p className="text-xs leading-5 text-white/58">
            Indicá tu domicilio. El acceso está reservado solo para residentes de San Miguel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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

          <div className="min-w-0 space-y-1">
            <Label className="text-sm text-muted-foreground">Partido / localidad</Label>
            <Input
              value="San Miguel"
              readOnly
              disabled
              className="h-11 cursor-not-allowed rounded-2xl border px-3 opacity-80"
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
