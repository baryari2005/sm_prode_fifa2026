"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Save,
  ShieldCheck,
  Shirt,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";

import { BrandFixtureActionShell } from "@/components/brand/BrandFixtureActionShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

const localTitulares = [
  { nombre: "A. Smith", dorsal: 1, top: "10%", left: "46%" },
  { nombre: "J. Rojas", dorsal: 4, top: "27%", left: "20%" },
  { nombre: "P. Soto", dorsal: 2, top: "27%", left: "45%" },
  { nombre: "M. Vega", dorsal: 5, top: "27%", left: "70%" },
  { nombre: "T. Perez", dorsal: 3, top: "44%", left: "15%" },
  { nombre: "L. Sutton", dorsal: 8, top: "44%", left: "35%" },
  { nombre: "C. Harper", dorsal: 6, top: "44%", left: "56%" },
  { nombre: "J. Collins", dorsal: 11, top: "44%", left: "76%" },
  { nombre: "R. White", dorsal: 7, top: "68%", left: "24%" },
  { nombre: "B. Lane", dorsal: 9, top: "68%", left: "46%" },
  { nombre: "E. Grant", dorsal: 10, top: "68%", left: "68%" },
];

const visitanteTitulares = [
  { nombre: "H. Ali", dorsal: 1, top: "10%", left: "46%" },
  { nombre: "K. Musa", dorsal: 2, top: "26%", left: "22%" },
  { nombre: "R. Said", dorsal: 5, top: "26%", left: "46%" },
  { nombre: "O. Karim", dorsal: 4, top: "26%", left: "70%" },
  { nombre: "Y. Noor", dorsal: 3, top: "42%", left: "18%" },
  { nombre: "B. Fathi", dorsal: 6, top: "42%", left: "36%" },
  { nombre: "N. Salem", dorsal: 8, top: "42%", left: "56%" },
  { nombre: "T. Adel", dorsal: 11, top: "42%", left: "75%" },
  { nombre: "M. Ezzat", dorsal: 10, top: "67%", left: "28%" },
  { nombre: "A. Farouk", dorsal: 9, top: "67%", left: "48%" },
  { nombre: "S. Nabil", dorsal: 7, top: "67%", left: "68%" },
];

const localSuplentes = ["D. Moore", "S. Quinn", "F. Young", "I. Brooks", "K. Price"];
const visitanteSuplentes = ["P. Hassan", "W. Omar", "I. Sayed", "G. Tarek", "L. Nader"];
const localDisponibles = ["M. Turner", "G. Hall", "N. Cole", "S. Walsh", "R. Dixon"];
const visitanteDisponibles = ["F. Mostafa", "C. Hamdy", "E. Lotfy", "M. Gaber", "Z. Sherif"];

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={`${DASHBOARD_SUBCARD} rounded-[22px] p-3`}>
      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
        {label}
      </label>
      <Input
        value={value}
        readOnly
        className="mt-2 h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"
      />
    </div>
  );
}

function PitchMock({
  players,
}: {
  players: { nombre: string; dorsal: number; top: string; left: string }[];
}) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#5FB764_0%,#56A95B_34%,#4B9851_68%,#438747_100%)]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_66px,rgba(0,0,0,0.03)_66px,rgba(0,0,0,0.03)_132px)] opacity-50" />
      <div className="absolute inset-[14px] rounded-[22px] border border-white/40" />
      <div className="absolute left-[14px] right-[14px] top-1/2 h-px bg-white/45" />
      <div className="absolute left-1/2 top-1/2 h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
      <div className="absolute left-1/2 top-[14px] h-[15%] w-[54%] -translate-x-1/2 border-x border-b border-white/40" />
      <div className="absolute bottom-[14px] left-1/2 h-[15%] w-[54%] -translate-x-1/2 border-x border-t border-white/40" />

      {players.map((player) => (
        <div
          key={player.nombre}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: player.top, left: player.left }}
        >
          <div className="flex w-[92px] flex-col items-center">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-[#1E2C46]/85 text-sm font-black text-[#AEEBFF] shadow-[0_14px_28px_rgba(2,8,23,0.28)]">
              {player.dorsal}
            </div>
            <p className="mt-1 text-center text-[11px] font-bold leading-4 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              {player.nombre}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListPanel({
  players,
  title,
}: {
  players: string[];
  title: string;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
          {title}
        </p>
        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
          {players.length}
        </Badge>
      </div>

      <div className="space-y-2.5">
        {players.map((player, index) => (
          <div
            key={`${title}-${player}`}
            className={`${DASHBOARD_SUBCARD} flex items-center justify-between gap-3 rounded-[18px] px-3 py-3`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/16 text-[#AEEBFF]">
                <Shirt className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{player}</p>
                <p className="text-xs text-white/58">
                  {title === "Titulares" ? `Titular #${index + 1}` : "Disponible en banco"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="h-9 rounded-xl border-white/10 bg-white/[0.06] px-3 text-white hover:bg-white/[0.12]"
            >
              Editar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentMock({
  teamName,
  availablePlayers,
  titularSuggestion,
  benchSuggestion,
}: {
  teamName: string;
  availablePlayers: string[];
  titularSuggestion: string;
  benchSuggestion: string;
}) {
  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Asignacion desde plantel
          </p>
          <p className="mt-1 text-sm text-white/68">
            Mock visual del flujo para pasar jugadores disponibles a titulares o suplentes.
          </p>
        </div>
        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
          Plantel {teamName}
        </Badge>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
          Jugadores disponibles
        </label>
        <div className="flex flex-wrap gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
          {availablePlayers.map((player) => (
            <button
              key={`${teamName}-${player}`}
              type="button"
              className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.12]"
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className={`${DASHBOARD_SUBCARD} rounded-[22px] p-3`}>
          <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Agregar titular
          </label>
          <Select defaultValue={titularSuggestion}>
            <SelectTrigger className="mt-2 h-11 rounded-xl border-white/10 bg-white/[0.08] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePlayers.map((player) => (
                <SelectItem key={`${teamName}-starter-${player}`} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="mt-3 h-10 w-full rounded-xl bg-[#5993B6] text-white hover:bg-[#4B84A6]">
            Pasar a titulares
          </Button>
        </div>

        <div className={`${DASHBOARD_SUBCARD} rounded-[22px] p-3`}>
          <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Agregar suplente
          </label>
          <Select defaultValue={benchSuggestion}>
            <SelectTrigger className="mt-2 h-11 rounded-xl border-white/10 bg-white/[0.08] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePlayers.map((player) => (
                <SelectItem key={`${teamName}-bench-${player}`} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="mt-3 h-10 w-full rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
          >
            Pasar a suplentes
          </Button>
        </div>
      </div>
    </div>
  );
}

function TeamEditorMock({
  title,
  formacion,
  entrenador,
  previousLabel,
  titulares,
  suplentes,
  availablePlayers,
  titularSuggestion,
  benchSuggestion,
  accent,
}: {
  title: string;
  formacion: string;
  entrenador: string;
  previousLabel: string;
  titulares: { nombre: string; dorsal: number; top: string; left: string }[];
  suplentes: string[];
  availablePlayers: string[];
  titularSuggestion: string;
  benchSuggestion: string;
  accent: string;
}) {
  return (
    <section className={`${DASHBOARD_PANEL} rounded-[30px] p-4 md:p-5`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[1.25rem] font-black text-white">{title}</p>
            <p className="mt-1 text-sm text-white/64">
              Titulares, suplentes y base reutilizable
            </p>
          </div>
          <Badge className={`rounded-full border-0 ${accent} px-3 py-1 text-white hover:${accent}`}>
            {titulares.length} titulares
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Formacion" value={formacion} />
          <Field label="Entrenador" value={entrenador} />
        </div>

        <div className="rounded-[22px] border border-dashed border-[#AEEBFF]/30 bg-[#5993B6]/10 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                Ultima base reutilizable
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{previousLabel}</p>
            </div>
            <Button className="rounded-xl bg-white/12 text-white hover:bg-white/16">
              <Sparkles className="mr-2 h-4 w-4" />
              Aplicar base
            </Button>
          </div>
        </div>

        <AssignmentMock
          teamName={title}
          availablePlayers={availablePlayers}
          titularSuggestion={titularSuggestion}
          benchSuggestion={benchSuggestion}
        />

        <Tabs defaultValue="cancha" className="space-y-4">
          <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm">
            <TabsTrigger
              value="cancha"
              className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/68 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white"
            >
              Cancha
            </TabsTrigger>
            <TabsTrigger
              value="titulares"
              className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/68 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white"
            >
              Titulares
            </TabsTrigger>
            <TabsTrigger
              value="suplentes"
              className="rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/68 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white"
            >
              Suplentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cancha" className="mt-0 space-y-4">
            <PitchMock players={titulares} />
          </TabsContent>

          <TabsContent value="titulares" className="mt-0">
            <ListPanel
              title="Titulares"
              players={titulares.map((player) => player.nombre)}
            />
          </TabsContent>

          <TabsContent value="suplentes" className="mt-0">
            <ListPanel title="Suplentes" players={suplentes} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export function BrandFixtureFormacionesMock() {
  return (
    <BrandFixtureActionShell
      eyebrow="Gestionar formaciones"
      title="Carga visual de"
      accent="alineaciones"
      subtitle="titulares, suplentes y base previa"
      description="Mock del flujo administrativo para definir formaciones por partido, reutilizar una base anterior y validar rapidamente la cancha antes de guardar."
      summaryText="Replica visual de la carga de formaciones con dos equipos en paralelo, base reutilizable y cierre operativo."
      metrics={[
        {
          title: "Equipo local",
          detail: "Jugadores visibles",
          value: "11",
          icon: Users,
          toneClassName: "text-[#AEEBFF]",
          ringClassName: "bg-[#5993B6]/18",
        },
        {
          title: "Equipo visitante",
          detail: "Jugadores visibles",
          value: "11",
          icon: UsersRound,
          toneClassName: "text-[#FFE4A3]",
          ringClassName: "bg-[#FAB438]/14",
        },
        {
          title: "Control",
          detail: "Listo para confirmar",
          value: "OK",
          icon: ShieldCheck,
          toneClassName: "text-[#84F0C8]",
          ringClassName: "bg-emerald-400/14",
        },
      ]}
    >
      <section className="rounded-[32px] border border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
        <div className="space-y-6 p-4 md:p-6">
          <div className="border-b border-white/10 pb-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al partido
                </Button>
                <div>
                  <h2 className="text-xl font-semibold text-white md:text-2xl">
                    Cargar formaciones
                  </h2>
                  <p className="mt-1 text-sm text-white/68">
                    Nueva Zelanda vs Egipto
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Link href="/brand-preview/fixture/ver-detalle">Ver detalle</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Link href="/brand-preview/fixture/gestionar-resultado">
                    Gestionar resultado
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  Plantel Nueva Zelanda
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  Plantel Egipto
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#AEEBFF]/18 bg-[#5993B6]/10 px-4 py-3 text-sm text-white/82">
            Partido pendiente. La preview muestra la edicion habilitada y el flujo de reutilizacion de una base anterior para ambos equipos.
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <TeamEditorMock
              title="Nueva Zelanda"
              formacion="4-3-3"
              entrenador="A. Robinson"
              previousLabel="Nueva Zelanda vs Belgica · 03/06/2026"
              titulares={localTitulares}
              suplentes={localSuplentes}
              availablePlayers={localDisponibles}
              titularSuggestion="M. Turner"
              benchSuggestion="G. Hall"
              accent="bg-[#5993B6]"
            />
            <TeamEditorMock
              title="Egipto"
              formacion="4-2-3-1"
              entrenador="H. El-Sayed"
              previousLabel="Egipto vs Iran · 03/06/2026"
              titulares={visitanteTitulares}
              suplentes={visitanteSuplentes}
              availablePlayers={visitanteDisponibles}
              titularSuggestion="F. Mostafa"
              benchSuggestion="C. Hamdy"
              accent="bg-[#FAB438]/80"
            />
          </div>

          <div className={`${DASHBOARD_PANEL} rounded-[30px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
              <div className="space-y-3">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Cierre del flujo
                </p>
                <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-base font-bold text-white">
                        Checklist previo a guardar
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-white/68">
                        <li>11 titulares por seleccion.</li>
                        <li>Suplentes listos para incidencias y resultado.</li>
                        <li>Formacion y entrenador visibles en la cancha.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 xl:items-end">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  Cancelar
                </Button>
                <Button className="rounded-2xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar formaciones
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BrandFixtureActionShell>
  );
}
