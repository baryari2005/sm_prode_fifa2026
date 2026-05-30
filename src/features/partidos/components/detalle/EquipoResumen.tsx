import Image from "next/image";

import type { EquipoResumenProps } from "@/features/partidos/types/partido-detalle-header.types";
import { getEquipoInitials } from "@/features/partidos/helpers/partido-detalle-header.helpers";

export function EquipoResumen({ nombre, escudoUrl, align }: EquipoResumenProps) {
  const isLocal = align === "left";

  return (
    <div
      className={`flex min-w-0 items-center justify-center gap-2 md:w-full ${
        isLocal ? "md:justify-end" : "md:justify-start"
      }`}
    >
      {isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-white md:max-w-[220px] md:text-[1.08rem]">
          {nombre}
        </p>
      ) : null}

      <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {escudoUrl ? (
          <Image
            src={escudoUrl}
            alt={nombre}
            width={48}
            height={36}
            unoptimized
            className="h-full w-full shrink-0 object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#0E1D30]/72 text-sm font-black text-[#AEEBFF]">
            {getEquipoInitials(nombre)}
          </span>
        )}
      </div>

      {!isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-white md:max-w-[220px] md:text-[1.08rem]">
          {nombre}
        </p>
      ) : null}
    </div>
  );
}
