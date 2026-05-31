"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { Badge } from "@/components/ui/badge";

type PageHeaderWithBrandProps = {
  title: string;
  description: string;
  badge?: string;
  metricLabel?: string;
  metricValue?: string;
  imageSrc: string;
  watermarkSrc?: string;
  imageAlt: string;
  actions?: ReactNode;
  children?: ReactNode;
  density?: "default" | "compact";
  brandVisual?: "default" | "subtle";
  titleClassName?: string;
  layoutClassName?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
};

export function PageHeaderWithBrand({
  title,
  description,
  badge,
  metricLabel,
  metricValue,
  imageSrc,
  watermarkSrc,
  imageAlt,
  actions,
  children,
  density = "default",
  brandVisual = "default",
  titleClassName,
  layoutClassName,
  imageWrapperClassName,
  imageClassName,
}: PageHeaderWithBrandProps) {
  const isCompact = density === "compact";
  const isSubtleBrand = brandVisual === "subtle";

  return (
    <section
      className={`relative h-full overflow-hidden rounded-[2rem] border border-sky-100/15 bg-[linear-gradient(135deg,rgba(4,20,39,0.96)_0%,rgba(8,42,74,0.94)_50%,rgba(6,27,51,0.96)_100%)] text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
        isCompact ? "xl:min-h-[248px]" : ""
      }`}
    >
      {watermarkSrc ? (
        <BrandWatermark
          src={watermarkSrc}
          className={
            isCompact
              ? "right-[-4%] top-[-4%] left-auto h-[120%] w-[34%]"
              : "right-[-8%] top-[-10%] left-auto h-[140%] w-[44%]"
          }
          opacityClassName={isSubtleBrand ? "opacity-[0.05]" : "opacity-[0.08]"}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(117,215,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(246,200,95,0.08),transparent_22%),linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

      <div
        className={`${layoutClassName ?? ""} relative grid h-full ${
          isCompact
            ? "gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,1fr)_160px] xl:items-center"
            : "gap-5 p-5 md:p-6 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center"
        }`}
      >
        <div className={isCompact ? "space-y-3" : "space-y-4"}>
          <div className="flex flex-wrap items-center gap-3">
            {badge ? (
              <Badge
                className={`rounded-full border-sky-100/18 bg-sky-200/10 font-black uppercase tracking-[0.18em] text-sky-100 hover:bg-sky-200/10 ${
                  isCompact ? "px-3 py-1 text-[11px]" : "px-3 py-1 text-xs"
                }`}
              >
                {badge}
              </Badge>
            ) : null}

            {metricLabel && metricValue ? (
              <Badge className="rounded-full border-yellow-300/25 bg-yellow-300/12 px-3 py-1 text-xs font-bold text-yellow-200 hover:bg-yellow-300/12">
                {metricValue} {metricLabel}
              </Badge>
            ) : null}
          </div>

          <div className={isCompact ? "space-y-1.5" : "space-y-2"}>
            <h1
              className={`${titleClassName ?? ""} font-black tracking-tight text-white ${
                isCompact
                  ? "text-[2rem] leading-[0.98] md:text-[2.15rem]"
                  : "text-3xl md:text-[2.1rem]"
              }`}
            >
              {title}
            </h1>
            <p
              className={`font-medium text-white/72 ${
                isCompact
                  ? "max-w-2xl text-sm leading-[1.35rem] md:text-[0.95rem]"
                  : "max-w-3xl text-sm leading-6 md:text-base"
              }`}
            >
              {description}
            </p>
          </div>

          {children ? <div>{children}</div> : null}

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        <div
          className={`${imageWrapperClassName ?? ""} relative mx-auto flex w-full items-center justify-center xl:mx-0 xl:ml-auto ${
            isCompact ? "max-w-[156px]" : "max-w-[220px]"
          }`}
        >
          <div
            className={`absolute rounded-full bg-sky-200/12 blur-3xl ${
              isCompact ? "inset-8" : "inset-6"
            }`}
          />
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={isCompact ? 156 : 220}
            height={isCompact ? 156 : 220}
            className={`relative h-auto w-auto object-contain drop-shadow-[0_18px_40px_rgba(15,23,42,0.18)] ${
              isCompact ? "max-h-[138px] opacity-[0.84]" : "max-h-[200px]"
            } ${imageClassName ?? ""}`}
          />
        </div>
      </div>
    </section>
  );
}
