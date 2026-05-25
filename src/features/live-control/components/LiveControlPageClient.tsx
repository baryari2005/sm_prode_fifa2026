"use client";

import { useState } from "react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMatchCard } from "@/features/live-control/components/LiveMatchCard";
import { LiveControlToolsPanel } from "@/features/live-control/components/LiveControlToolsPanel";
import { useLiveControlPage } from "@/features/live-control/hooks/useLiveControlPage";
import { useCan } from "@/hooks/useCan";

export function LiveControlPageClient({
  defaultTab = "panel",
}: {
  defaultTab?: "panel" | "proximos" | "no-cerrados" | "tools";
}) {
  const [activeTab, setActiveTab] = useState<"panel" | "proximos" | "no-cerrados" | "tools">(defaultTab);
  const canView = useCan("partidos", "ver");
  const canEditResultados = useCan("resultados", "editar");
  const canCreateResultados = useCan("resultados", "crear");
  const canEdit = canEditResultados || canCreateResultados;

  const {
    matches,
    matchGroups,
    loading,
    syncingAll,
    selectedMatchId,
    toolResponse,
    executingTool,
    setSelectedMatchId,
    handleSyncAll,
    handleSyncMatch,
    handleManualGoal,
    handleStatusChange,
    handleRunTool,
  } = useLiveControlPage();

  if (!canView || !canEdit) {
    return <AccessDenied403Page />;
  }

  function renderMatchesGrid(emptyMessage: string, items: typeof matches) {
    if (loading) {
      return (
        <Card className="rounded-[28px] border-white/70 bg-white shadow-sm">
          <CardContent className="p-6 text-sm text-slate-500">Cargando partidos live...</CardContent>
        </Card>
      );
    }

    if (items.length === 0) {
      return (
        <Card className="rounded-[28px] border-white/70 bg-white shadow-sm">
          <CardContent className="p-6 text-sm text-slate-500">{emptyMessage}</CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 2xl:grid-cols-2">
        {items.map((match) => (
          <LiveMatchCard
            key={match.id}
            match={match}
            syncing={syncingAll}
            onSync={handleSyncMatch}
            onManualGoal={handleManualGoal}
            onStatusChange={handleStatusChange}
            onSelectTools={(partidoId) => {
              setSelectedMatchId(partidoId);
              setActiveTab("tools");
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[32px] border-white/70 bg-gradient-to-r from-slate-950 via-sky-900 to-emerald-800 text-white shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">Operacion live privada</p>
            <h1 className="text-3xl font-black tracking-tight">Live Control</h1>
            <p className="max-w-2xl text-sm text-white/80">
              Panel rapido para cargar goles manuales, proteger eventos criticos y reconciliar con la proxima corrida del cron.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => void handleSyncAll()}
            disabled={syncingAll}
            className="rounded-full bg-white text-slate-950 hover:bg-slate-100"
          >
            {syncingAll ? "Sincronizando..." : "Sincronizar ahora"}
          </Button>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "panel" | "proximos" | "no-cerrados" | "tools")}
        className="space-y-4"
      >
        <TabsList className="grid w-full max-w-4xl grid-cols-2 gap-2 rounded-3xl md:grid-cols-4">
          <TabsTrigger value="panel" className="rounded-full">
            Live / actuales
          </TabsTrigger>
          <TabsTrigger value="proximos" className="rounded-full">
            Proximos
          </TabsTrigger>
          <TabsTrigger value="no-cerrados" className="rounded-full">
            No cerrados
          </TabsTrigger>
          <TabsTrigger value="tools" className="rounded-full">
            Herramientas tecnicas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="panel" className="space-y-4">
          {renderMatchesGrid("No hay partidos en vivo o en curso en este momento.", matchGroups.live)}
        </TabsContent>

        <TabsContent value="proximos" className="space-y-4">
          {renderMatchesGrid("No hay proximos partidos dentro de la ventana configurada.", matchGroups.proximos)}
        </TabsContent>

        <TabsContent value="no-cerrados" className="space-y-4">
          {renderMatchesGrid("No hay partidos viejos pendientes de cierre.", matchGroups.noCerrados)}
        </TabsContent>

        <TabsContent value="tools">
          <LiveControlToolsPanel
            matches={matches}
            selectedMatchId={selectedMatchId}
            response={toolResponse}
            executing={executingTool}
            onSelectMatch={setSelectedMatchId}
            onRun={handleRunTool}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
