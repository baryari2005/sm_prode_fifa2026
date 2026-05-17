import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ReglaCruce } from "@/features/partidos/types/types";
import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";
import {
  obtenerOrigenResolucion,
  parseOrigenRegla,
} from "@/features/partidos/utils/cruce-rules.helpers";

import { CruceTeamSlot } from "./CruceTeamSlot";

type CruceMatchCardProps = {
  regla: ReglaCruce;
  posiciones: PosicionEquipo[];
};

export function CruceMatchCard({ regla, posiciones }: CruceMatchCardProps) {
  const localOrigen = obtenerOrigenResolucion(
    parseOrigenRegla(regla.localOrigen),
    posiciones
  );

  const visitanteOrigen = obtenerOrigenResolucion(
    parseOrigenRegla(regla.visitanteOrigen),
    posiciones
  );

  const fechaLabel = regla.fecha
    ? format(new Date(regla.fecha), "EEE d MMM yyyy", { locale: es })
    : "Sin fecha";
  const horaLabel = regla.hora?.trim() || "00:00";

  return (
    <article className="group/match relative overflow-hidden rounded-[1.7rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_16px_42px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.10),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover/match:opacity-100" />

      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-[#008C93] px-3 py-1 text-xs font-bold text-white hover:bg-[#007381]">
                Partido {regla.partidoNumero}
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cruce automático
              </Badge>
            </div>

            <h3 className="truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:text-lg">
              {regla.nombre}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-700">
              <CalendarDays className="h-3.5 w-3.5 text-[#008C93]" />
              {fechaLabel}
            </span>

            {regla.estadio && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-700">
                <Building2 className="h-3.5 w-3.5 text-[#008C93]" />
                {regla.estadio}
              </span>
            )}
          </div>
        </div>

        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <CruceTeamSlot
            label="Local"
            value={localOrigen.label}
            resolved={localOrigen.resolved}
            bandera={localOrigen.bandera}
            codigo={localOrigen.codigo}
            nombre={localOrigen.teamName ?? localOrigen.label}
            side="local"
          />

          <div className="flex items-center justify-center">
            <div className="flex min-w-[90px] flex-col items-center justify-center rounded-2xl border border-[#008C93]/15 bg-gradient-to-b from-[#E8FBFC] via-white to-[#F7FAFC] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#008C93]/70">
                Hora
              </span>

              <p className="text-2xl font-black leading-none tracking-[-0.04em] text-slate-950">
                {horaLabel}
              </p>
            </div>
          </div>

          <CruceTeamSlot
            label="Visitante"
            value={visitanteOrigen.label}
            resolved={visitanteOrigen.resolved}
            bandera={visitanteOrigen.bandera}
            codigo={visitanteOrigen.codigo}
            nombre={visitanteOrigen.teamName ?? visitanteOrigen.label}
            side="visitante"
          />
        </div>
      </div>
    </article>
  );
}
