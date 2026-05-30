"use client";

import type { ReactNode } from "react";

import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { brandImages } from "@/config/brand-images";

type LoginPageLayoutProps = {
  hero: ReactNode;
  mascot: ReactNode;
  auth: ReactNode;
};

export function LoginPageLayout({
  hero,
  mascot,
  auth,
}: LoginPageLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1E2C46] text-white">
      <div className="relative min-h-screen">
        <BrandPatternBackground
          overlayClassName="bg-[radial-gradient(circle_at_top_left,rgba(89,147,182,0.16),transparent_24%),radial-gradient(circle_at_83%_18%,rgba(250,180,56,0.12),transparent_18%),linear-gradient(90deg,rgba(30,44,70,0.9)_0%,rgba(30,44,70,0.58)_22%,rgba(30,44,70,0.28)_48%,rgba(30,44,70,0.58)_76%,rgba(30,44,70,0.9)_100%)]"
          variant="cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.1),transparent_34%)]" />
        <BrandWatermark
          src={brandImages.institucional.masSanMiguelLogo}
          className="left-[4%] top-[65%] h-[34%] w-[20%]"
          opacityClassName="opacity-[0.08]"
        />
        <BrandWatermark
          src={brandImages.institucional.solArgentino}
          className="right-[-6%] top-[-10%] left-auto h-[48%] w-[30%]"
          opacityClassName="opacity-[0.08]"
        />
        <div className="pointer-events-none absolute bottom-[-12%] left-[10%] h-[28rem] w-[28rem] rounded-full bg-sky-300/8 blur-[160px]" />
        <div className="pointer-events-none absolute right-[8%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-[#FAB438]/10 blur-[140px]" />

        <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[0.92fr_1.1fr_0.72fr] lg:items-center xl:grid-cols-[0.94fr_1.1fr_0.72fr]">
          {hero}
          {mascot}
          {auth}
        </div>
      </div>
    </main>
  );
}
