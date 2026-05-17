import { ChartNoAxesColumnIcon, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { CardDescription, CardTitle } from "@/components/ui/card";

import type { PartidoDetalleHeaderProps } from "@/features/partidos/types/partido-detalle-header.types";
import { buildPartidoInfo } from "@/features/partidos/helpers/partido-detalle-header.helpers";

import { PartidoScoreboard } from "./PartidoScoreboard";

export function PartidoDetalleHeader({
  local,
  visitante,
  marcador,
  escudoLocalUrl,
  escudoVisitanteUrl,
  competencia = "Mundial 2026",
  fechaTexto,
  estado = "Programado",
  fase,
  grupo,
  jornada,
}: PartidoDetalleHeaderProps) {
  const partidoInfo = buildPartidoInfo({
    fase,
    grupo,
    jornada,
  });

  return (
    <div className="border-b border-slate-100 pb-6">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <ChartNoAxesColumnIcon className="h-6 w-6 shrink-0" />
                Estadisticas del partido
              </CardTitle>

              <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>Alineaciones y estadisticas del partido.</span>
                <Info className="h-4 w-4 text-slate-400" />
              </CardDescription>
            </div>
          </div>

          <Badge className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100">
            {estado}
          </Badge>
        </div>

        <div className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="relative p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-800">
                  {competencia}
                </span>

                {fechaTexto && (
                  <span className="ml-2 text-slate-500">Â· {fechaTexto}</span>
                )}
              </div>

              {/* <span className="shrink-0 text-sm font-medium text-slate-700">
                {estado}
              </span> */}
            </div>

            <PartidoScoreboard
              local={local}
              visitante={visitante}
              marcador={marcador}
              escudoLocalUrl={escudoLocalUrl}
              escudoVisitanteUrl={escudoVisitanteUrl}
              estado={estado}
            />

            {partidoInfo && (
              <div className="mt-4 text-center text-sm text-slate-500">
                {partidoInfo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
