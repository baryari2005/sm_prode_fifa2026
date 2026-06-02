"use client";

import { FileText } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { BASES_Y_CONDICIONES_TEXTO } from "@/constants/bases-condiciones";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { FormSection } from "./FormSection";

export function TermsAndConditionsField({ form }: RegisterFieldsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection>
      <div className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
          <div className="mb-4 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              <FileText className="h-3.5 w-3.5" />
              Bases y condiciones
            </div>

            <p className="text-sm leading-6 text-white/70">
              Leé la información legal y confirmá la aceptación para enviar tu
              solicitud.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-1">
            <ScrollArea className="h-44 rounded-[0.9rem]">
              <div className="space-y-3 px-3 py-3 pr-7 text-sm leading-6 text-white/70">
                {BASES_Y_CONDICIONES_TEXTO.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent"
              {...register("acceptedTerms")}
            />

            <span>
              Leí y acepto las bases y condiciones, incluida la regla de
              participación exclusiva para residentes de San Miguel.
            </span>
          </label>

          {errors.acceptedTerms?.message ? (
            <p className="mt-2 text-xs font-semibold text-red-300">
              {errors.acceptedTerms.message}
            </p>
          ) : null}
        </div>
      </div>
    </FormSection>
  );
}
