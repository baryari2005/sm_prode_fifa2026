import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { TeamStats } from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";

import { MatchLineupsView } from "./lineups/MatchLineupsView";
import { PartidoStatsCard } from "./stats/PartidoStatsCard";

type PartidoDetalleTabsProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  statsLocal: TeamStats;
  statsVisitante: TeamStats;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
};

export function PartidoDetalleTabs({
  local,
  visitante,
  statsLocal,
  statsVisitante,
  lineupLocal,
  lineupVisitante,
}: PartidoDetalleTabsProps) {
  return (
    <Tabs defaultValue="estadisticas" className="space-y-4">
      <TabsList className="h-auto rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-sm">
        <TabsTrigger
          value="estadisticas"
          className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#008C93] data-[state=active]:to-[#00A6B2] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Estadisticas
        </TabsTrigger>
        <TabsTrigger
          value="alineaciones"
          className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#008C93] data-[state=active]:to-[#00A6B2] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Alineaciones
        </TabsTrigger>
      </TabsList>

      <TabsContent value="estadisticas">
        <PartidoStatsCard
          local={local}
          visitante={visitante}
          statsLocal={statsLocal}
          statsVisitante={statsVisitante}
        />
      </TabsContent>

      <TabsContent value="alineaciones">
        <MatchLineupsView
          local={local}
          visitante={visitante}
          lineupLocal={lineupLocal}
          lineupVisitante={lineupVisitante}
        />
      </TabsContent>
    </Tabs>
  );
}
