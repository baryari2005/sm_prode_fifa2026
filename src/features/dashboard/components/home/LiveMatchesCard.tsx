"use client";

import { format } from "date-fns";
import { CalendarDays, ChevronRight, Clock3, Radio } from "lucide-react";

import { FlagImage } from "@/components/ui/flag-image";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import {
  getMatchStatusMeta,
  getPredictionCountdownLabel,
  type PartidoConRelaciones,
  PREDICTION_CLOSE_MINUTES_BEFORE,
} from "@/features/partidos/utils/partidos-ui.helpers";

type LiveMatchesCardProps = {
  partidosEnJuego: PartidoConRelaciones[];
  proximosPartidos: PartidoConRelaciones[];
  now: number;
  actionLabel: string | null;
  canGoFixture: boolean;
  canOpenPartido: boolean;
  onGoPartido: (partidoId: string) => void;
  onGoFixture: () => void;
};

export function LiveMatchesCard({
  partidosEnJuego,
  proximosPartidos,
  now,
  actionLabel,
  canGoFixture,
  canOpenPartido,
  onGoPartido,
  onGoFixture,
}: LiveMatchesCardProps) {
  const showingLive = partidosEnJuego.length > 0;
  const rows = (showingLive ? partidosEnJuego : proximosPartidos).slice(0, 3);
  const nextPredictionClose = proximosPartidos[0] ?? null;

  return (
    <article className={DASHBOARD_PANEL}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/16 text-emerald-200">
            {showingLive ? (
              <Radio className="h-5 w-5" />
            ) : (
              <CalendarDays className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              {showingLive ? "Partidos en juego" : "Próximos partidos"}
            </p>
            <h2 className="brand-heading text-lg font-black !tracking-[0.04em] text-white xl:text-xl">
              {showingLive
                ? "Seguimiento en tiempo real"
                : "Cargá tus pronósticos a tiempo"}
            </h2>
          </div>
        </div>

        {actionLabel && canGoFixture ? (
          <button
            type="button"
            onClick={onGoFixture}
            className="inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-black text-white/62 transition hover:text-white"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/14 bg-white/[0.04] px-4 py-10 text-center text-sm font-semibold text-white/60">
            No hay partidos en juego ni encuentros próximos para mostrar ahora.
          </div>
        ) : showingLive ? (
          rows.map((partido) => (
            <LiveMatchRow
              key={partido.id}
              partido={partido}
              canOpen={canOpenPartido}
              onClick={() => onGoPartido(partido.id)}
            />
          ))
        ) : (
          rows.map((partido) => (
            <UpcomingMatchRow
              key={partido.id}
              partido={partido}
              now={now}
              canOpen={canOpenPartido}
              onClick={() => onGoPartido(partido.id)}
            />
          ))
        )}
      </div>

      {nextPredictionClose ? (
        <div className="mt-4 flex flex-col gap-2 rounded-[22px] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white/82 sm:flex-row sm:items-center sm:justify-between">
          <span className="min-w-0">
            Próximo cierre de pronósticos:{" "}
            <span className="font-black">
              {nextPredictionClose.seleccionLocal?.nombre ?? "Local"} vs{" "}
              {nextPredictionClose.seleccionVisitante?.nombre ?? "Visitante"}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FAB438]/14 px-3 py-1 font-black text-[#FFE4A3]">
            <Clock3 className="h-4 w-4" />
            {getPredictionCountdownLabel(
              nextPredictionClose.fecha,
              PREDICTION_CLOSE_MINUTES_BEFORE,
              now,
            )}
          </span>
        </div>
      ) : null}
    </article>
  );
}

function LiveMatchRow({
  partido,
  canOpen,
  onClick,
}: {
  partido: PartidoConRelaciones;
  canOpen: boolean;
  onClick: () => void;
}) {
  const status = getMatchStatusMeta(partido);
  const resultado = partido.resultado;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canOpen}
      className={`group flex w-full items-center gap-3 rounded-[24px] px-4 py-4 text-left ${DASHBOARD_SUBCARD} ${
        canOpen ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
        <MatchFlags
          local={{
            bandera: partido.seleccionLocal?.bandera,
            codigo: partido.seleccionLocal?.codigo,
            nombre: partido.seleccionLocal?.nombre ?? "Local",
          }}
          visitante={{
            bandera: partido.seleccionVisitante?.bandera,
            codigo: partido.seleccionVisitante?.codigo,
            nombre: partido.seleccionVisitante?.nombre ?? "Visitante",
          }}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">
            {partido.seleccionLocal?.nombre ?? "Local"} vs{" "}
            {partido.seleccionVisitante?.nombre ?? "Visitante"}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-white/60">
            {partido.fase?.nombre ?? "Sin fase"} ·{" "}
            {resultado?.tiempoJuego ? `${resultado.tiempoJuego}'` : status.label}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 items-end gap-3 md:flex">
        <span className="brand-heading text-lg font-black tracking-[0.02em] text-white xl:text-xl">
          {resultado
            ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
            : "0 - 0"}
        </span>
        <span className="whitespace-nowrap rounded-full bg-emerald-400/16 px-2.5 py-1 text-[11px] font-black text-emerald-200">
          EN VIVO
        </span>
      </div>

      {canOpen ? (
        <ChevronRight className="h-4 w-4 shrink-0 text-[#5993B6] transition group-hover:translate-x-0.5 group-hover:text-[#AEEBFF]" />
      ) : null}
    </button>
  );
}

function UpcomingMatchRow({
  partido,
  now,
  canOpen,
  onClick,
}: {
  partido: PartidoConRelaciones;
  now: number;
  canOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canOpen}
      className={`group flex w-full items-center gap-3 rounded-[24px] px-4 py-4 text-left ${DASHBOARD_SUBCARD} ${
        canOpen ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
        <MatchFlags
          local={{
            bandera: partido.seleccionLocal?.bandera,
            codigo: partido.seleccionLocal?.codigo,
            nombre: partido.seleccionLocal?.nombre ?? "Local",
          }}
          visitante={{
            bandera: partido.seleccionVisitante?.bandera,
            codigo: partido.seleccionVisitante?.codigo,
            nombre: partido.seleccionVisitante?.nombre ?? "Visitante",
          }}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">
            {partido.seleccionLocal?.nombre ?? "Local"} vs{" "}
            {partido.seleccionVisitante?.nombre ?? "Visitante"}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-white/60">
            {partido.fase?.nombre ?? "Sin fase"} ·{" "}
            {format(new Date(partido.fecha), "dd/MM HH:mm")}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 md:block">
        <span className="whitespace-nowrap rounded-full bg-[#5993B6]/18 px-2.5 py-1 text-[11px] font-black text-[#D8F2FF]">
          {getPredictionCountdownLabel(
            partido.fecha,
            PREDICTION_CLOSE_MINUTES_BEFORE,
            now,
          )}
        </span>
      </div>

      {canOpen ? (
        <ChevronRight className="h-4 w-4 shrink-0 text-[#5993B6] transition group-hover:translate-x-0.5 group-hover:text-[#AEEBFF]" />
      ) : null}
    </button>
  );
}

function MatchFlags({
  local,
  visitante,
}: {
  local: { bandera?: string | null; codigo?: string | null; nombre: string };
  visitante: { bandera?: string | null; codigo?: string | null; nombre: string };
}) {
  return (
    <div className="flex shrink-0 items-center -space-x-2">
      <FlagImage
        bandera={local.bandera}
        codigo={local.codigo}
        nombre={local.nombre}
        widthClassName="w-10"
        heightClassName="h-8"
        fallbackMode="dash"
        fallbackTextClassName="text-sm"
      />
      <FlagImage
        bandera={visitante.bandera}
        codigo={visitante.codigo}
        nombre={visitante.nombre}
        widthClassName="w-10"
        heightClassName="h-8"
        fallbackMode="dash"
        fallbackTextClassName="text-sm"
      />
    </div>
  );
}
