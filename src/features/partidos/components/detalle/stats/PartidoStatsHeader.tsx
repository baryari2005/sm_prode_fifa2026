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
  title = "Estadisticas del equipo",
  subtitle,
}: PartidoStatsHeaderProps) {
  return (
    // <div className="mb-5 rounded-[1.6rem] border border-[#008C93]/12 bg-gradient-to-b from-[#F7FDFC] via-white to-[#F7FAFC] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:px-5">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr] mb-6">
        <TeamLogo equipo={local} align="left" />

        <div className="text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-[#008C93] md:text-[0.95rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium tracking-[0.02em] text-slate-500 md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        <TeamLogo equipo={visitante} align="right" />
      </div>
    // </div>
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
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {equipo.nombre}
        </p>
      ) : null}

      <div className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden">
        {equipo.escudoUrl ? (
          <Image
            src={equipo.escudoUrl}
            alt={equipo.nombre}
            width={48}
            height={36}
            unoptimized
            className="h-9 w-12 object-contain shadow-none"
          />
        ) : (
          <span className="flex h-9 w-12 items-center justify-center bg-slate-50 text-sm font-bold text-slate-500">
            {equipo.nombre.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {!isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {equipo.nombre}
        </p>
      ) : null}
    </div>
  );
}
