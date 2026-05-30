"use client";

import type { ComponentProps } from "react";
import Image from "next/image";
import { RefreshCw, Stars } from "lucide-react";

import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { Button } from "@/components/ui/button";
import { brandImages } from "@/config/brand-images";
import { formatMessage } from "@/utils/formatters";

import { ErrorBannerInput } from "../ErrorBannerInput";
import { LoginFields } from "./LoginFields";

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
    <section className="order-2 flex min-h-[560px] items-center justify-center px-4 py-8 lg:order-3 lg:min-h-screen lg:px-5">
      <div className="relative w-full max-w-[360px] xl:max-w-[372px]">
        <div className="absolute -inset-3 rounded-[2.6rem] bg-[radial-gradient(circle_at_top,rgba(250,180,56,0.16),transparent_40%)] blur-2xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.12] px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-[14px] sm:px-7 sm:py-8">
          <BrandWatermark
            src={brandImages.institucional.solArgentino}
            className="right-[-8%] top-[-8%] left-auto h-40 w-40"
            opacityClassName="opacity-[0.1]"
          />

          <div className="relative z-10 space-y-5">
            <div className="flex justify-center lg:justify-start">
              <Image
                src={brandImages.prode.masSanMiguelLogo}
                alt="Mas San Miguel"
                width={170}
                height={70}
                className="h-auto w-[140px] object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/78">
              <Stars className="h-3.5 w-3.5" />
              Orgullo de barrio
            </div>

            <div>
              <h2 className="brand-heading !tracking-[0.04em] text-3xl text-white">
                Ingresa a{" "}
                <span className="inline-block align-baseline text-[2.7rem] !tracking-[0.04em] leading-none text-[#5993B6]">
                  Más
                </span>{" "}
                San Miguel
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Accede para pronosticar, competir y vivir el Mundial con
                identidad local.
              </p>
            </div>

            {topError ? (
              <div className="relative">
                <ErrorBannerInput
                  message={topError}
                  onClose={onDismissTopError}
                />
              </div>
            ) : null}

            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="
                relative space-y-5
                [&_label]:text-sm
                [&_label]:font-semibold
                [&_label]:text-white/76
                [&_input]:h-12
                [&_input]:rounded-[1rem]
                [&_input]:border-white/14
                [&_input]:bg-white/[0.1]
                [&_input]:px-4
                [&_input]:text-sm
                [&_input]:text-white
                [&_input]:placeholder:text-white/42
                [&_input]:focus-visible:border-white/22
                [&_input]:focus-visible:ring-white/12
                [&_svg]:text-white/42
              "
            >
              <LoginFields form={loginForm} />

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#FAB438] text-base font-semibold text-[#1E2C46] shadow-[0_16px_40px_rgba(250,180,56,0.24)] transition hover:bg-[#F7C45A]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin !text-black" />
                    {formatMessage("Entrando...")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Entrar a la cancha
                    <Image
                      src={brandImages.prode.soccerBallIcon}
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                )}
              </Button>

              <div className="space-y-1 pt-1 text-center lg:text-left">
                <p className="text-sm text-white/58">Todavia no jugas?</p>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm font-semibold text-[#AEEBFF] underline-offset-4 hover:text-white"
                  onClick={onOpenAccessRequest}
                >
                  Solicita tu acceso
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
