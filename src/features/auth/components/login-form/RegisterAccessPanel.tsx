"use client";

import Image from "next/image";
import { AlertCircle, ArrowBigRight, Info, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { RegisterFields } from "./RegisterFields";
import { brandImages } from "@/config/brand-images";
import { RegisterFormReturn } from "../../types/registerFields.types";
import { ErrorBannerInput } from "../ErrorBannerInput";

type RegisterAccessPanelProps = {
  registerForm: RegisterFormReturn;
  registerTopError?: string | null;
  hasFieldErrors: boolean;
  isLoading: boolean;
  onDismissRegisterError: () => void;
  onOpenChange: (open: boolean) => void;
  formatMessage: (message: string) => string;
};

export function RegisterAccessPanel({
  registerForm,
  registerTopError,
  hasFieldErrors,
  isLoading,
  onDismissRegisterError,
  onOpenChange,
  formatMessage,
}: RegisterAccessPanelProps) {
  return (
    <div className="relative ml-auto mr-4 flex min-h-0 h-full w-full max-w-[780px] justify-self-end lg:mr-6 xl:mr-8">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.18),transparent_42%)] blur-[72px]" />

      <div className="pointer-events-none absolute right-[8%] top-[2%] h-40 w-40 opacity-[0.1]">
        <Image
          src={brandImages.institucional.solArgentino}
          alt=""
          fill
          aria-hidden="true"
          className="object-contain"
        />
      </div>

      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.12] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-[14px] lg:p-7">
        <BrandWatermark
          src={brandImages.prode.solMark}
          className="bottom-[-10%] right-[-8%] left-auto h-56 w-56"
          opacityClassName="opacity-[0.08]"
        />

        <div className="relative z-10 flex h-full min-h-0 flex-col space-y-5">
          <div className="flex justify-center lg:justify-start">
            <Image
              src={brandImages.prode.masSMLogo}
              alt="Mas San Miguel"
              width={176}
              height={72}
              className="h-auto w-[142px] object-contain"
            />
          </div>

          <DialogHeader className="text-left">
            <DialogTitle className="brand-heading text-3xl text-white !tracking-[0.04em]">
              Solicitá tu acceso
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-white/70">
              <Info className="mr-2 inline h-4 w-4 text-white/50" />
              Completá tus datos y esperá la aprobación de un administrador. Tu
              cuenta quedará pendiente hasta que sea aprobada.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-[#FDBA3B]/30 bg-[#FDBA3B]/10 px-4 py-3 text-sm font-semibold leading-6 text-[#FFE4A3]">
            <AlertCircle className="mr-2 inline h-4 w-4" />
            Acceso exclusivo para residentes de San Miguel. Para participar del Prode Mundial 2026, la solicitud será revisada y aprobada solo si la persona reside en San Miguel.
          </div>

          {registerTopError && !hasFieldErrors ? (
            <div className="relative">
              <ErrorBannerInput
                message={registerTopError}
                onClose={onDismissRegisterError}
              />
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto pr-2 pb-1">
            <RegisterFields form={registerForm} />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-[#FAB438] text-base font-semibold text-[#1E2C46] shadow-[0_16px_40px_rgba(250,180,56,0.24)] transition hover:bg-[#F7C45A]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {formatMessage("Enviando solicitud...")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Enviar solicitud
                  <ArrowBigRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-white/75 hover:bg-white/10 hover:text-white lg:hidden"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
