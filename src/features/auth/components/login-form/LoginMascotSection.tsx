"use client";

import Image from "next/image";

import { brandImages } from "@/config/brand-images";

export function LoginMascotSection() {
  return (
    <section className="order-3 relative flex min-h-[520px] items-center justify-center overflow-visible px-0 py-4 lg:order-2 lg:min-h-screen lg:px-0">
      <div className="relative isolate flex w-full max-w-[820px] flex-col items-center justify-center px-0 py-0 lg:max-w-[760px] xl:max-w-[820px]">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.18),transparent_44%)] blur-[70px]" />
        <Image
          src={brandImages.prode.loginHeroAlt}
          alt="Prode Mundial 2026"
          width={760}
          height={920}
          priority
          className="relative z-10 h-auto w-full max-w-[500px] select-none object-contain drop-shadow-[0_48px_110px_rgba(0,0,0,0.32)] sm:max-w-[560px] lg:max-w-[610px] xl:max-w-[670px]"
        />
      </div>
    </section>
  );
}
