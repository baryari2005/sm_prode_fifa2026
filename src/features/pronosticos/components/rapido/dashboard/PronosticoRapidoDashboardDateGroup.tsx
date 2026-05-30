"use client";

import { Clock3 } from "lucide-react";

import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { PronosticoRapidoDashboardMatchCard } from "@/features/pronosticos/components/rapido/dashboard/PronosticoRapidoDashboardMatchCard";
import type {
  PartidoPronosticoRapido,
  PronosticoRapidoDateGroup as PronosticoRapidoDateGroupType,
  PronosticoRapidoErrors,
  PronosticoRapidoField,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

type PronosticoRapidoDashboardDateGroupProps = {
  grupo: PronosticoRapidoDateGroupType;
  values: Record<string, PronosticoRapidoValue>;
  errors: PronosticoRapidoErrors;
  onScoreChange: (
    partidoId: string,
    field: PronosticoRapidoField,
    value: string,
  ) => void;
};

export function PronosticoRapidoDashboardDateGroup({
  grupo,
  values,
  errors,
  onScoreChange,
}: PronosticoRapidoDashboardDateGroupProps) {
  return (
    <section className="space-y-4">
      <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />

        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Fecha agrupada
            </p>
            <h3 className="font-brand mt-2 text-[1.85rem] leading-[0.94] tracking-[0.04em] text-white">
              {grupo.titulo}
            </h3>
            <p className="mt-2 max-w-[820px] text-sm leading-6 text-white/72">
              Carga todos los cruces del dia en una sola pasada y detecta rapido
              cierres o partidos ya iniciados.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-[#AEEBFF]">
            <Clock3 className="h-3.5 w-3.5" />
            {grupo.partidos.length} {grupo.partidos.length === 1 ? "partido" : "partidos"}
          </span>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {grupo.partidos.map((partido) => {
          const partidoRapido = partido as PartidoPronosticoRapido;
          const value = values[partidoRapido.id] ?? {
            golesLocal: "",
            golesVisitante: "",
          };

          return (
            <PronosticoRapidoDashboardMatchCard
              key={partidoRapido.id}
              partido={partidoRapido}
              value={value}
              error={errors[partidoRapido.id]}
              onScoreChange={onScoreChange}
            />
          );
        })}
      </div>
    </section>
  );
}
