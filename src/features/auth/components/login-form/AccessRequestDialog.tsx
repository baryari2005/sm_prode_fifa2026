"use client";

import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Info, RefreshCw, LockKeyhole, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { RegisterSchemaValues } from "@/features/auth/schemas/schemas";
import { formatMessage } from "@/utils/formatters";

import { ErrorBannerInput } from "../ErrorBannerInput";
import { RegisterFields } from "./RegisterFields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerForm: UseFormReturn<RegisterSchemaValues>;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          h-[calc(100dvh-2rem)]
          w-[calc(100vw-1.5rem)]
          !max-w-[1180px]
          flex-col
          overflow-hidden
          rounded-[2rem]
          border
          border-white/10
          bg-[#071827]
          p-0
          text-white
          shadow-[0_32px_100px_rgba(0,0,0,0.62)]
          sm:h-[calc(100dvh-3rem)]
          sm:w-[calc(100vw-3rem)]
          sm:!max-w-[1180px]
          lg:w-[min(92vw,1180px)]
        "
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#39A935]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-[#F7B731]/10 blur-3xl" />

        <form
          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
          className="
            relative
            flex
            min-h-0
            flex-1
            flex-col
            [&_input]:border-white/22
            [&_input]:bg-white/10
            [&_input]:text-white
            [&_input]:placeholder:text-white/35
          "
        >
          {/* HEADER FIJO */}
          <div className="shrink-0 border-b border-white/10 px-5 pt-5 pb-4 sm:px-8 sm:pt-7">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center text-2xl tracking-tight text-white sm:text-2xl">
                <LockKeyhole className="mr-2 h-6 w-6" />
                Solicitar acceso
              </DialogTitle>

              <Separator className="mt-3 bg-white/20 shadow-sm" />

              <DialogDescription className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/62">
                Completá tus datos para crear una solicitud de acceso. Tu usuario
                quedará pendiente hasta que un administrador lo revise y apruebe.
                <Info className="ml-1 inline h-4 w-4 text-white/50" />
              </DialogDescription>
            </DialogHeader>

            {registerTopError && (
              <div className="mt-4">
                <ErrorBannerInput
                  message={registerTopError}
                  onClose={onDismissRegisterError}
                />
              </div>
            )}
          </div>

          {/* CONTENIDO CON SCROLL */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-5
              py-5
              pr-3
              sm:px-8
              sm:pr-5
            "
          >
            <div className="pr-2">
              <RegisterFields form={registerForm} />
            </div>
          </div>

          {/* FOOTER FIJO */}
          <div
            className="
              shrink-0
              border-t
              border-white/10
              bg-[#071827]/95
              px-5
              py-4
              backdrop-blur
              sm:px-8
            "
          >
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="rounded-2xl text-white/75 hover:bg-white/10 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {formatMessage("Enviando solicitud...")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Enviar solicitud
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}