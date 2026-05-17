"use client";

import type { ComponentProps } from "react";
import { RefreshCw, LogIn, ShieldCheck} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMessage } from "@/utils/formatters";

import { ErrorBannerInput } from "../ErrorBannerInput";
import { LoginFields } from "./LoginFields";
import { ProdeIcon } from "@/components/icons/Iconos";

type LoginFormInstance = ComponentProps<typeof LoginFields>["form"];

type AuthCardProps = {
  loginForm: LoginFormInstance;
  onLoginSubmit: Parameters<LoginFormInstance["handleSubmit"]>[0];
  topError?: string | null;
  onDismissTopError: () => void;
  isLoading: boolean;
  onOpenAccessRequest: () => void;
};

export function AuthCard({
  loginForm,
  onLoginSubmit,
  topError,
  onDismissTopError,
  isLoading,
  onOpenAccessRequest,
}: AuthCardProps) {
  return (
    <section className="order-2 flex min-h-[560px] items-center justify-center px-5 py-8 lg:order-3 lg:min-h-screen lg:px-8">
      <div className="pointer-events-none absolute right-12 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#39A935]/14 blur-[90px] lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-20 hidden h-[340px] w-[340px] rounded-full bg-[#F7B731]/12 blur-[80px] lg:block" />

      <div className="relative w-full max-w-[420px]">
        <div className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-br from-[#B8EF6A]/38 via-[#39A935]/18 to-[#F7B731]/24 blur-2xl" />

        <div className="relative overflow-hidden rounded-[2.25rem] border border-white/16 bg-[linear-gradient(180deg,rgba(9,28,22,0.92),rgba(7,24,19,0.88))] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#39A935]/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-[#F7B731]/12 blur-3xl" />

          <div className="relative">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[1.35rem] border border-[#B8EF6A]/25 bg-[#B8EF6A]/10 text-[#D7FF87] shadow-lg shadow-black/25">
                <ProdeIcon className="h-12 w-12 brightness-0 invert" source="/trofeo.ico" />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F7B731]/30 bg-[#F7B731]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#F7B731]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acceso privado
              </div>

              <h2 className="text-[1.95rem] font-black tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                Iniciar sesión
              </h2>

              <p className="mx-auto mt-2 max-w-[310px] text-sm font-medium leading-6 text-white/64">
                Ingresá tus datos para acceder al prode.
              </p>
            </div>

            {topError && (
              <div className="mb-4">
                <ErrorBannerInput
                  message={topError}
                  onClose={onDismissTopError}
                />
              </div>
            )}

            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="
                space-y-5
                [&_label]:font-bold
                [&_label]:text-white/72
                [&_input]:h-12
                [&_input]:rounded-2xl
                [&_input]:border-white/22
                [&_input]:bg-white/[0.07]
                [&_input]:text-white
                [&_input]:shadow-inner
                [&_input]:shadow-black/20
                [&_input]:placeholder:text-white/35
                [&_input]:focus-visible:border-[#B8EF6A]/80
                [&_input]:focus-visible:ring-[#B8EF6A]/25
                [&_svg]:text-white/55
              "
            >
              <LoginFields form={loginForm} />

              <Button
                type="submit"
                className="mt-4 h-12 w-full rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-950/30 transition hover:bg-[#2B8B31]"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-5 w-5" />

                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {formatMessage("Ingresando...")}
                  </span>
                ) : (
                  "Ingresar al Prode"
                )}
              </Button>

              <div className="text-center text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="font-black text-[#F7B731] underline-offset-4 hover:text-white"
                  onClick={onOpenAccessRequest}
                >
                  Solicitar acceso
                </Button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
          Prode Mundial 2026 · Acceso privado
        </p>
      </div>
    </section>
  );
}
