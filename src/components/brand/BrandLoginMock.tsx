"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";

import { BrandActionButton } from "@/components/brand/BrandActionButton";
import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { brandImages } from "@/config/brand-images";

export function BrandLoginMock() {
  return (
    <section className="brand-hero overflow-hidden rounded-[36px]">
      <BrandPatternBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(250,180,56,0.14),transparent_18%),radial-gradient(circle_at_50%_60%,rgba(89,147,182,0.16),transparent_30%)]" />

      <div className="relative z-10 grid min-h-[720px] gap-8 p-6 lg:grid-cols-[0.92fr_1.1fr_0.72fr] lg:items-center lg:p-10 xl:p-12">
        <div className="space-y-6">
          <Badge className="brand-badge px-4 py-1.5 text-[11px] uppercase tracking-[0.24em]">
            Mas San Miguel
          </Badge>

          <div className="space-y-4">
            <h1 className="brand-hero-title max-w-[460px] text-5xl text-white md:text-6xl xl:text-7xl">
              Orgullo de barrio.
              <br />
              Pasión mundial.
            </h1>

            <p className="max-w-[430px] text-base leading-7 text-white/78 md:text-lg">
              Viví el Mundial con tu grupo, seguí cada punto y demostrá quién representa mejor a San Miguel.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              icon={Trophy}
              title="Ranking en tiempo real"
              description="Cada fecha suma. Cada punto te acerca a la gloria."
            />
            <FeatureItem
              icon={Users}
              title="Tu grupo, tu competencia"
              description="Jugá con amigos y compartí la pasión mundialista."
            />
            <FeatureItem
              icon={Sparkles}
              title="Identidad local"
              description="Vivilo con el lenguaje visual de Mas San Miguel."
            />
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.18),transparent_44%)] blur-[70px]" />
          <Image
            src={brandImages.prode.loginHeroAlt}
            alt="Arte login preview"
            width={760}
            height={920}
            className="relative h-auto w-full max-w-[480px] object-contain drop-shadow-[0_48px_110px_rgba(0,0,0,0.32)] xl:max-w-[520px]"
          />
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.12] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-[14px] lg:p-7">
          <div className="pointer-events-none absolute right-[-8%] top-[-8%] h-40 w-40 opacity-[0.1]">
            <Image
              src={brandImages.institucional.solArgentino}
              alt=""
              fill
              aria-hidden="true"
              className="object-contain"
            />
          </div>

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

            <Badge className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/78">
              Orgullo de barrio
            </Badge>

            <div>
              <h2 className="brand-heading text-3xl text-white">
                Ingresá a Mas San Miguel
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Accedé para pronosticar, competir y vivir el Mundial con identidad local.
              </p>
            </div>

            <div className="space-y-4">
              <Input placeholder="Usuario" className="h-12 border-white/14 bg-white/[0.1] text-white placeholder:text-white/42" />
              <Input placeholder="Contraseña" className="h-12 border-white/14 bg-white/[0.1] text-white placeholder:text-white/42" />
            </div>

            <BrandActionButton className="h-12 w-full justify-center text-base">
              Entrar a la cancha
              <ArrowRight className="h-4 w-4" />
            </BrandActionButton>

            <div className="space-y-1 text-center lg:text-left">
              <p className="text-sm text-white/58">¿Todavía no jugás?</p>
              <button className="text-sm font-semibold text-[#AEEBFF]">
                Solicitá tu acceso
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
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
