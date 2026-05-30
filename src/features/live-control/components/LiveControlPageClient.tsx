"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarClock,
  Radio,
  RefreshCw,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMatchCard } from "@/features/live-control/components/LiveMatchCard";
import { LiveControlToolsPanel } from "@/features/live-control/components/LiveControlToolsPanel";
import {
  LIVE_CONTROL_SUBCARD_CLASSNAME,
  LiveControlSurface,
} from "@/features/live-control/components/LiveControlSurface";
import { useLiveControlPage } from "@/features/live-control/hooks/useLiveControlPage";
import { useCan } from "@/hooks/useCan";

export function LiveControlPageClient({
  defaultTab = "panel",
}: {
  defaultTab?: "panel" | "proximos" | "no-cerrados" | "tools";
}) {
  const [activeTab, setActiveTab] = useState<
    "panel" | "proximos" | "no-cerrados" | "tools"
  >(defaultTab);
  const canView = useCan("partidos", "ver");
  const canEditResultados = useCan("resultados", "editar");
  const canCreateResultados = useCan("resultados", "crear");
  const canRecalculateRanking = useCan("ranking", "recalcular");
  const canEdit = canEditResultados || canCreateResultados;

  const {
    matches,
    matchGroups,
    loading,
    syncingAll,
    selectedMatchId,
    toolResponse,
    executingTool,
    recalculatingRanking,
    setSelectedMatchId,
    handleSyncAll,
    handleSyncMatch,
    handleManualGoal,
    handleStatusChange,
    handleRunTool,
    handleRecalculateRanking,
  } = useLiveControlPage();

  const summaryItems = useMemo(() => {
    const manualEvents = matches.reduce(
      (total, match) =>
        total + match.eventosLive.filter((event) => event.source === "MANUAL").length,
      0,
    );

    return [
      {
        label: "Partidos en vivo",
        value: String(matchGroups.live.length),
        detail: "Panel actual",
        icon: Radio,
        toneClassName: "bg-[#5993B6]/18 text-[#AEEBFF]",
      },
      {
        label: "Proximos partidos",
        value: String(matchGroups.proximos.length),
        detail: "Ventana operativa",
        icon: CalendarClock,
        toneClassName: "bg-[#FAB438]/14 text-[#FFE4A3]",
      },
      {
        label: "No cerrados",
        value: String(matchGroups.noCerrados.length),
        detail: "Pendientes de cierre",
        icon: Activity,
        toneClassName: "bg-white/10 text-white",
      },
      {
        label: "Eventos manuales",
        value: String(manualEvents),
        detail: "Protegidos en live",
        icon: ShieldCheck,
        toneClassName: "bg-emerald-400/14 text-emerald-200",
      },
    ];
  }, [matchGroups, matches]);

  if (!canView || !canEdit) {
    return <AccessDenied403Page />;
  }

  function renderMatchesGrid(emptyMessage: string, items: typeof matches) {
    if (loading) {
      return (
        <LiveControlSurface contentClassName="p-6">
          <div className="flex items-center gap-3 text-sm text-white/72">
            <RefreshCw className="h-4 w-4 animate-spin text-[#AEEBFF]" />
            Cargando partidos live...
          </div>
        </LiveControlSurface>
      );
    }

    if (items.length === 0) {
      return (
        <LiveControlSurface contentClassName="p-6">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border-[#5993B6]/20 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
              Estado vacio
            </Badge>
            <p className="font-brand text-[1.55rem] leading-none tracking-[0.04em] text-white">
              Sin partidos para mostrar
            </p>
            <p className="max-w-2xl text-sm leading-6 text-white/72">
              {emptyMessage}
            </p>
          </div>
        </LiveControlSurface>
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
      <LiveControlSurface contentClassName="p-4 md:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)] xl:items-stretch">
          <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#1A2942]/52 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
              Operacion live privada
            </div>

            <div className="space-y-3">
              <h1 className="text-[2.25rem] font-bold leading-[0.98] tracking-[-0.06em] text-white md:text-[2.65rem]">
                Live <span className="text-[#5993B6]">Control</span>
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-white/78 md:text-[0.95rem]">
                Panel rapido para cargar goles manuales, proteger eventos
                criticos y reconciliar con la proxima corrida del cron.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => void handleSyncAll()}
                disabled={syncingAll}
                className="rounded-2xl"
              >
                <RefreshCw
                  className={`h-4 w-4 ${syncingAll ? "animate-spin" : ""}`}
                />
                {syncingAll ? "Sincronizando..." : "Sincronizar ahora"}
              </Button>

              <span className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/68">
                Operacion manual segura sobre datos reales.
              </span>
            </div>
          </div>

          <aside className="space-y-3 rounded-[28px] border border-white/10 bg-[#132238]/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                  Resumen lateral
                </p>
                <p className="mt-1 text-sm text-white/68">
                  Lectura rapida del estado operativo.
                </p>
              </div>
              <Badge className="rounded-full border-[#5993B6]/18 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
                En linea
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} flex items-center gap-3 p-3.5`}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.toneClassName}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-black uppercase tracking-[0.16em] text-white/58">
                        {item.label}
                      </span>
                      <span className="mt-1 block font-brand text-[1.55rem] leading-none tracking-[0.03em] text-white">
                        {item.value}
                      </span>
                      <span className="mt-1 block text-xs text-white/58">
                        {item.detail}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </LiveControlSurface>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "panel" | "proximos" | "no-cerrados" | "tools")
        }
        className="space-y-4"
      >
        {canRecalculateRanking ? (
          <LiveControlSurface contentClassName="p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-brand text-[1.55rem] leading-none tracking-[0.04em] text-white">
                    Ranking
                  </p>
                  <Badge className="rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10">
                    Manual
                  </Badge>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-white/72">
                  Recalcula manualmente el ranking cuando cargues resultados o
                  cierres partidos desde Live Control.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => void handleRecalculateRanking()}
                disabled={recalculatingRanking}
                className="rounded-2xl"
              >
                <Trophy className="h-4 w-4" />
                {recalculatingRanking
                  ? "Recalculando..."
                  : "Recalcular ranking"}
              </Button>
            </div>
          </LiveControlSurface>
        ) : null}

        <div className="overflow-x-auto pb-1">
          <TabsList className="grid min-w-[720px] grid-cols-4 gap-2 rounded-[24px] border-white/10 bg-[#132238]/72 p-1.5 md:min-w-0 md:w-full">
            <TabsTrigger value="panel" className="rounded-2xl">
              Live / actuales
            </TabsTrigger>
            <TabsTrigger value="proximos" className="rounded-2xl">
              Proximos
            </TabsTrigger>
            <TabsTrigger value="no-cerrados" className="rounded-2xl">
              No cerrados
            </TabsTrigger>
            <TabsTrigger value="tools" className="rounded-2xl">
              Herramientas tecnicas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="panel" className="space-y-4">
          {renderMatchesGrid(
            "No hay partidos en vivo o en curso en este momento.",
            matchGroups.live,
          )}
        </TabsContent>

        <TabsContent value="proximos" className="space-y-4">
          {renderMatchesGrid(
            "No hay proximos partidos dentro de la ventana configurada.",
            matchGroups.proximos,
          )}
        </TabsContent>

        <TabsContent value="no-cerrados" className="space-y-4">
          {renderMatchesGrid(
            "No hay partidos viejos pendientes de cierre.",
            matchGroups.noCerrados,
          )}
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
