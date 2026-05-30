import {
  TEAM_STAT_DEFINITIONS,
  type TeamStats,
} from "@/features/partidos/types/fixture-details";
import {
  PARTIDO_DETALLE_SUBCARD_CLASSNAME,
  PartidoDetalleSurface,
} from "@/features/partidos/components/detalle/PartidoDetalleSurface";

import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

import { PartidoStatsHeader } from "./PartidoStatsHeader";
import { PartidoStatRow } from "./PartidoStatRow";

type PartidoStatsCardProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  statsLocal: TeamStats;
  statsVisitante: TeamStats;
};

export function PartidoStatsCard({
  local,
  visitante,
  statsLocal,
  statsVisitante,
}: PartidoStatsCardProps) {
  return (
    <PartidoDetalleSurface contentClassName="p-4 md:p-6">
      <div className={`${PARTIDO_DETALLE_SUBCARD_CLASSNAME} p-4 md:p-5`}>
        <PartidoStatsHeader local={local} visitante={visitante} />

        <div className="space-y-3">
          {TEAM_STAT_DEFINITIONS.map((stat) => {
            const localValue = statsLocal[stat.key];
            const visitanteValue = statsVisitante[stat.key];

            return (
              <PartidoStatRow
                key={stat.key}
                label={stat.label}
                localValue={localValue}
                visitanteValue={visitanteValue}
                unit={stat.unit}
                highlight={stat.highlight}
              />
            );
          })}
        </div>
      </div>
    </PartidoDetalleSurface>
  );
}
