"use client";

import { Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { PronosticoRapidoMatchCard } from "@/features/pronosticos/components/rapido/PronosticoRapidoMatchCard";

import type {
  PartidoPronosticoRapido,
  PronosticoRapidoDateGroup as PronosticoRapidoDateGroupType,
  PronosticoRapidoErrors,
  PronosticoRapidoField,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

type PronosticoRapidoDateGroupProps = {
  grupo: PronosticoRapidoDateGroupType;
  values: Record<string, PronosticoRapidoValue>;
  errors: PronosticoRapidoErrors;
  onScoreChange: (
    partidoId: string,
    field: PronosticoRapidoField,
    value: string
  ) => void;
};

export function PronosticoRapidoDateGroup({
  grupo,
  values,
  errors,
  onScoreChange,
}: PronosticoRapidoDateGroupProps) {
  return (
    <section className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="p-4 md:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93]">
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-lg font-extrabold tracking-[-0.02em] text-slate-950 md:text-xl">
                {grupo.titulo}
              </h2>

              <Badge
                variant="secondary"
                className="rounded-full bg-[#008C93]/10 px-3 py-1 text-sm font-semibold text-[#008C93] hover:bg-blue-50"
              >
                {grupo.partidos.length}{" "}
                {grupo.partidos.length === 1 ? "partido" : "partidos"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200/80">
        {grupo.partidos.map((partido) => {
          const partidoRapido = partido as PartidoPronosticoRapido;

          const value = values[partidoRapido.id] ?? {
            golesLocal: "",
            golesVisitante: "",
          };

          return (
            <PronosticoRapidoMatchCard
              key={partidoRapido.id}
              partido={partidoRapido}
              value={value}
              error={errors[partidoRapido.id]}
              onScoreChange={onScoreChange}
            />
          );
        })}
        </div>
      </div>
    </section>
  );
}
