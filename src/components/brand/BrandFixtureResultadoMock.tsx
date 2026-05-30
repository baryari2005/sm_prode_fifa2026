"use client";

import {
  CheckCircle2,
  Goal,
  Info,
  ShieldCheck,
  Timer,
  Zap,
} from "lucide-react";

import { BrandFixtureActionShell } from "@/components/brand/BrandFixtureActionShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

const statsRows = [
  { label: "Remates", local: 14, visitante: 7 },
  { label: "Remates al arco", local: 6, visitante: 2 },
  { label: "Posesion", local: "58%", visitante: "42%" },
  { label: "Corners", local: 5, visitante: 3 },
];

const goalRowsLocal = [
  { minute: "22'", player: "R. White", note: "Definicion cruzada" },
  { minute: "61'", player: "M. Vega", note: "Penal" },
];

const goalRowsAway = [
  { minute: "48'", player: "B. Fathi", note: "Cabezazo" },
];

const localGoalFormRows = [
  { jugador: "R. White", minuto: "22", tipo: "Jugada" },
  { jugador: "M. Vega", minuto: "61", tipo: "Penal" },
];

const awayGoalFormRows = [
  { jugador: "B. Fathi", minuto: "48", tipo: "Cabezazo" },
];

const localPlayersMock = [
  "R. White",
  "M. Vega",
  "L. Sutton",
  "C. Harper",
  "J. Collins",
];

const awayPlayersMock = [
  "B. Fathi",
  "H. Saleh",
  "K. Nabil",
  "O. Tarek",
  "Y. Adel",
];

const alineacionRows = [
  { local: "A. Smith", visitante: "H. Ali" },
  { local: "J. Rojas", visitante: "K. Musa" },
  { local: "P. Soto", visitante: "R. Said" },
];

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

function TeamGoalsPanel({
  title,
  rows,
}: {
  title: string;
  rows: { minute: string; player: string; note: string }[];
}) {
  return (
    <div className="space-y-3 rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-bold text-white">{title}</p>
        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
          {rows.length} goles
        </Badge>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={`${title}-${row.minute}-${row.player}`}
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3"
          >
            <span className="text-sm font-black text-[#AEEBFF]">{row.minute}</span>
            <div>
              <p className="text-sm font-semibold text-white">{row.player}</p>
              <p className="text-xs text-white/60">{row.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalEventMockEditor({
  title,
  rows,
  availablePlayers,
}: {
  title: string;
  rows: { jugador: string; minuto: string; tipo: string }[];
  availablePlayers: string[];
}) {
  return (
    <div className="space-y-3 rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-bold text-white">{title}</p>
        <div className="flex items-center gap-2">
          <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
            {rows.length} eventos
          </Badge>
          <Button
            variant="outline"
            className="h-9 rounded-xl border-white/10 bg-white/[0.06] px-3 text-white hover:bg-white/[0.12]"
          >
            Nuevo gol
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={`${title}-${row.jugador}-${row.minuto}`}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3"
          >
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_96px]">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  Jugador que hizo el gol
                </label>
                <Select defaultValue={row.jugador}>
                  <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={row.jugador}>{row.jugador}</SelectItem>
                    <SelectItem value="Suplente mock">Suplente mock</SelectItem>
                    <SelectItem value="Otro jugador">Otro jugador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  Minuto
                </label>
                <Input
                  value={row.minuto}
                  readOnly
                  className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-center font-semibold text-white"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px]">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  Descripcion
                </label>
                <Input
                  value={row.tipo}
                  readOnly
                  className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-white"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                >
                  Agregar gol
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="grid gap-3 rounded-2xl border border-dashed border-[#AEEBFF]/35 bg-[#5993B6]/8 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
              Cargar nuevo gol
            </p>
            <Badge className="rounded-full bg-[#AEEBFF]/12 text-[#AEEBFF] hover:bg-[#AEEBFF]/12">
              Borrador
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
              Listado de jugadores disponibles
            </label>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              {availablePlayers.map((player) => (
                <button
                  key={`${title}-${player}`}
                  type="button"
                  className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.12]"
                >
                  {player}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_96px]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                Quien hizo el gol
              </label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-white">
                  <SelectValue placeholder="Seleccionar jugador" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.map((player) => (
                    <SelectItem key={player} value={player}>
                      {player}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                Minuto
              </label>
              <Input
                placeholder="Ej. 73"
                readOnly
                className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-center font-semibold text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                Descripcion
              </label>
              <Input
                placeholder="Ej. Definicion, penal o cabezazo"
                readOnly
                className="h-10 rounded-xl border-white/10 bg-white/[0.08] text-white placeholder:text-white/40"
              />
            </div>

            <div className="flex items-end">
              <Button className="h-10 w-full rounded-xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]">
                Confirmar gol
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandFixtureResultadoMock() {
  return (
    <BrandFixtureActionShell
      eyebrow="Gestionar resultado"
      title="Carga manual del"
      accent="resultado"
      subtitle="marcador, estado y control post partido"
      description="Preview de la pantalla real donde el admin define goles, estado y luego ajusta estadisticas o alineaciones antes de guardar."
      summaryText="Replica visual del flujo real de carga manual con resumen editable, tabs y acciones de guardado."
      metrics={[
        {
          title: "Estado actual",
          detail: "Pendiente de carga",
          value: "2-1",
          icon: Goal,
          toneClassName: "text-[#AEEBFF]",
          ringClassName: "bg-[#5993B6]/18",
        },
        {
          title: "Tipo de carga",
          detail: "Resultado oficial",
          value: "OF",
          icon: ShieldCheck,
          toneClassName: "text-[#FFE4A3]",
          ringClassName: "bg-[#FAB438]/14",
        },
        {
          title: "Control",
          detail: "Listo para guardar",
          value: "OK",
          icon: CheckCircle2,
          toneClassName: "text-[#84F0C8]",
          ringClassName: "bg-emerald-400/14",
        },
      ]}
    >
      <section className="rounded-[32px] border border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
        <div className="space-y-6 p-4 md:p-6">
          <div className="border-b border-white/10 pb-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-2">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white md:text-2xl">
                  <Zap className="h-6 w-6 shrink-0 text-[#AEEBFF]" />
                  Carga manual del resultado
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                  <span>Partido: Nueva Zelanda vs Egipto</span>
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                    Fase de grupos
                  </Badge>
                  <Info className="h-4 w-4 text-white/38" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-[#FAB438]/10 px-4 py-3 text-sm font-medium text-[#FFE4A3]">
            El partido esta pendiente. En esta preview se replica el flujo real de carga manual del resultado antes de guardar.
          </div>

          <DashboardCard title="Resumen editable">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] px-4 py-4">
              <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto] 2xl:grid-cols-[minmax(220px,1fr)_auto_minmax(460px,1fr)]">
                <div className="min-w-0 text-sm lg:col-start-1 lg:row-start-1 2xl:col-start-1 2xl:row-start-1">
                  <span className="font-semibold text-white">Mundial 2026</span>
                  <span className="ml-2 text-white/56">viernes, 29 may 2026 · 19:00</span>
                </div>

                <div className="flex min-w-0 flex-wrap items-center justify-center gap-3 lg:col-span-2 lg:row-start-2 2xl:col-span-1 2xl:col-start-2 2xl:row-start-1">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="max-w-[190px] truncate whitespace-nowrap text-lg font-black tracking-tight text-white">
                      Nueva Zelanda
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center justify-center gap-2">
                    <div className="flex h-12 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-3xl font-black text-white shadow-sm">
                      2
                    </div>
                    <span className="text-3xl font-black leading-none tracking-[-0.04em] text-white/70">-</span>
                    <div className="flex h-12 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-3xl font-black text-white shadow-sm">
                      1
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="max-w-[190px] truncate whitespace-nowrap text-lg font-black tracking-tight text-white">
                      Egipto
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-3 lg:col-start-2 lg:row-start-1 lg:justify-end 2xl:col-start-3 2xl:row-start-1">
                  <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap text-xs font-semibold text-white/64">
                      Tiempo de juego
                    </label>
                    <div className="relative">
                      <Timer className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/48" />
                      <Input
                        value="90"
                        readOnly
                        className="h-10 w-24 rounded-xl border-white/10 bg-white/[0.08] pl-9 text-center font-semibold text-white"
                      />
                    </div>
                  </div>

                  <div className="hidden h-8 w-px bg-white/10 sm:block" />

                  <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap text-xs font-semibold text-white/64">
                      Estado
                    </label>
                    <Select defaultValue="finalizado">
                      <SelectTrigger className="h-10 w-40 rounded-xl border-white/10 bg-white/[0.08] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en-juego">En juego</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] 2xl:gap-4">
              <TeamGoalsPanel title="Nueva Zelanda" rows={goalRowsLocal} />
              <div className="hidden bg-gradient-to-b from-transparent via-white/10 to-transparent 2xl:block" />
              <TeamGoalsPanel title="Egipto" rows={goalRowsAway} />
            </div>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] 2xl:gap-4">
              <GoalEventMockEditor
                title="Detalle de goles · Nueva Zelanda"
                rows={localGoalFormRows}
                availablePlayers={localPlayersMock}
              />
              <div className="hidden bg-gradient-to-b from-transparent via-white/10 to-transparent 2xl:block" />
              <GoalEventMockEditor
                title="Detalle de goles · Egipto"
                rows={awayGoalFormRows}
                availablePlayers={awayPlayersMock}
              />
            </div>

            <div className="space-y-2 border-t border-white/10 pt-1">
              <label className="text-sm font-medium text-white">Observaciones</label>
              <div className="min-h-[88px] rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/64">
                Partido controlado sin incidentes mayores. Se confirma resultado oficial y detalle de goles.
              </div>
            </div>
          </DashboardCard>

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
              <DashboardCard title="Estadisticas del equipo">
                <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-3 border-b border-white/10 px-2 pb-4">
                    <div className="text-left text-base font-black text-white">Nueva Zelanda</div>
                    <div className="text-center text-xs font-black uppercase tracking-[0.22em] text-[#AEEBFF]/70">VS</div>
                    <div className="text-right text-base font-black text-white">Egipto</div>
                  </div>

                  {statsRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[minmax(120px,1fr)_220px_minmax(120px,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                    >
                      <div className="mx-auto flex h-11 w-full max-w-[180px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-lg font-bold text-white">
                        {row.local}
                      </div>
                      <div className="text-center text-sm font-semibold text-white/72">{row.label}</div>
                      <div className="mx-auto flex h-11 w-full max-w-[180px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-lg font-bold text-white">
                        {row.visitante}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="alineaciones">
              <DashboardCard title="Alineaciones de los equipos">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="flex h-10 items-center justify-center rounded-xl bg-[#008C93] px-3 text-sm font-semibold text-white shadow-sm"
                      >
                        Nueva Zelanda
                      </button>
                      <button
                        type="button"
                        className="flex h-10 items-center justify-center rounded-xl bg-white/[0.05] px-3 text-sm font-semibold text-white/72"
                      >
                        Egipto
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
                    {alineacionRows.map((row) => (
                      <div
                        key={row.local}
                        className="grid grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                      >
                        <span className="truncate font-semibold text-white">{row.local}</span>
                        <span className="text-center font-brand text-xl text-white/40">VS</span>
                        <span className="truncate text-right font-semibold text-white">{row.visitante}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DashboardCard>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15">
              Cancelar
            </Button>
            <Button className="rounded-2xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]">
              Guardar resultado
            </Button>
          </div>
        </div>
      </section>
    </BrandFixtureActionShell>
  );
}
