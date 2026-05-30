import Image from "next/image";
import { PARTIDO_DETALLE_SUBCARD_CLASSNAME } from "@/features/partidos/components/detalle/PartidoDetalleSurface";

import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

type LineupCoachesCardProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  entrenadorLocal?: string;
  entrenadorVisitante?: string;
};

export function LineupCoachesCard({
  local,
  visitante,
  entrenadorLocal,
  entrenadorVisitante,
}: LineupCoachesCardProps) {
  return (
    <div className={`${PARTIDO_DETALLE_SUBCARD_CLASSNAME} overflow-hidden`}>
      <div className="grid gap-0 md:grid-cols-2">
          <CoachBlock
            equipo={local}
            entrenador={entrenadorLocal}
            align="left"
          />

          <CoachBlock
            equipo={visitante}
            entrenador={entrenadorVisitante}
            align="right"
          />
      </div>
    </div>
  );
}

type CoachBlockProps = {
  equipo: PartidoDetalleEquipo;
  entrenador?: string;
  align: "left" | "right";
};

function CoachBlock({ equipo, entrenador, align }: CoachBlockProps) {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 ${
        isRight
          ? "justify-end text-right md:border-l md:border-white/8"
          : "justify-start"
      }`}
    >
      {!isRight && <TeamLogo equipo={equipo} />}

      <div>
        <p className="text-sm font-semibold text-white">
          {entrenador || "DT sin cargar"}
        </p>
        <p className="text-xs text-white/58">Director tecnico</p>
      </div>

      {isRight && <TeamLogo equipo={equipo} />}
    </div>
  );
}

function TeamLogo({ equipo }: { equipo: PartidoDetalleEquipo }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/12 bg-white/[0.08] p-1.5">
      {equipo.escudoUrl ? (
        <Image
          src={equipo.escudoUrl}
          alt={equipo.nombre}
          width={28}
          height={28}
          unoptimized
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-[10px] font-bold text-[#AEEBFF]">
          {(equipo.codigo ?? equipo.nombre.slice(0, 2)).toUpperCase()}
        </span>
      )}
    </div>
  );
}
