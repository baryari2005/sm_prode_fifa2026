"use client";

import {
  ArrowRightLeft,
  Goal,
  ShieldAlert,
  Siren,
  Square,
  Video,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { MatchIncident } from "@/features/partidos/types/fixture-details";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

const incidentMeta = {
  gol: { label: "Gol", icon: Goal, tone: "text-emerald-300 bg-emerald-500/10 border-emerald-400/25" },
  tarjeta_amarilla: {
    label: "Amarilla",
    icon: Square,
    tone: "text-amber-200 bg-amber-400/10 border-amber-300/25",
  },
  tarjeta_roja: {
    label: "Roja",
    icon: Square,
    tone: "text-rose-200 bg-rose-500/10 border-rose-300/25",
  },
  cambio: {
    label: "Cambio",
    icon: ArrowRightLeft,
    tone: "text-sky-200 bg-sky-400/10 border-sky-300/25",
  },
  lesion: {
    label: "Lesion",
    icon: ShieldAlert,
    tone: "text-orange-200 bg-orange-400/10 border-orange-300/25",
  },
  penal: {
    label: "Penal",
    icon: Siren,
    tone: "text-yellow-200 bg-yellow-400/10 border-yellow-300/25",
  },
  var: {
    label: "VAR",
    icon: Video,
    tone: "text-indigo-200 bg-indigo-400/10 border-indigo-300/25",
  },
} as const;

type Props = {
  incidencias: MatchIncident[];
  localNombre: string;
  visitanteNombre: string;
};

export function PartidoDetalleIncidenciasCard({
  incidencias,
  localNombre,
  visitanteNombre,
}: Props) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] text-white shadow-[0_18px_50px_rgba(2,6,23,0.18)] transition-all duration-200 hover:border-[#5993B6]/28 hover:shadow-[0_22px_56px_rgba(2,6,23,0.24)]">
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <CardContent className="relative space-y-4 p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Incidencias del partido
        </p>

        {incidencias.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.04] px-4 py-6 text-sm text-white/60">
            Todavia no hay incidencias cargadas para este partido.
          </div>
        ) : (
          <div className="space-y-3">
            {incidencias
              .slice()
              .sort((a, b) => a.minuto - b.minuto)
              .map((incident) => {
                const meta = incidentMeta[incident.tipo];
                const Icon = meta.icon;
                const equipoNombre =
                  incident.equipo === "local"
                    ? localNombre
                    : incident.equipo === "visitante"
                      ? visitanteNombre
                      : "General";

                const principal =
                  incident.tipo === "cambio"
                    ? `Sale ${incident.jugadorSaleNombre ?? "Jugador"} / Entra ${incident.jugadorEntraNombre ?? "Jugador"}`
                    : incident.jugadorNombre ??
                      incident.varResultado ??
                      "Incidencia registrada";

                return (
                  <div
                    key={incident.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-black text-white">
                      {incident.minuto}&apos;
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${meta.tone}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                          {equipoNombre}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white">{principal}</p>
                      {incident.descripcion ? (
                        <p className="text-sm text-white/68">{incident.descripcion}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
