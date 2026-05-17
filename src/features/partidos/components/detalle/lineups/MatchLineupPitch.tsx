import { useMemo } from "react";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";
import { getMatchLineupPositions } from "@/features/partidos/lib/match-lineup-layout";

import { LineupTeamBar } from "./LineupTeamBar";
import { LineupPlayerMarker } from "./LineupPlayerMarker";

type MatchLineupPitchProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
};

export function MatchLineupPitch({
  local,
  visitante,
  lineupLocal,
  lineupVisitante,
}: MatchLineupPitchProps) {
  const localPlayers = useMemo(
    () =>
      getMatchLineupPositions(
        lineupLocal.titulares,
        "local",
        lineupLocal.formacion
      ),
    [lineupLocal.formacion, lineupLocal.titulares]
  );

  const visitantePlayers = useMemo(
    () =>
      getMatchLineupPositions(
        lineupVisitante.titulares,
        "visitante",
        lineupVisitante.formacion
      ),
    [lineupVisitante.formacion, lineupVisitante.titulares]
  );

  const hasPlayers = localPlayers.length > 0 || visitantePlayers.length > 0;

  return (
    <section className="group relative mx-auto max-w-[820px] overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative">
      <LineupTeamBar
        equipo={local}
        formacion={lineupLocal.formacion}
        position="top"
      />

      <div className="relative h-[820px] overflow-hidden bg-[#86C995] text-slate-950 sm:h-[900px] md:h-[980px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-px w-full bg-white/45" />

          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 md:h-32 md:w-32" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55" />

          <div className="absolute left-1/2 top-0 h-[115px] w-[58%] -translate-x-1/2 rounded-b-md border-x border-b border-white/45 md:h-[145px]" />
          <div className="absolute left-1/2 top-0 h-[60px] w-[28%] -translate-x-1/2 rounded-b-md border-x border-b border-white/45 md:h-[78px]" />

          <div className="absolute bottom-0 left-1/2 h-[115px] w-[58%] -translate-x-1/2 rounded-t-md border-x border-t border-white/45 md:h-[145px]" />
          <div className="absolute bottom-0 left-1/2 h-[60px] w-[28%] -translate-x-1/2 rounded-t-md border-x border-t border-white/45 md:h-[78px]" />
        </div>

        {!hasPlayers ? (
          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-sm font-medium text-slate-800">
            No hay alineaciones cargadas para este partido.
          </div>
        ) : (
          <>
            {localPlayers.map((player) => (
              <LineupPlayerMarker
                key={`local-${player.jugadorId}`}
                player={player}
                teamCode={local.codigo}
                teamName={local.nombre}
              />
            ))}

            {visitantePlayers.map((player) => (
              <LineupPlayerMarker
                key={`visitante-${player.jugadorId}`}
                player={player}
                teamCode={visitante.codigo}
                teamName={visitante.nombre}
              />
            ))}
          </>
        )}
      </div>

      <LineupTeamBar
        equipo={visitante}
        formacion={lineupVisitante.formacion}
        position="bottom"
      />
      </div>
    </section>
  );
}
