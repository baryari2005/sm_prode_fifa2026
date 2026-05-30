"use client";

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import type { HistorialPronosticoDTO } from "@/features/pronosticos/services/ranking.service";

type Props = {
  rows: HistorialPronosticoDTO[];
};

function getBadgeStyles(tipo: HistorialPronosticoDTO["aciertoTipo"]) {
  switch (tipo) {
    case "EXACTO":
      return "border-emerald-300/18 bg-emerald-300/10 text-emerald-100";
    case "TENDENCIA":
      return "border-[#5993B6]/24 bg-[#5993B6]/18 text-[#AEEBFF]";
    default:
      return "border-white/10 bg-white/10 text-white/70";
  }
}

function getBadgeLabel(tipo: HistorialPronosticoDTO["aciertoTipo"]) {
  switch (tipo) {
    case "EXACTO":
      return "Exacto";
    case "TENDENCIA":
      return "Tendencia";
    default:
      return "Sin acierto";
  }
}

export function PronosticosHistorial({ rows }: Props) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#1E2C46] text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Historial
        </p>
        <h2 className="mt-2 font-brand text-[2rem] leading-none tracking-[0.04em] text-white">
          Historial calificado
        </h2>
        <p className="mt-2 text-sm text-white/64">
          Tus últimos pronósticos con puntos ya asignados.
        </p>
      </div>

      <div className="divide-y divide-white/10">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm font-medium text-white/60">
            Todavía no tenés pronósticos calificados.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-bold text-white">
                  {row.partido.seleccionLocal?.nombre ?? "Local"} {row.golesLocal} -{" "}
                  {row.golesVisitante}{" "}
                  {row.partido.seleccionVisitante?.nombre ?? "Visitante"}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Resultado real: {row.partido.resultado?.golesLocal ?? 0} -{" "}
                  {row.partido.resultado?.golesVisitante ?? 0}
                  {" · "}
                  {row.partido.fase?.nombre ?? "Sin fase"}
                  {" · "}
                  {format(new Date(row.partido.fecha), "dd/MM/yyyy HH:mm")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={`rounded-full px-3 py-1 font-semibold hover:bg-transparent ${getBadgeStyles(
                    row.aciertoTipo
                  )}`}
                >
                  {getBadgeLabel(row.aciertoTipo)}
                </Badge>
                <Badge className="rounded-full border-[#FAB438]/24 bg-[#FAB438]/12 px-3 py-1 font-semibold text-[#FFE4A3] hover:bg-[#FAB438]/12">
                  +{row.puntosOtorgados} pts
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
