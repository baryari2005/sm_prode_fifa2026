"use client";

import { BASES_Y_CONDICIONES_TEXTO } from "@/constants/bases-condiciones";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FormSection } from "./FormSection";
import { RegisterFieldsSectionProps } from "../../types/registerFields.types";

export function TermsAndConditionsField({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection title="Bases y condiciones">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-1">
        <ScrollArea className="h-36 rounded-[0.9rem]">
          <div className="space-y-3 px-3 py-3 pr-7 text-sm leading-6 text-white/70">
            {BASES_Y_CONDICIONES_TEXTO.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white/80">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent"
          {...register("acceptedTerms")}
        />

        <span>Leí y acepto las bases y condiciones para solicitar acceso.</span>
      </label>

      {errors.acceptedTerms?.message && (
        <p className="text-xs font-semibold text-red-300">
          {errors.acceptedTerms.message}
        </p>
      )}
    </FormSection>
  );
}