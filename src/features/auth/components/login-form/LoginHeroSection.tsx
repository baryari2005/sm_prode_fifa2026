"use client";

import Image from "next/image";
import type { LucideIcon, ShieldCheck } from "lucide-react";
import { AlertTriangle, Sparkles, Trophy, Users } from "lucide-react";

import { brandImages } from "@/config/brand-images";

export function LoginHeroSection() {
  return (
    <section className="order-1 flex min-h-[420px] flex-col justify-center px-6 py-10 sm:px-8 lg:min-h-screen lg:px-8 lg:py-12 xl:px-10">
      <div className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.14)] backdrop-blur-xl">
        <Sparkles className="mr-2 h-4 w-4 text-[#FAB438]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/84">
          Mas San Miguel
        </span>
      </div>

      <div className="mt-8 max-w-[530px] xl:max-w-[570px]">
        <h1 className="brand-hero-title text-[3.1rem] text-white !tracking-[0.03em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.22)] sm:text-[3.8rem] xl:text-[4.45rem]">
          Orgullo de barrio.
          <br />
          <span className="text-[#AEEBFF]">Pasión mundial.</span>
        </h1>

        <p className="mt-6 max-w-[420px] text-base leading-7 text-white/78 md:text-lg">
          Viví el Mundial con tu grupo, seguí cada punto y demostrá quién
          representa mejor a San Miguel.
        </p>

        <div className="mt-8 space-y-4">
          <FeatureItem
            icon={AlertTriangle}
            variant="danger"
            title="Importante"
            description="Para participar del Prode Mundial 2026, la solicitud será revisada y aprobada solo si residís en San Miguel."
          />
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

      <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5">
        <Image
          src={brandImages.prode.trophyImageIcon}
          alt="Prode Mundial 2026"
          width={38}
          height={38}
          className="h-9 w-9 object-contain [filter:brightness(0)_saturate(100%)_invert(77%)_sepia(83%)_saturate(932%)_hue-rotate(344deg)_brightness(101%)_contrast(96%)]"
        />
        <span className="text-[16px] font-bold uppercase tracking-[0.24em] text-[#FAB438]">
          Tu barrio, tu prode
        </span>
      </div>
    </section>
  );
}

// function FeatureItem({
//   icon: Icon,
//   title,
//   description,
// }: {
//   icon: LucideIcon;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.08] text-[#FAB438] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
//         <Icon className="h-5 w-5" />
//       </div>

//       <div>
//         <p className="text-base font-semibold text-white">{title}</p>
//         <p className="mt-1 text-sm leading-6 text-white/68">{description}</p>
//       </div>
//     </div>
//   );
// }

function FeatureItem({
  icon: Icon,
  title,
  description,
  variant = "default",
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  variant?: "default" | "danger";
}) {
  const isDanger = variant === "danger";

  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${isDanger
            ? "border-[#F16B6B]/35 bg-[#F16B6B]/14 text-[#FF9B9B]"
            : "border-white/12 bg-white/10 text-[#FAB438]"
          }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p
          className={`text-base font-semibold ${isDanger ? "text-[#FFB3B3]" : "text-white"
            }`}
        >
          {title}
        </p>
        <p
          className={`mt-1 text-sm leading-6 ${isDanger ? "text-[#FFD1D1]/88" : "text-white/70"
            }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
