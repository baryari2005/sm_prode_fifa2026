import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardContent className="relative p-0">
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
      </CardContent>
    </Card>
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
          ? "justify-end text-right md:border-l md:border-slate-200"
          : "justify-start"
      }`}
    >
      {!isRight && <TeamLogo equipo={equipo} />}

      <div>
        <p className="text-sm font-semibold text-slate-950">
          {entrenador || "DT sin cargar"}
        </p>
        <p className="text-xs text-slate-500">Director tecnico</p>
      </div>

      {isRight && <TeamLogo equipo={equipo} />}
    </div>
  );
}

function TeamLogo({ equipo }: { equipo: PartidoDetalleEquipo }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-1 shadow-sm">
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
        <span className="text-[10px] font-bold text-slate-500">
          {equipo.nombre.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
