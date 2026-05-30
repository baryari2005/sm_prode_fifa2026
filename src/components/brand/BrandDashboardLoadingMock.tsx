"use client";

import Image from "next/image";
import { LoaderCircle, Sparkles } from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { brandImages } from "@/config/brand-images";

export function BrandDashboardLoadingMock() {
  return (
    <BrandPageShell backgroundVariant="login" contentClassName="space-y-8 pb-16">
      <section className="rounded-[32px] border border-[#5993B6]/16 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Mock visual temporal
            </p>
            <p className="mt-1 text-sm text-[#1E2C46]/72">
              Preview aislada del loading del dashboard con identidad Más San Miguel.
            </p>
          </div>

          <Badge className="border-[#FAB438]/18 bg-[#FAB438]/12 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8A5A00]">
            No impacta loading real
          </Badge>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#1E2C46] p-4 shadow-[0_24px_60px_rgba(30,44,70,0.18)] md:p-6">
        <BrandPatternBackground
          variant="cover"
          className="opacity-[0.14]"
          overlayClassName="bg-[radial-gradient(circle_at_top_left,rgba(89,147,182,0.16),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(250,180,56,0.12),transparent_16%)]"
        />
        <BrandWatermark
          src={brandImages.institucional.masSanMiguelLogo}
          className="left-[2%] bottom-[8%] top-auto h-40 w-40"
          opacityClassName="opacity-[0.06]"
        />
        <BrandWatermark
          src={brandImages.institucional.solArgentino}
          className="right-[-4%] top-[-10%] left-auto h-52 w-52"
          opacityClassName="opacity-[0.06]"
        />

        <div className="relative z-10 grid min-h-[72vh] items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 px-2 md:px-4">
            <Badge className="border-[#FAB438]/24 bg-[#FAB438]/12 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#FFE4A3]">
              Loading dashboard
            </Badge>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Estado de carga
              </p>
              <h1 className="brand-heading text-4xl leading-[0.96] text-white md:text-5xl">
                Preparando la cancha
              </h1>
              <p className="max-w-[540px] text-sm leading-6 text-white/74 md:text-base">
                Estamos cargando partidos, pronósticos y todo el orgullo de barrio
                para que el dashboard aparezca listo para jugar o administrar.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 text-white/82 backdrop-blur-sm">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </span>
              <div>
                <p className="text-sm font-black text-white">Cargando datos en tiempo real</p>
                <p className="text-xs font-semibold text-white/58">
                  Usuarios, ranking, fixture y estado del sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(6,27,51,0.86),rgba(16,35,59,0.92))] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438]" />
              <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-44 w-44 rounded-full bg-[#5993B6]/14 blur-3xl" />

              <div className="relative z-10 space-y-5">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#5993B6]/18 bg-[#5993B6]/12 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Más San Miguel
                </div>

                <div className="relative mx-auto h-64 w-64 md:h-72 md:w-72">
                  <div className="absolute inset-6 rounded-full bg-[#5993B6]/18 blur-3xl" />
                  <div className="absolute inset-0 animate-[loadingFloat_3.2s_ease-in-out_infinite]">
                    <Image
                      src={brandImages.mascots.loading}
                      alt="Cargando Prode Mundial 2026"
                      fill
                      priority
                      sizes="320px"
                      className="select-none object-contain drop-shadow-[0_24px_46px_rgba(0,0,0,0.28)]"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <p className="brand-heading text-3xl text-white">Un momento, ya salimos a la cancha</p>
                  <p className="mx-auto max-w-[360px] text-sm leading-6 text-white/68">
                    El dashboard se está preparando con datos reales y la nueva piel visual aprobada.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10 shadow-inner">
                    <div className="h-full w-1/3 animate-[loadingBar_1.45s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#5993B6] via-[#AEEBFF] to-[#FAB438]" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-white/58">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#AEEBFF]" />
                    Cargando dashboard del Prode Mundial 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes loadingBar {
            0% {
              transform: translateX(-130%);
            }
            100% {
              transform: translateX(330%);
            }
          }

          @keyframes loadingFloat {
            0%, 100% {
              transform: translateY(0px) rotate(-1deg);
            }
            50% {
              transform: translateY(-10px) rotate(1deg);
            }
          }
        `}</style>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-[28px] border-[#1E2C46]/8 bg-white/78 py-0 shadow-sm backdrop-blur">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Qué conserva
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#1E2C46]/72">
              <li>Mascota protagonista en el centro del loading.</li>
              <li>Mensaje de espera claro y simple.</li>
              <li>Barra animada y estado de carga visible.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/10 bg-[#10233B] py-0 shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
              Qué cambia visualmente
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>Paleta navy/celeste/oro alineada al dashboard aprobado.</li>
              <li>Pattern y marcas de agua como login/dashboard.</li>
              <li>Jerarquía tipográfica más institucional con Cheddar en títulos.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </BrandPageShell>
  );
}
