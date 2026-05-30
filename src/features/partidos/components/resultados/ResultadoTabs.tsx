"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EstadisticasSection } from "./EstadisticasSection";
import { AlineacionesSection } from "./AlineacionesSection";

import type {
  TeamLineup,
  TeamStats,
} from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type ResultadoTabsProps = {
  localNombre: string;
  visitanteNombre: string;
  localCodigo?: string | null;
  visitanteCodigo?: string | null;
  localBanderaUrl?: string | null;
  visitanteBanderaUrl?: string | null;
  estadisticasLocal: TeamStats;
  estadisticasVisitante: TeamStats;
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  plantelLocal: JugadorSeleccion[];
  plantelVisitante: JugadorSeleccion[];
  importingStats: boolean;
  onImportStats: (file: File) => Promise<void>;
  onLocalStatChange: (key: keyof TeamStats, value: number) => void;
  onVisitanteStatChange: (key: keyof TeamStats, value: number) => void;
  onLocalLineupChange: (lineup: TeamLineup) => void;
  onVisitanteLineupChange: (lineup: TeamLineup) => void;
};

export function ResultadoTabs({
  localNombre,
  visitanteNombre,
  localCodigo,
  visitanteCodigo,
  localBanderaUrl,
  visitanteBanderaUrl,
  estadisticasLocal,
  estadisticasVisitante,
  alineacionLocal,
  alineacionVisitante,
  plantelLocal,
  plantelVisitante,
  importingStats,
  onImportStats,
  onLocalStatChange,
  onVisitanteStatChange,
  onLocalLineupChange,
  onVisitanteLineupChange,
}: ResultadoTabsProps) {
  return (
    <Tabs defaultValue="estadisticas" className="space-y-4">
      <TabsList className="h-auto rounded-2xl border border-white/10 bg-white/[0.05] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <TabsTrigger
          value="estadisticas"
          className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Estadísticas
        </TabsTrigger>

        <TabsTrigger
          value="alineaciones"
          className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Alineaciones
        </TabsTrigger>
      </TabsList>

      <TabsContent value="estadisticas">
        <EstadisticasSection
          localNombre={localNombre}
          visitanteNombre={visitanteNombre}
          localBanderaUrl={localBanderaUrl}
          visitanteBanderaUrl={visitanteBanderaUrl}
          estadisticasLocal={estadisticasLocal}
          estadisticasVisitante={estadisticasVisitante}
          importing={importingStats}
          onImport={onImportStats}
          onLocalStatChange={onLocalStatChange}
          onVisitanteStatChange={onVisitanteStatChange}
        />
      </TabsContent>

      <TabsContent value="alineaciones">
        <AlineacionesSection
          localNombre={localNombre}
          visitanteNombre={visitanteNombre}
          localCodigo={localCodigo}
          visitanteCodigo={visitanteCodigo}
          localBanderaUrl={localBanderaUrl}
          visitanteBanderaUrl={visitanteBanderaUrl}
          alineacionLocal={alineacionLocal}
          alineacionVisitante={alineacionVisitante}
          plantelLocal={plantelLocal}
          plantelVisitante={plantelVisitante}
          onLocalChange={onLocalLineupChange}
          onVisitanteChange={onVisitanteLineupChange}
        />
      </TabsContent>
    </Tabs>
  );
}
