import { useMemo } from "react";

import type {
  MatchIncident,
  TeamLineup,
} from "@/features/partidos/types/fixture-details";
import type { PartidoDetalleEquipo } from "@/features/partidos/types/partido-detalle.types";
import { getMatchLineupPositions } from "@/features/partidos/lib/match-lineup-layout";

import { LineupTeamBar } from "./LineupTeamBar";
import { LineupPlayerMarker } from "./LineupPlayerMarker";

type MatchLineupPitchProps = {
  local: PartidoDetalleEquipo;
  visitante: PartidoDetalleEquipo;
  lineupLocal: TeamLineup;
  lineupVisitante: TeamLineup;
  incidencias?: MatchIncident[];
  summaryLocal?: {
    goals: number;
    yellowCards: number;
    redCards: number;
    substitutions: number;
  };
  summaryVisitante?: {
    goals: number;
    yellowCards: number;
    redCards: number;
    substitutions: number;
  };
};

const GRASS_TEXTURE_URL = "/ui/cesped.png";

function PitchMarkings() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Contorno interior de la cancha */}
      <div className="absolute inset-[12px] rounded-[1.25rem] border !border-white shadow-[0_0_10px_rgba(255,255,255,0.12)]" />

      {/* Línea media */}
      <div className="absolute left-[12px] right-[12px] top-1/2 h-[1.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.18)]" />

      {/* Círculo central */}
      <div className="absolute left-1/2 top-1/2 h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full border !border-white shadow-[0_0_10px_rgba(255,255,255,0.12)] md:h-[124px] md:w-[124px]" />

      {/* Punto central */}
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full !bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />

      {/* Área grande superior */}
      <div className="absolute left-1/2 top-[12px] h-[15%] w-[58%] -translate-x-1/2 border-x border-b !border-white shadow-[0_0_8px_rgba(255,255,255,0.08)]" />

      {/* Área chica superior */}
      <div className="absolute left-1/2 top-[12px] h-[7.8%] w-[28%] -translate-x-1/2 border-x border-b !border-white shadow-[0_0_8px_rgba(255,255,255,0.08)]" />

      {/* Punto penal superior */}
      <div className="absolute left-1/2 top-[11.2%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full !bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />

      {/* Semicírculo superior */}
      {/* <div className="absolute left-1/2 top-[11.3%] h-[48px] w-[118px] -translate-x-1/2 overflow-hidden md:h-[58px] md:w-[136px]">
        <div className="absolute left-1/2 top-[-66px] h-[132px] w-[132px] -translate-x-1/2 rounded-full border border-white md:top-[-72px] md:h-[144px] md:w-[144px]" />
      </div> */}

      {/* Área grande inferior */}
      <div className="absolute bottom-[12px] left-1/2 h-[15%] w-[58%] -translate-x-1/2 border-x border-t !border-white shadow-[0_0_8px_rgba(255,255,255,0.08)]" />

      {/* Área chica inferior */}
      <div className="absolute bottom-[12px] left-1/2 h-[7.8%] w-[28%] -translate-x-1/2 border-x border-t !border-white shadow-[0_0_8px_rgba(255,255,255,0.08)]" />

      {/* Punto penal inferior */}
      <div className="absolute bottom-[11.2%] left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full !bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />

      {/* Semicírculo inferior */}
      {/* <div className="absolute bottom-[11.3%] left-1/2 h-[48px] w-[118px] -translate-x-1/2 overflow-hidden md:h-[58px] md:w-[136px]">
        <div className="absolute bottom-[-66px] left-1/2 h-[132px] w-[132px] -translate-x-1/2 rounded-full border border-white/55 md:bottom-[-72px] md:h-[144px] md:w-[144px]" />
      </div> */}

      {/* Arcos de esquina */}
      <div className="absolute left-[12px] top-[12px] h-6 w-6 rounded-br-full border-b border-r !border-white" />
      <div className="absolute right-[12px] top-[12px] h-6 w-6 rounded-bl-full border-b border-l !border-white" />
      <div className="absolute bottom-[12px] left-[12px] h-6 w-6 rounded-tr-full border-r border-t !border-white" />
      <div className="absolute bottom-[12px] right-[12px] h-6 w-6 rounded-tl-full border-l border-t !border-white" />
    </div>
  );
}

export function MatchLineupPitch({
  local,
  visitante,
  lineupLocal,
  lineupVisitante,
  incidencias = [],
  summaryLocal,
  summaryVisitante,
}: MatchLineupPitchProps) {
  const playerIncidences = useMemo(() => {
    const map = new Map<
      string,
      {
        goals: number;
        yellow: boolean;
        red: boolean;
        injured: boolean;
        injuryMinute?: number | null;
        substituted: boolean;
        substitutionMinute?: number | null;
      }
    >();

    function ensurePlayer(playerId: string) {
      const existing = map.get(playerId);
      if (existing) return existing;

      const initial = {
        goals: 0,
        yellow: false,
        red: false,
        injured: false,
        injuryMinute: null,
        substituted: false,
        substitutionMinute: null,
      };

      map.set(playerId, initial);
      return initial;
    }

    for (const incident of incidencias) {
      if (incident.tipo === "gol" && incident.jugadorId) {
        const player = ensurePlayer(incident.jugadorId);
        player.goals += 1;
      }

      if (incident.tipo === "tarjeta_amarilla" && incident.jugadorId) {
        const player = ensurePlayer(incident.jugadorId);
        player.yellow = true;
      }

      if (incident.tipo === "tarjeta_roja" && incident.jugadorId) {
        const player = ensurePlayer(incident.jugadorId);
        player.red = true;
      }

      if (incident.tipo === "lesion" && incident.jugadorId) {
        const player = ensurePlayer(incident.jugadorId);
        player.injured = true;
        player.injuryMinute = incident.minuto;
      }

      if (incident.tipo === "cambio" && incident.jugadorSaleId) {
        const player = ensurePlayer(incident.jugadorSaleId);
        player.substituted = true;
        player.substitutionMinute = incident.minuto;
      }
    }

    return map;
  }, [incidencias]);

  const localPlayers = useMemo(
    () =>
      getMatchLineupPositions(
        lineupLocal.titulares,
        "local",
        lineupLocal.formacion
      ).map((player) => {
        const incident = playerIncidences.get(player.jugadorId);

        return {
          ...player,
          goals: Math.max(player.goals ?? 0, incident?.goals ?? 0),
          yellow: player.yellow || Boolean(incident?.yellow),
          red: player.red || Boolean(incident?.red),
          substituted: player.substituted || Boolean(incident?.substituted),
          injured: Boolean(incident?.injured),
          injuryMinute: incident?.injuryMinute ?? null,
          substitutionMinute: incident?.substitutionMinute ?? null,
        };
      }),
    [lineupLocal.formacion, lineupLocal.titulares, playerIncidences]
  );

  const visitantePlayers = useMemo(
    () =>
      getMatchLineupPositions(
        lineupVisitante.titulares,
        "visitante",
        lineupVisitante.formacion
      ).map((player) => {
        const incident = playerIncidences.get(player.jugadorId);

        return {
          ...player,
          goals: Math.max(player.goals ?? 0, incident?.goals ?? 0),
          yellow: player.yellow || Boolean(incident?.yellow),
          red: player.red || Boolean(incident?.red),
          substituted: player.substituted || Boolean(incident?.substituted),
          injured: Boolean(incident?.injured),
          injuryMinute: incident?.injuryMinute ?? null,
          substitutionMinute: incident?.substitutionMinute ?? null,
        };
      }),
    [lineupVisitante.formacion, lineupVisitante.titulares, playerIncidences]
  );

  const hasPlayers = localPlayers.length > 0 || visitantePlayers.length > 0;

  return (
    <section className="group relative mx-auto max-w-[820px] overflow-hidden rounded-[1.9rem] border border-white/12 bg-[#11243D] shadow-[0_24px_60px_rgba(2,8,23,0.38)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7DD3FC]/30 hover:shadow-[0_30px_70px_rgba(2,8,23,0.48)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#AEEBFF]/70 to-transparent" />

      <div className="relative">
        <LineupTeamBar
          equipo={local}
          formacion={lineupLocal.formacion}
          summary={summaryLocal}
          position="top"
        />

        <div className="relative h-[820px] overflow-hidden text-slate-950 sm:h-[900px] md:h-[980px]">
          {/* Base oscura del césped */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#4F9A53_0%,#448D49_32%,#367A3E_68%,#2F6837_100%)]" />

          {/* Textura real de césped */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.42] mix-blend-soft-light"
            style={{
              backgroundImage: `url('${GRASS_TEXTURE_URL}')`,
            }}
          />

          {/* Franjas tipo corte de cancha */}
          <div className="absolute inset-0 opacity-45 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_88px,rgba(0,0,0,0.055)_88px,rgba(0,0,0,0.055)_176px)]" />

          {/* Profundidad vertical */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_18%,transparent_72%,rgba(0,0,0,0.18)_100%)]" />

          {/* Luz central suave */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_48%,rgba(0,0,0,0.16)_100%)]" />

          {/* Tinte verde para unificar textura + diseño */}
          <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />

          {/* Marcas de la cancha */}
          <PitchMarkings />

          {!hasPlayers ? (
            <div className="relative z-10 flex h-full items-center justify-center px-6">
              <div className="rounded-[24px] border border-white/12 bg-slate-950/58 px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                Todavía no hay alineación disponible para este partido.
              </div>
            </div>
          ) : (
            <>
              {localPlayers.map((player, index) => (
                <LineupPlayerMarker
                  key={`local-${player.jugadorId}-${index}`}
                  player={player}
                  teamCode={local.codigo}
                  teamName={local.nombre}
                />
              ))}

              {visitantePlayers.map((player, index) => (
                <LineupPlayerMarker
                  key={`visitante-${player.jugadorId}-${index}`}
                  player={player}
                  teamCode={visitante.codigo}
                  teamName={visitante.nombre}
                />
              ))}
            </>
          )}
        </div>

        <LineupTeamBar
          equipo={visitante}
          formacion={lineupVisitante.formacion}
          summary={summaryVisitante}
          position="bottom"
        />
      </div>
    </section>
  );
}
