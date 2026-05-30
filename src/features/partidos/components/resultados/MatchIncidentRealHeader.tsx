"use client";

import { Badge } from "@/components/ui/badge";
import { EstadoPartido } from "@prisma/client";

type MatchIncidentRealHeaderProps = {
  localNombre: string;
  visitanteNombre: string;
  golesLocal: number;
  golesVisitante: number;
  estado: EstadoPartido;
  fechaTexto?: string;
  faseLabel?: string | null;
};

const estadoTone: Record<
  EstadoPartido,
  string
> = {
  PENDIENTE: "bg-white/10 text-white hover:bg-white/10",
  EN_JUEGO: "bg-[#84F0C8]/12 text-[#84F0C8] hover:bg-[#84F0C8]/12",
  ENTRETIEMPO: "bg-[#AEEBFF]/12 text-[#AEEBFF] hover:bg-[#AEEBFF]/12",
  FINALIZADO: "bg-[#FAB438]/14 text-[#FFE4A3] hover:bg-[#FAB438]/14",
  SUSPENDIDO: "bg-rose-400/12 text-rose-200 hover:bg-rose-400/12",
  CANCELADO: "bg-rose-400/12 text-rose-200 hover:bg-rose-400/12",
};

function formatEstado(estado: EstadoPartido) {
  return estado.toLowerCase().replace(/_/g, " ");
}

export function MatchIncidentRealHeader({
  localNombre,
  visitanteNombre,
  golesLocal,
  golesVisitante,
  estado,
  fechaTexto,
  faseLabel,
}: MatchIncidentRealHeaderProps) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        <div className="text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Local
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{localNombre}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-[64px_auto_64px] items-center gap-2">
            <div className="grid h-14 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
              {golesLocal}
            </div>
            <span className="font-brand text-4xl text-white/42">VS</span>
            <div className="grid h-14 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
              {golesVisitante}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className={`rounded-full capitalize ${estadoTone[estado]}`}>
              {formatEstado(estado)}
            </Badge>
            {faseLabel ? (
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                {faseLabel}
              </Badge>
            ) : null}
            {fechaTexto ? (
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                {fechaTexto}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Visitante
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{visitanteNombre}</p>
        </div>
      </div>
    </div>
  );
}
