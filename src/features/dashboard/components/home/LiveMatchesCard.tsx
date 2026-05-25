"use client";

import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock3, Radio } from "lucide-react";

import { FlagImage } from "@/components/ui/flag-image";
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
    <article className="group relative min-w-0 overflow-hidden rounded-[30px] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#008C93]/25 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] xl:p-4 2xl:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            {showingLive ? (
              <Radio className="h-5 w-5" />
            ) : (
              <CalendarDays className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#008C93]">
              {showingLive ? "Partidos en juego" : "Próximos partidos"}
            </p>
            <h2 className="text-base font-black tracking-[-0.04em] text-slate-950 xl:text-lg">
              {showingLive
                ? "Seguimiento en tiempo real"
                : "Carga tus pronósticos a tiempo"}
            </h2>
          </div>
        </div>

        {actionLabel && canGoFixture ? (
          <button
            type="button"
            onClick={onGoFixture}
            className="inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-black text-slate-500 transition hover:text-slate-900"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
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
        <div className="mt-4 flex flex-col gap-2 rounded-[22px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-900 sm:flex-row sm:items-center sm:justify-between">
          <span className="min-w-0">
            Próximo cierre de pronósticos:{" "}
            <span className="font-black">
              {nextPredictionClose.seleccionLocal?.nombre ?? "Local"} vs{" "}
              {nextPredictionClose.seleccionVisitante?.nombre ?? "Visitante"}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 font-black text-emerald-700">
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
      className={`group flex w-full items-center gap-3 rounded-[24px] border border-slate-200/90 bg-white/95 px-4 py-4 text-left transition-all duration-200 ${
        canOpen
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#008C93]/30 hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
          : "cursor-default"
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
          <p className="truncate text-sm font-black text-slate-950">
            {partido.seleccionLocal?.nombre ?? "Local"} vs{" "}
            {partido.seleccionVisitante?.nombre ?? "Visitante"}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            {partido.fase?.nombre ?? "Sin fase"} ·{" "}
            {resultado?.tiempoJuego ? `${resultado.tiempoJuego}'` : status.label}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 items-end gap-3 md:flex">
        <span className="text-lg font-black tracking-[-0.05em] text-slate-950 xl:text-xl">
          {resultado
            ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
            : "0 - 0"}
        </span>
          <span className="whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
          EN VIVO
        </span>
      </div>

      {canOpen ? (
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0B6B59]" />
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
      className={`group flex w-full items-center gap-3 rounded-[24px] border border-slate-200/90 bg-white/95 px-4 py-4 text-left transition-all duration-200 ${
        canOpen
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#008C93]/30 hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
          : "cursor-default"
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
          <p className="truncate text-sm font-black text-slate-950">
            {partido.seleccionLocal?.nombre ?? "Local"} vs{" "}
            {partido.seleccionVisitante?.nombre ?? "Visitante"}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            {partido.fase?.nombre ?? "Sin fase"} ·{" "}
            {format(new Date(partido.fecha), "dd/MM HH:mm")}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 md:block">
        <span className="whitespace-nowrap rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-black text-sky-700">
          {getPredictionCountdownLabel(
            partido.fecha,
            PREDICTION_CLOSE_MINUTES_BEFORE,
            now,
          )}
        </span>
      </div>

      {canOpen ? (
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-700" />
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
