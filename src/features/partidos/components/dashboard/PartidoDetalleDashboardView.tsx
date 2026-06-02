"use client";

import { Activity, CalendarClock, ChevronLeft, Clock3, MapPin, RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlagImage } from "@/components/ui/flag-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesktopMatchVersusHero } from "@/features/partidos/components/dashboard/DesktopMatchVersusHero";
import { PartidoDetalleIncidenciasCard } from "@/features/partidos/components/dashboard/PartidoDetalleIncidenciasCard";
import { PartidoDetalleDashboardLineups } from "@/features/partidos/components/dashboard/PartidoDetalleDashboardLineups";
import type { PartidoDetalleViewModel } from "@/features/partidos/types/partido-detalle.types";
import { TEAM_STAT_DEFINITIONS } from "@/features/partidos/types/fixture-details";
import {
  DASHBOARD_HERO_PATTERN,
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type Props = {
  detalle: PartidoDetalleViewModel;
  autoRefreshEnabled: boolean;
  nextRefreshIn: number;
  isRefreshing: boolean;
  lastRefreshAt: Date | null;
  onBack: () => void;
};

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] text-white shadow-[0_18px_50px_rgba(2,6,23,0.18)] transition-all duration-200 hover:border-[#5993B6]/28 hover:shadow-[0_22px_56px_rgba(2,6,23,0.24)]">
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <CardContent className="relative space-y-4 p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          {title}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}

export function PartidoDetalleDashboardView({
  detalle,
  autoRefreshEnabled,
  nextRefreshIn,
  isRefreshing,
  lastRefreshAt,
  onBack,
}: Props) {
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

          <div>
            <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
                <div className={DASHBOARD_HERO_PATTERN} />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
                <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
                <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
              </div>

              <div className="relative z-10 flex h-full max-w-[100%] min-w-0 flex-col xl:max-w-[68%] 2xl:max-w-[62%]">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                  Ver detalle
                </div>

                <div className="mt-6 space-y-2.5 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Datos del <span className="text-[#5993B6]">encuentro</span>
                  </h1>

                  <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Estadísticas y seguimiento
                  </p>

                  <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                    Revisá el cruce completo, validá estadísticas oficiales y <br />mirá las incidencias del partido.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBack}
                    className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver a partidos
                  </Button>

                  <DetailRefreshChip
                    autoRefreshEnabled={autoRefreshEnabled}
                    isRefreshing={isRefreshing}
                    nextRefreshIn={nextRefreshIn}
                    lastRefreshAt={lastRefreshAt}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-[-4px] right-[0px] z-20 hidden h-[356px] w-[560px] xl:block 2xl:bottom-[0px] 2xl:right-[6px] 2xl:h-[420px] 2xl:w-[660px]">
                <div className="absolute inset-0 rounded-[44px] bg-[radial-gradient(circle_at_center,rgba(89,147,182,0.16),transparent_68%)] blur-[20px]" />
                <DesktopMatchVersusHero
                  localSlug={detalle.local.codigo}
                  visitanteSlug={detalle.visitante.codigo}
                  variant="inline"                  
                  visitanteGoals={detalle.resultado?.golesVisitante}
                  localGoals={detalle.resultado?.golesLocal}
                />


              </div>

            </section>

          </div>
        </section>

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="space-y-6 p-4 md:p-6">

            {/* <div className="border-b border-white/10 pb-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <h1 className="flex items-center gap-2 text-xl font-semibold text-white md:text-2xl">
                      <BarChart3 className="h-6 w-6 shrink-0 text-[#AEEBFF]" />
                      Estadísticas del partido
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                      <span>Alineaciones y estadísticas del partido.</span>
                      <Info className="h-4 w-4 text-white/38" />
                    </div>
                  </div>

                  <Badge className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white hover:bg-white/10">
                    {detalle.estado}
                  </Badge>
                </div>

                <div className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
                  <div className={DASHBOARD_TOP_LINE}>
                    <div className={DASHBOARD_TOP_LINE_INNER} />
                    <div className={DASHBOARD_TOP_LINE_SWEEP} />
                    <div className={DASHBOARD_TOP_LINE_GLOW} />
                    <div className={DASHBOARD_TOP_LINE_HAIR} />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)]" />

                  <div className="relative p-4 md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-white">{detalle.competencia}</span>
                        {detalle.fechaTexto ? (
                          <span className="ml-2 text-white/56">{detalle.fechaTexto}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-4 rounded-[28px] border border-white/10 bg-[#223553] p-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                      <div className="text-center md:text-left">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Local</p>
                        <p className="mt-2 text-2xl font-bold text-white">{detalle.local.nombre}</p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <div className="grid min-w-[72px] place-items-center rounded-3xl bg-white/10 px-4 py-4 text-center text-2xl font-black text-white">
                          {detalle.marcador}
                        </div>
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Visitante</p>
                        <p className="mt-2 text-2xl font-bold text-white">{detalle.visitante.nombre}</p>
                      </div>
                    </div>

                    {partidoInfo ? (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-white/58">
                        {partidoInfo.split(" · ").map((item) => (
                          <Badge
                            key={item}
                            className="rounded-full bg-white/10 text-white hover:bg-white/10"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>  */}

            <Tabs defaultValue="estadisticas" className="space-y-4">
              <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm">
                <TabsTrigger
                  value="estadisticas"
                  className="rounded-full border border-white/12 bg-white/8 px-5 
                  py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white
                   hover:bg-white/12 data-[state=active]:border-transparent 
                   data-[state=active]:!bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:bg-[#4B84A6]"
                >
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger
                  value="alineaciones"
                  className="rounded-full border border-white/12 bg-white/8 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/12 data-[state=active]:border-transparent
                   data-[state=active]:!bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:bg-[#4B84A6]"
                >
                  Alineaciones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estadisticas">
                <div className="space-y-4">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <DashboardCard title="Estadísticas del partido">
                        <div className="space-y-4">
                          <div className="grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] items-center gap-3 rounded-[28px] border border-white/10 bg-[#223553] px-4 py-4 md:px-5">
                            <TeamVsHeader
                              name={detalle.local.nombre}
                              bandera={detalle.local.escudoUrl ?? null}
                              codigo={detalle.local.codigo}
                              align="left"
                            />

                            <div className="text-center">
                              <span className="inline-flex min-w-[72px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3 text-center text-[1.35rem] font-black uppercase tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                VS
                              </span>
                            </div>

                            <TeamVsHeader
                              name={detalle.visitante.nombre}
                              bandera={detalle.visitante.escudoUrl ?? null}
                              codigo={detalle.visitante.codigo}
                              align="right"
                            />
                          </div>

                          {TEAM_STAT_DEFINITIONS.map((stat) => (
                            <div
                              key={stat.key}
                            className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                          >
                            <span className="text-left text-lg font-bold text-white">
                              {detalle.statsLocal[stat.key]}
                              {stat.unit}
                            </span>
                            <span className="text-center text-sm font-semibold text-white/64">
                              {stat.label}
                            </span>
                            <span className="text-right text-lg font-bold text-white">
                              {detalle.statsVisitante[stat.key]}
                              {stat.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DashboardCard>

                    <DashboardCard title="Lectura rapida">
                      <div className="space-y-3">
                        {detalle.fechaTexto ? (
                          <p className="flex items-center gap-2 text-sm text-white/72">
                            <CalendarClock className="h-4 w-4 text-[#AEEBFF]" />
                            {detalle.fechaTexto}
                          </p>
                        ) : null}
                        <p className="flex items-center gap-2 text-sm text-white/72">
                          <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
                          {autoRefreshEnabled
                            ? "El partido esta en juego y se refresca automaticamente"
                            : "Sin refresh automatico por estado del partido"}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-white/72">
                          <Activity className="h-4 w-4 text-[#AEEBFF]" />
                          Partido listo para gestión administrativa
                        </p>
                        <p className="flex items-center gap-2 text-sm text-white/72">
                          <Users className="h-4 w-4 text-[#AEEBFF]" />
                          Alineaciones visibles con incidencias por jugador
                        </p>
                        {detalle.partido.estadio ? (
                          <p className="flex items-center gap-2 text-sm text-white/72">
                            <MapPin className="h-4 w-4 text-[#AEEBFF]" />
                            {detalle.partido.estadio}
                          </p>
                        ) : null}
                      </div>
                    </DashboardCard>
                  </div>

                  <PartidoDetalleIncidenciasCard
                    incidencias={detalle.incidencias ?? []}
                    localNombre={detalle.local.nombre}
                    visitanteNombre={detalle.visitante.nombre}
                  />
                </div>
              </TabsContent>

              <TabsContent value="alineaciones">
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5">
                  <div className={DASHBOARD_TOP_LINE}>
                    <div className={DASHBOARD_TOP_LINE_INNER} />
                    <div className={DASHBOARD_TOP_LINE_SWEEP} />
                    <div className={DASHBOARD_TOP_LINE_GLOW} />
                    <div className={DASHBOARD_TOP_LINE_HAIR} />
                  </div>
                  <div className="mb-6">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                      Alineaciones de los equipos
                    </p>
                    <p className="mt-2 text-sm text-white/68">
                      La cancha replica el enfoque de la vista real: formaciones visibles e incidencias sobre cada jugador.
                    </p>
                  </div>

                  <PartidoDetalleDashboardLineups
                    local={detalle.local}
                    visitante={detalle.visitante}
                    lineupLocal={detalle.lineupLocal}
                    lineupVisitante={detalle.lineupVisitante}
                    incidencias={detalle.incidencias ?? []}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </main>
  );
}

function TeamVsHeader({
  name,
  bandera,
  codigo,
  align,
}: {
  name: string;
  bandera?: string | null;
  codigo?: string | null;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {align === "left" ? (
        <>
          <span className="truncate text-[1.05rem] font-black text-white md:text-[1.15rem]">
            {name}
          </span>
          <FlagImage
            bandera={bandera}
            codigo={codigo}
            nombre={name}
            widthClassName="w-12"
            heightClassName="h-8"
            className="drop-shadow-[0_8px_16px_rgba(2,8,23,0.32)]"
            imageClassName="object-contain"
          />
        </>
      ) : (
        <>
          <FlagImage
            bandera={bandera}
            codigo={codigo}
            nombre={name}
            widthClassName="w-12"
            heightClassName="h-8"
            className="drop-shadow-[0_8px_16px_rgba(2,8,23,0.32)]"
            imageClassName="object-contain"
          />
          <span className="truncate text-[1.05rem] font-black text-white md:text-[1.15rem]">
            {name}
          </span>
        </>
      )}
    </div>
  );
}

function DetailRefreshChip({
  autoRefreshEnabled,
  isRefreshing,
  nextRefreshIn,
  lastRefreshAt,
}: {
  autoRefreshEnabled: boolean;
  isRefreshing: boolean;
  nextRefreshIn: number;
  lastRefreshAt: Date | null;
}) {
  if (!autoRefreshEnabled) {
    return (
      <div className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[#AEEBFF]">
          <Clock3 className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-black leading-none tracking-[0.04em] text-white">
            Inactivo
          </span>
          <span className="mt-1 block text-[11px] font-semibold leading-4 text-white/82">
            auto refresh
          </span>
        </span>
      </div>
    );
  }

  const value = isRefreshing
    ? "Actualizando..."
    : `Actualiza en ${nextRefreshIn}s`;

  const suffix = lastRefreshAt
    ? `ultimo ${lastRefreshAt.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
    : "en tiempo real";

  return (
    <div className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[#AEEBFF]">
        {isRefreshing ? (
          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
        ) : (
          <Clock3 className="h-4.5 w-4.5" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-black leading-none tracking-[0.04em] text-white">
          {value}
        </span>
        <span className="mt-1 block text-[11px] font-semibold leading-4 text-white/82">
          {suffix}
        </span>
      </span>
    </div>
  );
}
