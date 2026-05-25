"use client";

import Image from "next/image";

import { resolveBanderaSrc } from "@/lib/flags";
import { cn } from "@/lib/utils";

type FlagImageProps = {
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
  widthClassName?: string;
  heightClassName?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fallbackTextClassName?: string;
  fallbackMode?: "code" | "dash" | "emoji";
};

const EDGE_FADE_STYLE = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 10%, black 24%, black 76%, rgba(0,0,0,0.22) 90%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 10%, black 24%, black 76%, rgba(0,0,0,0.22) 90%, transparent 100%)",
};

export function FlagImage({
  bandera,
  codigo,
  nombre,
  widthClassName = "w-10",
  heightClassName = "h-7",
  className,
  imageClassName,
  fallbackClassName,
  fallbackTextClassName,
  fallbackMode = "code",
}: FlagImageProps) {
  const trimmedBandera = bandera?.trim();
  const src = resolveBanderaSrc(trimmedBandera, codigo);
  const sizeClassName = cn("shrink-0", widthClassName, heightClassName);

  if (src) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden",
          sizeClassName,
          className
        )}
        style={EDGE_FADE_STYLE}
      >
        <Image
          src={src}
          alt={`Bandera de ${nombre}`}
          fill
          unoptimized
          sizes="64px"
          className={cn("object-contain", imageClassName)}
        />
      </span>
    );
  }

  const fallbackText =
    fallbackMode === "emoji"
      ? trimmedBandera || "🏳️"
      : fallbackMode === "dash"
        ? "--"
        : codigo?.trim().slice(0, 2).toUpperCase() ||
          nombre.slice(0, 2).toUpperCase() ||
          "--";

  return (
    <span
      aria-label={nombre}
      className={cn(
        "inline-flex items-center justify-center text-slate-400",
        sizeClassName,
        className,
        fallbackClassName
      )}
    >
      <span className={cn("text-sm font-black leading-none", fallbackTextClassName)}>
        {fallbackText}
      </span>
    </span>
  );
}
