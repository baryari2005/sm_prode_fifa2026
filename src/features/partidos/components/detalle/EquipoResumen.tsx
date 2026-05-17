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
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {nombre}
        </p>
      ) : null}

      <div className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden">
        {escudoUrl ? (
          <Image
            src={escudoUrl}
            alt={nombre}
            width={48}
            height={36}
            unoptimized
            className="h-9 w-12 shrink-0 object-contain shadow-none"
          />
        ) : (
          <span className="flex h-9 w-12 items-center justify-center bg-slate-50 text-lg">
            {getEquipoInitials(nombre)}
          </span>
        )}
      </div>

      {!isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {nombre}
        </p>
      ) : null}
    </div>
  );
}
