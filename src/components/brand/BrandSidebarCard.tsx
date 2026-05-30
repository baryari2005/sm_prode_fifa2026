"use client";

import Image from "next/image";

type BrandSidebarCardProps = {
  collapsed: boolean;
  imageSrc: string;
  title: string;
  subtitle: string;
  width?: number;
  height?: number;
};

export function BrandSidebarCard({
  collapsed,
  imageSrc,
  title,
  subtitle,
  width = 32,
  height = 32,
}: BrandSidebarCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(89,147,182,0.14),rgba(255,255,255,0.03))] ${
        collapsed ? "px-2 py-3" : "px-3 py-3.5"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,183,49,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div
        className={`relative flex ${collapsed ? "justify-center" : "items-center gap-3"}`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
          <Image
            src={imageSrc}
            alt=""
            width={width}
            height={height}
            className="object-contain"
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
          />
        </div>

        {!collapsed ? (
          <div className="min-w-0">
            <p className="font-brand truncate text-xs font-black uppercase tracking-[0.18em] text-brand-gold">
              {title}
            </p>
            <p className="font-brand mt-1 text-xl tracking-[0.02em] font-medium leading-5 text-brand-blue">
              {subtitle}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
