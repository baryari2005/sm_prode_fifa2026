import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

import { PartidoStatsHeader } from "../stats/PartidoStatsHeader";
import { LineupCoachesCard } from "./LineupCoachesCard";
import { LineupLegendCard } from "./LineupLegendCard";
import { LineupsBenchCard } from "./LineupsBenchCard";
import { MatchLineupPitch } from "./MatchLineupPitch";

type MatchLineupsViewProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
};

export function MatchLineupsView({
  local,
  visitante,
  lineupLocal,
  lineupVisitante,
}: MatchLineupsViewProps) {
  return (
    <div className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative p-4 md:p-6 mb-2 mt-6">
        <PartidoStatsHeader
          local={local}
          visitante={visitante}
          title="Alineaciones de los equipos"
        />
      </div>

      <div className="grid gap-4 px-6 pb-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] xl:items-start">
        <div>
          <MatchLineupPitch
            local={local}
            visitante={visitante}
            lineupLocal={lineupLocal}
            lineupVisitante={lineupVisitante}
          />
        </div>

        <div className="space-y-4">
          <LineupsBenchCard
            local={local}
            visitante={visitante}
            lineupLocal={lineupLocal}
            lineupVisitante={lineupVisitante}
          />

          <LineupCoachesCard
            local={local}
            visitante={visitante}
            entrenadorLocal={lineupLocal.entrenador}
            entrenadorVisitante={lineupVisitante.entrenador}
          />
        </div>

        <div className="col-span-full w-full">
          <LineupLegendCard />
        </div>
      </div>
    </div>
  );
}
