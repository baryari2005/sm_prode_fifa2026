"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BrandActionButtonProps = ComponentProps<typeof Button> & {
  tone?: "primary" | "secondary";
};

export function BrandActionButton({
  tone = "primary",
  className,
  ...props
}: BrandActionButtonProps) {
  return (
    <Button
      className={cn(
        "h-11 rounded-2xl px-5 text-sm font-semibold",
        tone === "primary" ? "brand-button-primary" : "brand-button-secondary",
        className,
      )}
      {...props}
    />
  );
}
