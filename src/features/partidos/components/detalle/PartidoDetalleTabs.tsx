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
      <div className="overflow-x-auto pb-1">
        <TabsList className="h-auto min-w-[320px] rounded-[24px] border border-white/10 bg-[#132238]/72 p-1.5 shadow-none">
          <TabsTrigger
            value="estadisticas"
            className="rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_24px_rgba(89,147,182,0.24)]"
          >
            Estadísticas
          </TabsTrigger>
          <TabsTrigger
            value="alineaciones"
            className="rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 data-[state=active]:bg-[#FAB438] data-[state=active]:text-[#1E2C46] data-[state=active]:shadow-[0_10px_24px_rgba(250,180,56,0.24)]"
          >
            Alineaciones
          </TabsTrigger>
        </TabsList>
      </div>

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
