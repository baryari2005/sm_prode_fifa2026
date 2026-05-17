import { Card, CardContent } from "@/components/ui/card";

import {
  TEAM_STAT_DEFINITIONS,
  type TeamStats,
} from "@/features/partidos/types/fixture-details";

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
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardContent className="relative p-4 md:p-6">
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
      </CardContent>
    </Card>
  );
}
