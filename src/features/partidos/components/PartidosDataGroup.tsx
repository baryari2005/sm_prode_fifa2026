"use client";

import { CalendarDays } from "lucide-react";

import { PartidoCard } from "@/features/partidos/components/PartidoCard";
import { Fase, Seleccion } from "@/features/partidos/types/types";
import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import { Badge } from "@/components/ui/badge";

type PartidosDateGroupProps = {
  titulo: string;
  partidos: PartidoConRelaciones[];
  selecciones: Seleccion[];
  fases: Fase[];
  onVerDetalle?: (partidoId: string) => void;
  onGestionarResultado?: (partidoId: string) => void;
  onCargarFormaciones?: (partidoId: string) => void;
  allowPronostico?: boolean;
  onPronosticoSaved?: () => void | Promise<void>;
  onPronosticarClick?: (partido: PartidoConRelaciones) => void;
  highlightedPartidoId?: string | null;
};

export function PartidosDateGroup({
  titulo,
  partidos,
  selecciones,
  fases,
  onVerDetalle,
  onGestionarResultado,
  onCargarFormaciones,
  allowPronostico = false,
  onPronosticoSaved,
  onPronosticarClick,
  highlightedPartidoId,
}: PartidosDateGroupProps) {
  return (
    <section className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="p-4 md:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93]">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-lg font-extrabold tracking-[-0.02em] text-slate-950 md:text-xl">
                {titulo}
              </h2>

              <Badge
                variant="secondary"
                className="rounded-full bg-[#008C93]/10 px-3 py-1 text-sm font-semibold text-[#008C93] hover:bg-blue-50"
              >
                {partidos.length} {partidos.length === 1 ? "partido" : "partidos"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200/80">
          {partidos.map((partido) => (
            <PartidoCard
              key={partido.id}
              partido={partido}
              selecciones={selecciones}
              fases={fases}
              compact
              onVerDetalle={
                onVerDetalle ? () => onVerDetalle(partido.id) : undefined
              }
              onGestionarResultado={
                onGestionarResultado
                  ? () => onGestionarResultado(partido.id)
                  : undefined
              }
              onCargarFormaciones={
                onCargarFormaciones
                  ? () => onCargarFormaciones(partido.id)
                  : undefined
              }
              allowPronostico={allowPronostico}
              onPronosticoSaved={onPronosticoSaved}
              onPronosticarClick={onPronosticarClick}
              highlighted={partido.id === highlightedPartidoId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
