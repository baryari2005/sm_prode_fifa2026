import Image from "next/image";

import { resolveBanderaSrc } from "@/lib/flags";

import type { SeleccionOption } from "../types";

export function SeleccionFlag({
  seleccion,
  size = "md",
}: {
  seleccion: SeleccionOption | null;
  size?: "sm" | "md";
}) {
  const src = resolveBanderaSrc(seleccion?.bandera, seleccion?.codigo);
  const sizeClass = size === "sm" ? "h-6 w-8" : "h-8 w-10";

  if (!src) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500`}
      >
        {seleccion?.nombre?.slice(0, 2).toUpperCase() ?? "--"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Bandera de ${seleccion?.nombre ?? "seleccion"}`}
      width={size === "sm" ? 32 : 40}
      height={size === "sm" ? 24 : 32}
      unoptimized
      className={`${sizeClass} rounded-md object-cover shadow-sm`}
    />
  );
}
