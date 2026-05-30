"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BrandTitleProps = {
  children: ReactNode;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function BrandTitle({
  children,
  eyebrow,
  description,
  align = "left",
  className,
}: BrandTitleProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#AEEBFF]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="brand-heading text-3xl text-white md:text-4xl">{children}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm text-white/72 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
