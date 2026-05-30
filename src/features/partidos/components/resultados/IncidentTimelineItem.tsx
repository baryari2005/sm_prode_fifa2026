"use client";

import {
  Pencil,
  ShieldAlert,
  Siren,
  Square,
  Trash2,
  Video,
} from "lucide-react";
import { ArrowRightLeft, Goal } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MatchIncident } from "@/features/partidos/types/fixture-details";

const incidentMeta = {
  gol: {
    label: "Gol",
    icon: Goal,
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
  tarjeta_amarilla: {
    label: "Amarilla",
    icon: Square,
    className: "border-[#FAB438]/25 bg-[#FAB438]/12 text-[#FFE3A1]",
  },
  tarjeta_roja: {
    label: "Roja",
    icon: Square,
    className: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  },
  cambio: {
    label: "Cambio",
    icon: ArrowRightLeft,
    className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  },
  lesion: {
    label: "Lesion",
    icon: ShieldAlert,
    className: "border-orange-400/20 bg-orange-400/10 text-orange-200",
  },
  penal: {
    label: "Penal",
    icon: Siren,
    className: "border-[#FAB438]/25 bg-[#FAB438]/12 text-[#FFE3A1]",
  },
  var: {
    label: "VAR",
    icon: Video,
    className: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  },
} as const;

type IncidentTimelineItemProps = {
  incident: MatchIncident;
  onEdit?: (id: string) => void;
  onRemove: (id: string) => void;
};

export function IncidentTimelineItem({
  incident,
  onEdit,
  onRemove,
}: IncidentTimelineItemProps) {
  const meta = incidentMeta[incident.tipo];
  const Icon = meta.icon;

  const headline =
    incident.tipo === "cambio"
      ? `Sale ${incident.jugadorSaleNombre ?? "Jugador"} / Entra ${incident.jugadorEntraNombre ?? "Jugador"}`
      : incident.jugadorNombre ??
        incident.descripcion ??
        incident.varResultado ??
        "Incidencia registrada";

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-black text-white">
          {incident.minuto}&apos;
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${meta.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
              {incident.equipo === "general" ? "General" : incident.equipo}
            </span>
          </div>

          <p className="text-sm font-semibold text-white">{headline}</p>

          {incident.descripcion ? (
            <p className="text-sm text-white/58">{incident.descripcion}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(incident.id)}
            className="h-9 w-9 rounded-xl text-white/38 hover:bg-white/[0.08] hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(incident.id)}
          className="h-9 w-9 rounded-xl text-white/38 hover:bg-rose-500/10 hover:text-rose-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
