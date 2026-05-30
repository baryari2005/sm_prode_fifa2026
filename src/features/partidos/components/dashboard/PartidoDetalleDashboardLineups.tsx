"use client";

import {
  ArrowDown,
  ArrowUp,
  Bandage,
  Ban,
  CircleDot,
  Goal,
  Square,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MatchLineupPitch } from "@/features/partidos/components/detalle/lineups/MatchLineupPitch";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";
import type { MatchIncident, TeamLineup } from "@/features/partidos/types/fixture-details";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type Props = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
  incidencias: MatchIncident[];
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

function LegendCard() {
  return (
    <DashboardCard title="Referencias">
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
    </DashboardCard>
  );
}

function BenchBlock({
  title,
  players,
}: {
  title: string;
  players: TeamLineup["suplentes"];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-sm font-bold text-white">{title}</p>
      {players.length === 0 ? (
        <p className="mt-2 text-sm text-white/60">No hay suplentes cargados.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {players.slice(0, 6).map((player) => (
            <p key={player.jugadorId} className="text-sm text-white/72">
              {player.numero ? `${player.numero}. ` : ""}
              {player.nombre}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function PartidoDetalleDashboardLineups({
  local,
  visitante,
  lineupLocal,
  lineupVisitante,
  incidencias,
}: Props) {
  const summaryLocal = summarizeTeam(lineupLocal);
  const summaryVisitante = summarizeTeam(lineupVisitante);
  const incidenciasLocal = incidencias
    .filter((incident) => incident.equipo === "local")
    .slice()
    .sort((a, b) => a.minuto - b.minuto)
    .slice(-4)
    .reverse();
  const incidenciasVisitante = incidencias
    .filter((incident) => incident.equipo === "visitante")
    .slice()
    .sort((a, b) => a.minuto - b.minuto)
    .slice(-4)
    .reverse();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_360px] xl:items-start">
        <div>
          <MatchLineupPitch
            local={local}
            visitante={visitante}
            lineupLocal={lineupLocal}
            lineupVisitante={lineupVisitante}
            incidencias={incidencias}
            summaryLocal={summaryLocal}
            summaryVisitante={summaryVisitante}
          />
        </div>

        <div className="space-y-4">
          <DashboardCard title="Banco de suplentes">
            <div className="space-y-3">
              <BenchBlock title={local.nombre} players={lineupLocal.suplentes} />
              <BenchBlock title={visitante.nombre} players={lineupVisitante.suplentes} />
            </div>
          </DashboardCard>

          <DashboardCard title="Cuerpos tecnicos">
            <div className="space-y-3 text-sm text-white/74">
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="font-bold text-white">{local.nombre}:</span>{" "}
                {lineupLocal.entrenador || "Sin cargar"}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="font-bold text-white">{visitante.nombre}:</span>{" "}
                {lineupVisitante.entrenador || "Sin cargar"}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Lectura del once">
            <div className="space-y-3 text-sm text-white/74">
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                {local.nombre} sale con {lineupLocal.formacion || "formacion sin definir"} y
                mantiene la iniciativa del bloque alto.
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                {visitante.nombre} responde con {lineupVisitante.formacion || "formacion sin definir"} y
                busca cerrar el carril central.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Incidencias por equipo">
            <div className="space-y-4">
              <IncidentTeamBlock teamName={local.nombre} incidents={incidenciasLocal} />
              <IncidentTeamBlock teamName={visitante.nombre} incidents={incidenciasVisitante} />
            </div>
          </DashboardCard>
        </div>
      </div>

      <LegendCard />
    </div>
  );
}

function summarizeTeam(lineup: TeamLineup) {
  const allPlayers = [...lineup.titulares, ...lineup.suplentes];

  return allPlayers.reduce(
    (acc, player) => ({
      goals: acc.goals + (player.goals ?? 0),
      yellowCards: acc.yellowCards + (player.yellow ? 1 : 0),
      redCards: acc.redCards + (player.red ? 1 : 0),
      substitutions: acc.substitutions + (player.substituted ? 1 : 0),
    }),
    {
      goals: 0,
      yellowCards: 0,
      redCards: 0,
      substitutions: 0,
    }
  );
}

function IncidentTeamBlock({
  teamName,
  incidents,
}: {
  teamName: string;
  incidents: MatchIncident[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-sm font-bold text-white">{teamName}</p>
      {incidents.length === 0 ? (
        <p className="mt-2 text-sm text-white/60">Sin incidencias recientes.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-white/74"
            >
              <p className="font-semibold text-white">
                {incident.minuto}&apos; · {labelForIncident(incident)}
              </p>
              <p className="mt-1 text-white/64">
                {incident.tipo === "cambio"
                  ? `Sale ${incident.jugadorSaleNombre ?? "Jugador"} / Entra ${incident.jugadorEntraNombre ?? "Jugador"}`
                  : incident.jugadorNombre ?? incident.descripcion ?? "Evento registrado"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function labelForIncident(incident: MatchIncident) {
  switch (incident.tipo) {
    case "gol":
      return "Gol";
    case "tarjeta_amarilla":
      return "Amarilla";
    case "tarjeta_roja":
      return "Roja";
    case "cambio":
      return "Cambio";
    case "lesion":
      return "Lesion";
    case "penal":
      return "Penal";
    case "var":
      return "VAR";
    default:
      return "Incidencia";
  }
}
