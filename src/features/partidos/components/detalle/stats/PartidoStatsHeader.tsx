import Image from "next/image";

import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

type PartidoStatsHeaderProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  title?: string;
  subtitle?: string;
};

export function PartidoStatsHeader({
  local,
  visitante,
  title = "Estadísticas del partido",
  subtitle,
}: PartidoStatsHeaderProps) {
  return (
    <div className="mb-6 rounded-[24px] border border-white/8 bg-[#0E1D30]/72 px-4 py-4 md:px-5">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <TeamLogo equipo={local} align="left" />

        <div className="text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-[#AEEBFF] md:text-[0.95rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium tracking-[0.02em] text-white/62 md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        <TeamLogo equipo={visitante} align="right" />
      </div>
    </div>
  );
}

type TeamLogoProps = {
  equipo: PartidoDetalleEquipo;
  align: "left" | "right";
};

function TeamLogo({ equipo, align }: TeamLogoProps) {
  const isLocal = align === "left";

  return (
    <div
      className={`flex min-w-0 items-center justify-center gap-2 ${
        isLocal ? "md:justify-end" : "md:justify-start"
      }`}
    >
      {isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-white md:max-w-[220px] md:text-[1.08rem]">
          {equipo.nombre}
        </p>
      ) : null}

      <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] p-1.5">
        {equipo.escudoUrl ? (
          <Image
            src={equipo.escudoUrl}
            alt={equipo.nombre}
            width={48}
            height={36}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#081523] text-sm font-black text-[#AEEBFF]">
            {(equipo.codigo ?? equipo.nombre.slice(0, 2)).toUpperCase()}
          </span>
        )}
      </div>

      {!isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-white md:max-w-[220px] md:text-[1.08rem]">
          {equipo.nombre}
        </p>
      ) : null}
    </div>
  );
}
