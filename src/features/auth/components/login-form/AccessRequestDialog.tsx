"use client";

import Image from "next/image";
import type { SubmitHandler } from "react-hook-form";
import {
  LogIn,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { brandImages } from "@/config/brand-images";
import type { RegisterSchemaValues } from "@/features/auth/schemas/schemas";
import type { RegisterFormReturn } from "@/features/auth/types/registerFields.types";
import { formatMessage } from "@/utils/formatters";

import { RegisterAccessPanel } from "./RegisterAccessPanel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerForm: RegisterFormReturn;
  onRegisterSubmit: SubmitHandler<RegisterSchemaValues>;
  registerTopError?: string | null;
  onDismissRegisterError: () => void;
  isLoading: boolean;
};

export function AccessRequestDialog({
  open,
  onOpenChange,
  registerForm,
  onRegisterSubmit,
  registerTopError,
  onDismissRegisterError,
  isLoading,
}: Props) {
  const hasFieldErrors = Object.keys(registerForm.formState.errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          h-[min(92dvh,860px)]
          w-[min(1180px,94vw)]
          !max-w-[1180px]
          flex-col
          overflow-hidden
          rounded-[2.2rem]
          border
          border-white/10
          bg-[#1E2C46]
          p-0
          text-white
          shadow-[0_32px_100px_rgba(0,0,0,0.42)]
          backdrop-blur-xl
          [&>button]:right-5
          [&>button]:top-5
          [&>button]:rounded-full
          [&>button]:border
          [&>button]:border-white/12
          [&>button]:bg-white/[0.04]
          [&>button]:p-1
          [&>button]:text-white/70
          [&>button]:opacity-100
        "
      >
        <div className="absolute inset-0 brand-pattern-bg brand-pattern-bg-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(250,180,56,0.14),transparent_18%),radial-gradient(circle_at_48%_60%,rgba(89,147,182,0.16),transparent_30%)]" />

        <form
          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
          className="
            relative z-10
            grid
            min-h-0
            flex-1
            gap-8
            overflow-hidden
            p-6
            lg:grid-cols-[0.88fr_1.08fr]
            lg:items-stretch
            lg:p-8
            xl:p-10
            [&_label]:font-medium
            [&_label]:text-white/76
            [&_input]:border-white/14
            [&_input]:bg-white/[0.1]
            [&_input]:text-white
            [&_input]:placeholder:text-white/42
            [&_[data-slot='select-trigger']]:border-white/14
            [&_[data-slot='select-trigger']]:bg-white/[0.1]
            [&_[data-slot='select-trigger']]:text-white
          "
        >
          <div className="hidden min-h-0 h-full flex-col justify-between lg:flex">
            <div className="space-y-7">
              <div className="space-y-4">
                <Badge className="brand-badge px-4 py-1.5 text-[11px] uppercase tracking-[0.24em]">
                  Orgullo de barrio
                </Badge>

                <div className="space-y-4">
                  <h2 className="brand-hero-title max-w-[500px] text-4xl !tracking-[0.04em] text-white xl:text-5xl">
                    Tu barrio también
                    <br />
                    <span className="text-[#5993B6]">juega el Mundial.</span>
                  </h2>

                  <p className="max-w-[440px] text-base leading-7 text-white/78">
                    Solicitá tu acceso al Prode Mundial 2026, esperá la aprobación y empezá a competir con identidad
                    local.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <FeatureItem
                  icon={ShieldCheck}
                  title="Solicitud pendiente"
                  description="Tu cuenta quedará en revisión y será aprobada solo si residís en San Miguel."
                />
                <FeatureItem
                  icon={Sparkles}
                  title="Acceso interno"
                  description="El registro está pensado para personas de la comunidad de San Miguel que participan del Prode."
                />
                <FeatureItem
                  icon={UserRound}
                  title="Validación simple"
                  description="Te pedimos solo los datos necesarios para identificarte y revisar tu solicitud."
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src={brandImages.prode.orgulloBarrioWordmark}
                alt="Orgullo"
                width={120}
                height={120}
                priority
                className="relative z-20 object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.65)] opacity-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#AEEBFF] transition hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                Volver al login
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/72">
                Pasión mundial
              </div>
            </div>
          </div>
          <RegisterAccessPanel
            registerForm={registerForm}
            registerTopError={registerTopError}
            hasFieldErrors={hasFieldErrors}
            isLoading={isLoading}
            onDismissRegisterError={onDismissRegisterError}
            onOpenChange={onOpenChange}
            formatMessage={formatMessage}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-[#FAB438]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
      </div>
    </div>
  );
}
