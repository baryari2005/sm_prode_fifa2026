"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { DASHBOARD_PANEL } from "@/features/dashboard/components/home/dashboard-home.styles";
import { useWorldCupSimulator } from "@/features/world-cup-simulator/hooks/useWorldCupSimulator";

import { BestThirdsPanel } from "./BestThirdsPanel";
import { EmptySimulatorState } from "./EmptySimulatorState";
import { GroupStageSimulator } from "./GroupStageSimulator";
import { KnockoutBracket } from "./KnockoutBracket";
import { SimulatorPageHeader } from "./SimulatorPageHeader";
import { SimulatorSummaryPanel } from "./SimulatorSummaryPanel";

export function SimulatorPage() {
  const [activeTab, setActiveTab] = useState("grupos");
  const simulator = useWorldCupSimulator();

  if (simulator.loading) {
    return <DashboardLoading source="Simulador mundial" />;
  }

  if (simulator.error) {
    return (
      <div className="rounded-[30px] border border-rose-300/18 bg-rose-500/8 px-6 py-10 text-center text-white">
        <p className="text-lg font-black">No se pudo cargar el simulador</p>
        <p className="mt-2 text-sm text-white/70">{simulator.error}</p>
      </div>
    );
  }

  if (simulator.grupos.length === 0) {
    return <EmptySimulatorState />;
  }

  return (
    <div className="space-y-6">
      <SimulatorPageHeader
        totalMatches={simulator.totalGroupMatches}
        onReset={simulator.resetSimulation}
        onRandomize={simulator.randomizeGroupMatches}
        onShowBracket={() => setActiveTab("llave")}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className={`${DASHBOARD_PANEL} rounded-[30px] p-5 md:p-6`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1">
                <TabsTrigger value="grupos" className="rounded-full px-5">
                  Fase de grupos
                </TabsTrigger>
                <TabsTrigger value="terceros" className="rounded-full px-5">
                  Mejores terceros
                </TabsTrigger>
                <TabsTrigger value="llave" className="rounded-full px-5">
                  Llave final
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grupos" className="mt-0">
                <GroupStageSimulator
                  groups={simulator.grupos}
                  standingsByGroup={simulator.standingsByGroup}
                  onScoreChange={simulator.updateGroupMatchScore}
                />
              </TabsContent>

              <TabsContent value="terceros" className="mt-0 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge className="rounded-full bg-emerald-400/18 text-emerald-100 hover:bg-emerald-400/18">
                    Clasifican los mejores 8
                  </Badge>
                  <Badge className="rounded-full bg-white/10 text-white/70 hover:bg-white/10">
                    12 terceros posibles
                  </Badge>
                </div>

                <BestThirdsPanel
                  thirds={simulator.qualifiedTeams.terceros}
                  bestThirds={simulator.bestThirds}
                />

                {simulator.missingCombination ? (
                  <div className="rounded-[24px] border border-yellow-300/18 bg-yellow-300/8 px-5 py-4 text-sm text-yellow-100">
                    <AlertTriangle className="mr-2 inline h-4 w-4" />
                    Todavía no está cargada la combinación oficial para estos mejores terceros.
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="llave" className="mt-0">
                <KnockoutBracket
                  rounds={simulator.knockoutRounds}
                  champion={simulator.champion}
                  onScoreChange={simulator.updateKnockoutScore}
                />
              </TabsContent>
            </Tabs>
          </section>
        </div>

        <SimulatorSummaryPanel
          completedMatches={simulator.completedGroupMatches}
          totalMatches={simulator.totalGroupMatches}
          bestThirds={simulator.bestThirds}
          hasRoundOf32={simulator.roundOf32.length > 0}
          champion={simulator.champion}
        />
      </div>
    </div>
  );
}
