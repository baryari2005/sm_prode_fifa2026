"use client";

import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

import { LoginStatsCards } from "./LoginStatsCards";

export function LoginHeroSection() {
  return (
    <section className="order-1 flex min-h-[420px] flex-col justify-between px-5 py-6 sm:px-8 lg:min-h-screen lg:p-10 lg:pb-14">
      <div className="inline-flex w-fit items-center rounded-[1.75rem] border border-white/14 bg-white/8 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        <Image
          src="/logo.png"
          alt="Logo Prode Mundial 2026"
          width={200}
          height={80}
          priority
          className="h-auto w-[145px] select-none sm:w-[170px]"
        />
      </div>

      <div className="my-10 max-w-2xl lg:my-0">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B8EF6A]/35 bg-[#B8EF6A]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#D7FF87] shadow-sm shadow-[#B8EF6A]/10 sm:text-sm">
          <ShieldCheck className="h-4 w-4" />
          Acceso seguro para participantes
        </div>

        <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:text-5xl xl:text-[3.8rem]">
          Pronosticá, sumá puntos y competí con tu grupo.
        </h1>

        <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/72 sm:text-lg">
          Cargá tus resultados, seguí el ranking en tiempo real y viví el
          Mundial con una experiencia simple, rápida y visual.
        </p>

        <div className="mt-8 flex max-w-xl flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-[1.25rem] border border-[#F7B731]/28 bg-[#F7B731]/10 px-4 py-3 text-sm font-black text-[#F7B731] shadow-lg shadow-black/20 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Presentado por Más San Miguel
          </div>

          <div className="inline-flex items-center rounded-[1.25rem] border border-white/12 bg-white/6 px-4 py-3 text-sm font-semibold text-white/72 backdrop-blur-xl">
            Rankings en tiempo real y carga simple desde cualquier dispositivo
          </div>
        </div>
      </div>

      <LoginStatsCards />
    </section>
  );
}
