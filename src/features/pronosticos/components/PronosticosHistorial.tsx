"use client";

import { Badge } from "@/components/ui/badge";
import type { HistorialPronosticoDTO } from "@/features/pronosticos/services/ranking.service";
import { format } from "date-fns";

type Props = {
  rows: HistorialPronosticoDTO[];
};

function getBadgeStyles(tipo: HistorialPronosticoDTO["aciertoTipo"]) {
  switch (tipo) {
    case "EXACTO":
      return "bg-emerald-50 text-emerald-700";
    case "TENDENCIA":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
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
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-black tracking-tight text-slate-950">
          Historial calificado
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tus últimos pronósticos con puntos ya asignados.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm font-medium text-slate-500">
            Todavía no tenés pronósticos calificados.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-bold text-slate-950">
                  {row.partido.seleccionLocal?.nombre ?? "Local"} {row.golesLocal} -{" "}
                  {row.golesVisitante} {row.partido.seleccionVisitante?.nombre ?? "Visitante"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Resultado real: {row.partido.resultado?.golesLocal ?? 0} -{" "}
                  {row.partido.resultado?.golesVisitante ?? 0}
                  {" · "}
                  {row.partido.fase?.nombre ?? "Sin fase"}
                  {" · "}
                  {format(new Date(row.partido.fecha), "dd/MM/yyyy HH:mm")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`rounded-full px-3 py-1 font-semibold hover:bg-transparent ${getBadgeStyles(row.aciertoTipo)}`}>
                  {getBadgeLabel(row.aciertoTipo)}
                </Badge>
                <Badge className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-900">
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
