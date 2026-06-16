"use client";

import { EstadoPartido } from "@prisma/client";
import { ChevronLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesktopMatchVersusHero } from "@/features/partidos/components/dashboard/DesktopMatchVersusHero";
import { ESTADO_PARTIDO_OPTIONS } from "@/features/partidos/utils/partidos-ui.helpers";
import { EstadisticasSection } from "@/features/partidos/components/resultados/EstadisticasSection";
import { IncidentTimelineCard } from "@/features/partidos/components/resultados/IncidentTimelineCard";
import { IncidenciasEditor } from "@/features/partidos/components/resultados/IncidenciasEditor";
import { MatchIncidentRealSummary } from "@/features/partidos/components/resultados/MatchIncidentRealSummary";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { useResultadoPartidoPage } from "@/features/partidos/hooks/useResultadoPartidoPage";

type ResultadoPartidoPageState = ReturnType<typeof useResultadoPartidoPage>;

type Props = {
  partido: NonNullable<ResultadoPartidoPageState["partido"]>;
  resultado: ResultadoPartidoPageState["resultado"];
  form: ResultadoPartidoPageState["form"];
  plantelLocal: ResultadoPartidoPageState["plantelLocal"];
  plantelVisitante: ResultadoPartidoPageState["plantelVisitante"];
  saving: ResultadoPartidoPageState["saving"];
  importingStats: ResultadoPartidoPageState["importingStats"];
  isResultLocked: ResultadoPartidoPageState["persistedResultLocked"];
  canEditCurrentResult: ResultadoPartidoPageState["canEditCurrentResult"];
  localNombre: ResultadoPartidoPageState["localNombre"];
  visitanteNombre: ResultadoPartidoPageState["visitanteNombre"];
  escudoLocalUrl: ResultadoPartidoPageState["escudoLocalUrl"];
  escudoVisitanteUrl: ResultadoPartidoPageState["escudoVisitanteUrl"];
  fechaTexto?: string;
  updateForm: ResultadoPartidoPageState["updateForm"];
  updateLocalStat: ResultadoPartidoPageState["updateLocalStat"];
  updateVisitanteStat: ResultadoPartidoPageState["updateVisitanteStat"];
  updateIncidencias: ResultadoPartidoPageState["updateIncidencias"];
  handleImportStats: ResultadoPartidoPageState["handleImportStats"];
  handleSave: ResultadoPartidoPageState["handleSave"];
  cancel: ResultadoPartidoPageState["cancel"];
};

export function ResultadoPartidoDashboardView({
  partido,
  resultado,
  form,
  plantelLocal,
  plantelVisitante,
  saving,
  importingStats,
  isResultLocked,
  canEditCurrentResult,
  localNombre,
  visitanteNombre,
  escudoLocalUrl,
  escudoVisitanteUrl,
  fechaTexto,
  updateForm,
  updateLocalStat,
  updateVisitanteStat,
  updateIncidencias,
  handleImportStats,
  handleSave,
  cancel,
}: Props) {
  const golesLocal = form.detalleGolesLocal.length;
  const golesVisitante = form.detalleGolesVisitante.length;
  const faseLabel =
    partido.fase?.grupoNombre ?? partido.fase?.nombre ?? "Partido";
  const localCodigo = partido.seleccionLocal?.codigo ?? null;
  const visitanteCodigo = partido.seleccionVisitante?.codigo ?? null;

  return (
    <main className="px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 xl:gap-6">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[100%] min-w-0 flex-col xl:max-w-[68%] 2xl:max-w-[62%]">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Carga manual de resultado
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Gestión de <span className="text-[#5993B6]">incidencias</span>
                </h1>

                <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  Cargá goles y eventos del partido
                </p>

                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Registrá el marcador, las incidencias y el estado general del
                  encuentro desde el mismo flujo administrativo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">
                <Button
                  variant="outline"
                  onClick={cancel}
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Volver al detalle
                </Button>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
                  <span className="block text-[14px] font-black leading-none tracking-[0.04em] text-white">
                    {faseLabel}
                  </span>
                  <span className="text-[11px] font-semibold leading-4 text-white/72">
                    {fechaTexto ?? "Fecha pendiente"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-4px] right-[0px] z-20 hidden h-[356px] w-[560px] xl:block 2xl:bottom-[0px] 2xl:right-[6px] 2xl:h-[420px] 2xl:w-[660px]">
              <div className="absolute inset-0 rounded-[44px] bg-[radial-gradient(circle_at_center,rgba(89,147,182,0.16),transparent_68%)] blur-[20px]" />
              <DesktopMatchVersusHero
                localSlug={localCodigo}
                visitanteSlug={visitanteCodigo}
                variant="inline"
                localGoals={golesLocal}
                visitanteGoals={golesVisitante}
              />
            </div>
          </section>
        </section>

        {isResultLocked ? (
          <div className="rounded-2xl border border-[#FAB438]/35 bg-[#FAB438]/12 px-4 py-3 text-sm font-medium text-[#FFE3A1]">
            El partido está en juego. La edición manual del resultado queda
            bloqueada hasta que salga de ese estado.
          </div>
        ) : null}

        <section className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] p-4 text-white shadow-[0_18px_50px_rgba(2,6,23,0.18)]">
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_28%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Estado del partido
              </p>
              <p className="text-sm leading-6 text-white/68">
                Definí primero el estado oficial del encuentro. No tiene sentido
                cargar goles o incidencias si el partido todavía no corresponde a
                ese flujo.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:min-w-[520px] xl:justify-end">
              <div className="min-w-0 flex-1 space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  Estado
                </label>
                <Select
                  value={form.estado}
                  onValueChange={(value) =>
                    updateForm({
                      estado: value as EstadoPartido,
                    })
                  }
                >
                  <SelectTrigger className="h-11 border-white/10 bg-white/[0.08] text-white shadow-none focus-visible:ring-2 focus-visible:ring-[#5993B6]/40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_PARTIDO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!canEditCurrentResult || saving}
                  className="h-11 w-full rounded-xl bg-[#FAB438] px-5 text-[#1E2C46] hover:bg-[#F7C45A] disabled:bg-white/10 disabled:text-white/35 sm:w-auto"
                >
                  {saving ? "Guardando..." : "Guardar estado del partido"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_320px] xl:items-start">
          <div
            className={`space-y-4 ${
              isResultLocked ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <IncidenciasEditor
              localNombre={localNombre}
              visitanteNombre={visitanteNombre}
              plantelLocal={plantelLocal}
              plantelVisitante={plantelVisitante}
              alineacionLocal={form.alineacionLocal}
              alineacionVisitante={form.alineacionVisitante}
              incidencias={form.incidencias}
              onChange={updateIncidencias}
              showTimeline={false}
            />

            <section className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5">
              <div className={DASHBOARD_TOP_LINE}>
                <div className={DASHBOARD_TOP_LINE_INNER} />
                <div className={DASHBOARD_TOP_LINE_SWEEP} />
                <div className={DASHBOARD_TOP_LINE_GLOW} />
                <div className={DASHBOARD_TOP_LINE_HAIR} />
              </div>

              
              <Tabs defaultValue="estadisticas" className="space-y-4">
                <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm">
                  <TabsTrigger
                    value="estadisticas"
                    className="rounded-full border border-white/12 bg-white/8 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/12 data-[state=active]:border-transparent data-[state=active]:!bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:bg-[#4B84A6]"
                  >
                    Estadísticas
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="rounded-full border border-white/12 bg-white/8 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/12 data-[state=active]:border-transparent data-[state=active]:!bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:bg-[#4B84A6]"
                  >
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="estadisticas">
                  <EstadisticasSection
                    localNombre={localNombre}
                    visitanteNombre={visitanteNombre}
                    localBanderaUrl={escudoLocalUrl}
                    visitanteBanderaUrl={escudoVisitanteUrl}
                    estadisticasLocal={form.estadisticasLocal}
                    estadisticasVisitante={form.estadisticasVisitante}
                    importing={importingStats}
                    onImport={handleImportStats}
                    onLocalStatChange={updateLocalStat}
                    onVisitanteStatChange={updateVisitanteStat}
                  />
                </TabsContent>

                <TabsContent value="timeline">
                  <IncidentTimelineCard
                    incidencias={form.incidencias}
                    onRemove={(id) =>
                      updateIncidencias(
                        form.incidencias.filter((incident) => incident.id !== id)
                      )
                    }
                  />
                </TabsContent>
              </Tabs>
            </section>
          </div>

          <div className={isResultLocked ? "pointer-events-none opacity-60" : ""}>
            <MatchIncidentRealSummary
              localNombre={localNombre}
              visitanteNombre={visitanteNombre}
              form={form}
              incidencias={form.incidencias}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={cancel}
            className="rounded-xl border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={!canEditCurrentResult || saving}
            className="rounded-xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]"
          >
            {saving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : null}

            {saving
              ? "Guardando..."
              : resultado
                ? "Actualizar resultado"
                : "Guardar resultado"}
          </Button>
        </div>
      </div>
    </main>
  );
}
