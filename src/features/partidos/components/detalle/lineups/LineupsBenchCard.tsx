import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";
import { BenchPlayerRow } from "./BenchPlayerRow";



type LineupsBenchCardProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
};

export function LineupsBenchCard({
  local,
  visitante,
  lineupLocal,
  lineupVisitante,
}: LineupsBenchCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardContent className="relative p-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-slate-200 px-4 py-4">
          <div className="flex min-w-0 items-center justify-start gap-2">
            <span className="truncate text-sm font-semibold text-slate-900 md:text-base">
              {local.nombre}
            </span>
            <TeamLogo equipo={local} />
          </div>

          <h3 className="text-center text-lg font-semibold text-slate-950">
            Suplentes
          </h3>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <TeamLogo equipo={visitante} />
            <span className="truncate text-right text-sm font-semibold text-slate-900 md:text-base">
              {visitante.nombre}
            </span>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          <div className="divide-y divide-slate-200">
            {lineupLocal.suplentes.length === 0 ? (
              <EmptyBench />
            ) : (
              lineupLocal.suplentes.map((player) => (
                <BenchPlayerRow
                  key={`local-bench-${player.jugadorId}`}
                  player={player}
                  align="left"
                  teamCode={local.codigo}
                  teamName={local.nombre}
                />
              ))
            )}
          </div>

          <div className="divide-y divide-slate-200 md:border-l md:border-slate-200">
            {lineupVisitante.suplentes.length === 0 ? (
              <EmptyBench />
            ) : (
              lineupVisitante.suplentes.map((player) => (
                <BenchPlayerRow
                  key={`visitante-bench-${player.jugadorId}`}
                  player={player}
                  align="right"
                  teamCode={visitante.codigo}
                  teamName={visitante.nombre}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyBench() {
  return (
    <div className="px-4 py-6 text-center text-sm text-slate-500">
      No hay suplentes cargados.
    </div>
  );
}

type TeamLogoProps = {
  equipo: PartidoDetalleEquipo;
};

function TeamLogo({ equipo }: TeamLogoProps) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm">
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
