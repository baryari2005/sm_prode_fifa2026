"use client";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bandage,
  Ban,
  BarChart3,
  CalendarClock,
  CircleDot,
  Clock3,
  Goal,
  Info,
  MapPin,
  ShieldCheck,
  Square,
  Trophy,
  Users,
} from "lucide-react";

import { BrandFixtureActionShell } from "@/components/brand/BrandFixtureActionShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type PlayerMarker = {
  nombre: string;
  numero: number;
  x: number;
  y: number;
  goals?: number;
  yellow?: boolean;
  red?: boolean;
};

const estadisticas = [
  { label: "Remates", local: 13, visitante: 8 },
  { label: "Remates al arco", local: 6, visitante: 3 },
  { label: "Posesion", local: "57%", visitante: "43%" },
  { label: "Faltas", local: 11, visitante: 14 },
];

const localPlayers: PlayerMarker[] = [
  { nombre: "M. Turner", numero: 1, x: 50, y: 12 },
  { nombre: "J. Rojas", numero: 4, x: 18, y: 26, yellow: true },
  { nombre: "P. Soto", numero: 2, x: 39, y: 28 },
  { nombre: "M. Vega", numero: 6, x: 61, y: 28, goals: 1 },
  { nombre: "T. Perez", numero: 3, x: 82, y: 26 },
  { nombre: "L. Diaz", numero: 8, x: 28, y: 44 },
  { nombre: "A. Smith", numero: 5, x: 50, y: 46 },
  { nombre: "G. Hale", numero: 10, x: 72, y: 44 },
  { nombre: "N. Cole", numero: 11, x: 22, y: 62 },
  { nombre: "R. White", numero: 9, x: 50, y: 68, goals: 1 },
  { nombre: "K. Moore", numero: 7, x: 78, y: 62 },
];

const visitantePlayers: PlayerMarker[] = [
  { nombre: "A. Hassan", numero: 1, x: 50, y: 88 },
  { nombre: "H. Ali", numero: 4, x: 18, y: 74 },
  { nombre: "K. Musa", numero: 2, x: 39, y: 72 },
  { nombre: "R. Said", numero: 6, x: 61, y: 72, red: true },
  { nombre: "O. Karim", numero: 3, x: 82, y: 74 },
  { nombre: "Y. Noor", numero: 8, x: 28, y: 56 },
  { nombre: "S. Malik", numero: 5, x: 50, y: 54 },
  { nombre: "I. Zaki", numero: 10, x: 72, y: 56 },
  { nombre: "M. Adel", numero: 11, x: 22, y: 38 },
  { nombre: "B. Fathi", numero: 9, x: 50, y: 32, goals: 1 },
  { nombre: "E. Omar", numero: 7, x: 78, y: 38, yellow: true },
];

function DashboardMockCard({
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

function ActionBadges({
  goals = 0,
  yellow,
  red,
}: {
  goals?: number;
  yellow?: boolean;
  red?: boolean;
}) {
  return (
    <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 flex-col gap-1">
      {goals > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/90 px-1 text-[10px] font-black text-slate-900 shadow-sm">
          <CircleDot className="mr-0.5 h-2.5 w-2.5" />
          {goals}
        </span>
      ) : null}
      {yellow ? <span className="flex h-5 w-4 rounded-[3px] bg-yellow-400 shadow-sm" /> : null}
      {red ? <span className="flex h-5 w-4 rounded-[3px] bg-red-500 shadow-sm" /> : null}
    </div>
  );
}

function PitchPlayer({
  player,
  teamTone,
}: {
  player: PlayerMarker;
  teamTone: "sky" | "amber";
}) {
  const toneClass =
    teamTone === "sky"
      ? "bg-[#173A5E] text-[#AEEBFF] ring-white/50"
      : "bg-[#5A4214] text-[#FFE4A3] ring-white/50";

  return (
    <div
      className="absolute z-10 flex w-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <div className="relative">
        <div
          className={`grid h-10 w-10 place-items-center rounded-full text-xs font-black shadow-[0_10px_24px_rgba(15,23,42,0.22)] ring-2 ${toneClass}`}
        >
          {player.numero}
        </div>
        <ActionBadges goals={player.goals} yellow={player.yellow} red={player.red} />
      </div>
      <p className="mt-1 max-w-full truncate text-center text-[10px] font-bold leading-tight text-slate-900">
        {player.nombre}
      </p>
    </div>
  );
}

function PitchLegend() {
  return (
    <DashboardMockCard title="Referencias">
      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-white/76 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4 text-white" />
          <span>Gol</span>
        </div>
        <div className="flex items-center gap-2">
          <Goal className="h-4 w-4 text-rose-300" />
          <span>Gol en contra</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>Amarilla</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="h-4 w-4 fill-red-500 text-red-500" />
          <span>Roja</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <ArrowUp className="h-3 w-3" />
          </span>
          <span>Entra</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <ArrowDown className="h-3 w-3" />
          </span>
          <span>Sale</span>
        </div>
        <div className="flex items-center gap-2">
          <Bandage className="h-4 w-4 text-rose-300" />
          <span>Con lesion</span>
        </div>
        <div className="flex items-center gap-2">
          <Ban className="h-4 w-4 text-rose-300" />
          <span>Con suspension</span>
        </div>
      </div>
    </DashboardMockCard>
  );
}

function LineupPitchMock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_360px] xl:items-start">
        <div className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#86C995] shadow-[0_18px_50px_rgba(2,6,23,0.24)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />

          <div className="relative">
            <div className="flex items-center justify-between border-b border-black/10 bg-black/10 px-4 py-3 text-slate-950">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em]">Nueva Zelanda</p>
                <p className="text-xs font-semibold text-slate-900/70">4-3-3</p>
              </div>
              <Badge className="rounded-full bg-white/80 text-slate-900 hover:bg-white/80">
                Titulares
              </Badge>
            </div>

            <div className="relative h-[740px] overflow-hidden">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-1/2 h-px w-full bg-white/45" />
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 md:h-32 md:w-32" />
                <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55" />
                <div className="absolute left-1/2 top-0 h-[115px] w-[58%] -translate-x-1/2 rounded-b-md border-x border-b border-white/45 md:h-[145px]" />
                <div className="absolute left-1/2 top-0 h-[60px] w-[28%] -translate-x-1/2 rounded-b-md border-x border-b border-white/45 md:h-[78px]" />
                <div className="absolute bottom-0 left-1/2 h-[115px] w-[58%] -translate-x-1/2 rounded-t-md border-x border-t border-white/45 md:h-[145px]" />
                <div className="absolute bottom-0 left-1/2 h-[60px] w-[28%] -translate-x-1/2 rounded-t-md border-x border-t border-white/45 md:h-[78px]" />
              </div>

              {localPlayers.map((player) => (
                <PitchPlayer key={`local-${player.numero}`} player={player} teamTone="sky" />
              ))}
              {visitantePlayers.map((player) => (
                <PitchPlayer key={`away-${player.numero}`} player={player} teamTone="amber" />
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-black/10 bg-black/10 px-4 py-3 text-slate-950">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em]">Egipto</p>
                <p className="text-xs font-semibold text-slate-900/70">4-2-3-1</p>
              </div>
              <Badge className="rounded-full bg-white/80 text-slate-900 hover:bg-white/80">
                Titulares
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DashboardMockCard title="Banco de suplentes">
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-sm font-bold text-white">Nueva Zelanda</p>
                <p className="mt-2 text-sm text-white/70">12. H. Carter · 13. D. Long · 14. F. West · 15. B. Lowe</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-sm font-bold text-white">Egipto</p>
                <p className="mt-2 text-sm text-white/70">12. T. Nabil · 13. Y. Saber · 14. A. Fares · 15. I. Salem</p>
              </div>
            </div>
          </DashboardMockCard>

          <DashboardMockCard title="Cuerpos tecnicos">
            <div className="space-y-3 text-sm text-white/74">
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="font-bold text-white">Nueva Zelanda:</span> T. Harrington
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="font-bold text-white">Egipto:</span> M. Farouk
              </p>
            </div>
          </DashboardMockCard>

          <DashboardMockCard title="Lectura del once">
            <div className="space-y-3 text-sm text-white/74">
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                Nueva Zelanda presiona alto con extremos abiertos y un nueve fijo.
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                Egipto responde con bloque medio y doble pivote para cerrar el centro.
              </p>
            </div>
          </DashboardMockCard>
        </div>
      </div>

      <PitchLegend />
    </div>
  );
}

export function BrandFixtureDetalleMock() {
  return (
    <BrandFixtureActionShell
      eyebrow="Ver detalle"
      title="Estadísticas del"
      accent="partido"
      subtitle="alineaciones, lectura y seguimiento"
      description="Preview de la pantalla pensada para revisar un cruce completo antes de pasar a la carga manual de resultado o de formaciones."
      summaryText="Replica visual de la vista real de detalle con estado, marcador y tabs para lectura rapida."
      metrics={[
        {
          title: "Estado actual",
          detail: "Partido pendiente",
          value: "OK",
          icon: ShieldCheck,
          toneClassName: "text-[#84F0C8]",
          ringClassName: "bg-emerald-400/14",
        },
        {
          title: "Fase",
          detail: "Lectura competitiva",
          value: "GR",
          icon: Trophy,
          toneClassName: "text-[#FFE4A3]",
          ringClassName: "bg-[#FAB438]/14",
        },
        {
          title: "Sede",
          detail: "Ciudad de Mexico",
          value: "MX",
          icon: MapPin,
          toneClassName: "text-[#AEEBFF]",
          ringClassName: "bg-[#5993B6]/18",
        },
      ]}
    >
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="space-y-6 p-4 md:p-6">
          <div className="border-b border-white/10 pb-6">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-white md:text-2xl">
                    <BarChart3 className="h-6 w-6 shrink-0 text-[#AEEBFF]" />
                    Estadísticas del partido
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                    <span>Alineaciones y estadisticas del partido.</span>
                    <Info className="h-4 w-4 text-white/38" />
                    <Badge className="rounded-full bg-[#5993B6]/18 px-3 py-1 text-xs font-medium text-[#AEEBFF] hover:bg-[#5993B6]/18">
                      Auto refresh 18s
                    </Badge>
                  </div>
                </div>

                <Badge className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white hover:bg-white/10">
                  Pendiente
                </Badge>
              </div>

              <div className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)]" />
                <div className="relative p-4 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-white">Mundial 2026</span>
                      <span className="ml-2 text-white/56">viernes, 29 may 2026, 19:00</span>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-[28px] border border-white/10 bg-[#223553] p-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <div className="text-center md:text-left">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Local</p>
                      <p className="mt-2 text-2xl font-bold text-white">Nueva Zelanda</p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
                        0
                      </div>
                      <span className="font-brand text-4xl text-white/42">VS</span>
                      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
                        0
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Visitante</p>
                      <p className="mt-2 text-2xl font-bold text-white">Egipto</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-white/58">
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Fase de grupos</Badge>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Grupo G</Badge>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Jornada 1</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="estadisticas" className="space-y-4">
            <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm">
              <TabsTrigger
                value="estadisticas"
                className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/68 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#008C93] data-[state=active]:to-[#00A6B2] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Estadisticas
              </TabsTrigger>
              <TabsTrigger
                value="alineaciones"
                className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/68 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#008C93] data-[state=active]:to-[#00A6B2] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Alineaciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estadisticas">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <DashboardMockCard title="Estadísticas del partido">
                  <div className="space-y-4">
                    {estadisticas.map((stat) => (
                      <div
                        key={stat.label}
                        className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                      >
                        <span className="text-left text-lg font-bold text-white">{stat.local}</span>
                        <span className="text-center text-sm font-semibold text-white/64">{stat.label}</span>
                        <span className="text-right text-lg font-bold text-white">{stat.visitante}</span>
                      </div>
                    ))}
                  </div>
                </DashboardMockCard>

                <DashboardMockCard title="Lectura rapida">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm text-white/72">
                      <CalendarClock className="h-4 w-4 text-[#AEEBFF]" />
                      Viernes 29 de mayo, 19:00
                    </p>
                    <p className="flex items-center gap-2 text-sm text-white/72">
                      <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
                      Cierre de pronosticos en 5 h 4 min
                    </p>
                    <p className="flex items-center gap-2 text-sm text-white/72">
                      <Activity className="h-4 w-4 text-[#AEEBFF]" />
                      Partido listo para gestión administrativa
                    </p>
                    <p className="flex items-center gap-2 text-sm text-white/72">
                      <Users className="h-4 w-4 text-[#AEEBFF]" />
                      Alineaciones visibles con incidencias por jugador
                    </p>
                  </div>
                </DashboardMockCard>
              </div>
            </TabsContent>

            <TabsContent value="alineaciones">
              <div className="space-y-4">
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

                  <LineupPitchMock />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </BrandFixtureActionShell>
  );
}
