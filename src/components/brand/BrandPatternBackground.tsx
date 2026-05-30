"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BrandPatternBackgroundProps = {
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  variant?: "repeat" | "cover";
};

export function BrandPatternBackground({
  children,
  className,
  overlayClassName,
  variant = "repeat",
}: BrandPatternBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden brand-pattern-bg",
        variant === "cover" ? "brand-pattern-bg-cover" : "brand-pattern-bg-repeat",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 brand-pattern-overlay",
          overlayClassName,
        )}
      />
      {children}
    </div>
  );
}
