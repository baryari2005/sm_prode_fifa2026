import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";
import {
  PARTIDO_DETALLE_SUBCARD_CLASSNAME,
  PartidoDetalleSurface,
} from "@/features/partidos/components/detalle/PartidoDetalleSurface";

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
    <PartidoDetalleSurface contentClassName="p-4 md:p-6">
      <div className={`${PARTIDO_DETALLE_SUBCARD_CLASSNAME} space-y-4 p-4 md:p-5`}>
        <PartidoStatsHeader
          local={local}
          visitante={visitante}
          title="Alineaciones y planteles"
          subtitle="Consulta titulares, suplentes y cuerpo tecnico cargados para este partido."
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] xl:items-start">
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
    </PartidoDetalleSurface>
  );
}
