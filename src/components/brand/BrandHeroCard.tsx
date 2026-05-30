"use client";

import Image from "next/image";

import { BrandWatermark } from "@/components/brand/BrandWatermark";

type BrandHeroCardProps = {
  title: string;
  subtitle: string;
  badge?: string;
  imageSrc: string;
  watermarkSrc?: string;
  imageAlt: string;
  rightLabel?: string;
  className?: string;
  contentClassName?: string;
};

export function BrandHeroCard({
  title,
  subtitle,
  badge,
  imageSrc,
  watermarkSrc,
  imageAlt,
  rightLabel,
  className = "",
  contentClassName = "",
}: BrandHeroCardProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#03131E_0%,#0A3341_48%,#083527_100%)] text-white shadow-[0_24px_70px_rgba(2,6,23,0.22)] ${className}`}
    >
      {watermarkSrc ? (
        <BrandWatermark
          src={watermarkSrc}
          className="right-[-8%] top-[-12%] left-auto h-[140%] w-[48%]"
          opacityClassName="opacity-[0.09]"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_20%),linear-gradient(90deg,rgba(2,6,23,0.14),rgba(2,6,23,0.02)_48%,rgba(255,255,255,0.04))]" />

      <div className={`relative grid gap-5 p-5 md:p-6 xl:grid-cols-[minmax(0,1.1fr)_260px] xl:items-center ${contentClassName}`}>
        <div className="space-y-3">
          {badge ? (
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#F7D774]">
              {badge}
            </span>
          ) : null}

          <div className="space-y-2">
            <h2 className="max-w-3xl text-3xl font-black tracking-tight md:text-[2.2rem]">
              {title}
            </h2>
            <p className="max-w-2xl text-sm font-medium leading-6 text-white/75 md:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[240px] items-center justify-center xl:mx-0 xl:ml-auto">
          <div className="absolute inset-6 rounded-full bg-white/10 blur-3xl" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={260}
            height={260}
            className="relative h-auto max-h-[220px] w-auto object-contain drop-shadow-[0_22px_50px_rgba(0,0,0,0.35)]"
            priority={false}
          />
          {rightLabel ? (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
              {rightLabel}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
