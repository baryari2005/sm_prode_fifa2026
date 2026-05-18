"use client";

import { Clock3, TimerReset, Trophy, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatMatchHour,
  getFaseNombre,
  getGrupoNombre,
  getPredictionCountdownLabel,
  isPredictionClosed,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { TeamPredictionColumn } from "@/features/pronosticos/components/rapido/TeamPredictionColumn";

import type {
  PartidoPronosticoRapido,
  PronosticoRapidoField,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

type PronosticoRapidoMatchCardProps = {
  partido: PartidoPronosticoRapido;
  value: PronosticoRapidoValue;
  error?: string;
  onScoreChange: (
    partidoId: string,
    field: PronosticoRapidoField,
    value: string
  ) => void;
};

export function PronosticoRapidoMatchCard({
  partido,
  value,
  error,
  onScoreChange,
}: PronosticoRapidoMatchCardProps) {
  const closed = isPredictionClosed(partido.fecha);
  const faseNombre = getFaseNombre(partido, []);
  const grupoNombre = getGrupoNombre(partido);
  const hora = formatMatchHour(partido.fecha);
  const countdownLabel = getPredictionCountdownLabel(partido.fecha);

  return (
    <article className="group relative overflow-hidden rounded-[1.35rem] bg-transparent transition-all duration-200">
      <div className="px-2 sm:px-3 md:px-4">
        <div className="grid gap-3 px-2 py-3 sm:px-4 sm:py-4 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
              <TeamPredictionColumn
                align="right"
                name={partido.seleccionLocal?.nombre ?? "Equipo local"}
                flag={partido.seleccionLocal?.bandera}
                code={partido.seleccionLocal?.codigo}
                value={value.golesLocal}
                disabled={closed}
                onChange={(nextValue) =>
                  onScoreChange(partido.id, "golesLocal", nextValue)
                }
              />

              <div className="flex items-center justify-center">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                  vs
                </span>
              </div>

              <TeamPredictionColumn
                align="left"
                name={partido.seleccionVisitante?.nombre ?? "Equipo visitante"}
                flag={partido.seleccionVisitante?.bandera}
                code={partido.seleccionVisitante?.codigo}
                value={value.golesVisitante}
                disabled={closed}
                onChange={(nextValue) =>
                  onScoreChange(partido.id, "golesVisitante", nextValue)
                }
              />
            </div>
          </div>

          <div className="hidden flex-wrap items-center gap-2 2xl:flex 2xl:flex-nowrap 2xl:justify-end">
            <Badge
              variant="secondary"
              className={`h-8 whitespace-nowrap rounded-full px-3 text-xs font-medium ${
                closed
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
              }`}
            >
              <Clock3
                className={`mr-1.5 h-3.5 w-3.5 ${
                  closed ? "text-amber-700" : "text-yellow-700"
                }`}
              />
              Hora: {hora}
            </Badge>

            {countdownLabel ? (
              <Badge
                variant="secondary"
                className={`h-8 whitespace-nowrap rounded-full px-3 text-xs font-medium ${
                  closed
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                }`}
              >
                <TimerReset
                  className={`mr-1.5 h-3.5 w-3.5 ${
                    closed ? "text-amber-700" : "text-yellow-700"
                  }`}
                />
                {countdownLabel}
              </Badge>
            ) : null}

            <Badge
              variant="secondary"
              className="h-8 whitespace-nowrap rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-700"
            >
              <Trophy className="mr-1.5 h-3.5 w-3.5 text-[#008C93]" />
              {faseNombre}
            </Badge>

            {grupoNombre ? (
              <Badge
                variant="secondary"
                className="h-8 whitespace-nowrap rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-700"
              >
                <UsersRound className="mr-1.5 h-3.5 w-3.5 text-[#008C93]" />
                {grupoNombre}
              </Badge>
            ) : null}

            {closed ? (
              <Badge
                variant="secondary"
                className="h-8 whitespace-nowrap rounded-full bg-amber-50 px-3 text-xs font-medium text-amber-700"
              >
                Carga desactivada
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="h-8 whitespace-nowrap rounded-full bg-emerald-50 px-3 text-xs font-medium text-emerald-700"
              >
                Carga activa
              </Badge>
            )}
          </div>

          {error ? (
            <p className="mt-2 rounded-2xl bg-rose-50 px-3 py-2 text-center text-sm font-bold text-rose-600 2xl:col-span-2">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}