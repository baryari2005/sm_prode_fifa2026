import Image from "next/image";
import { PARTIDO_DETALLE_SUBCARD_CLASSNAME } from "@/features/partidos/components/detalle/PartidoDetalleSurface";

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
    <div className={`${PARTIDO_DETALLE_SUBCARD_CLASSNAME} overflow-hidden`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-white/8 bg-[#0E1D30]/72 px-4 py-4">
          <div className="flex min-w-0 items-center justify-start gap-2">
            <span className="truncate text-sm font-semibold text-white md:text-base">
              {local.nombre}
            </span>
            <TeamLogo equipo={local} />
          </div>

          <h3 className="text-center text-lg font-semibold text-white">
            Suplentes
          </h3>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <TeamLogo equipo={visitante} />
            <span className="truncate text-right text-sm font-semibold text-white md:text-base">
              {visitante.nombre}
            </span>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          <div className="divide-y divide-white/8">
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

          <div className="divide-y divide-white/8 md:border-l md:border-white/8">
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
    </div>
  );
}

function EmptyBench() {
  return (
    <div className="px-4 py-6 text-center text-sm text-white/58">
      Todavía no hay alineación disponible para este partido.
    </div>
  );
}

type TeamLogoProps = {
  equipo: PartidoDetalleEquipo;
};

function TeamLogo({ equipo }: TeamLogoProps) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.08] p-1.5">
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
