"use client";

import { Activity, ArrowRightLeft, Goal, ShieldAlert, Square } from "lucide-react";

import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { MatchIncident } from "@/features/partidos/types/fixture-details";
import type { ResultadoFormState } from "@/features/partidos/types/resultado-manual.types";

type MatchIncidentRealSummaryProps = {
  localNombre: string;
  visitanteNombre: string;
  form: ResultadoFormState;
  incidencias: MatchIncident[];
};

function getLastIncidentLabel(incident?: MatchIncident) {
  if (!incident) return "Sin incidencias";

  switch (incident.tipo) {
    case "gol":
      return "Gol";
    case "tarjeta_amarilla":
      return "Amarilla";
    case "tarjeta_roja":
      return "Roja";
    case "cambio":
      return "Cambio";
    case "lesion":
      return "Lesión";
    case "penal":
      return "Penal";
    case "var":
      return "VAR";
    default:
      return "Incidencia";
  }
}

export function MatchIncidentRealSummary({
  localNombre,
  visitanteNombre,
  form,
  incidencias,
}: MatchIncidentRealSummaryProps) {
  const golesLocal = form.detalleGolesLocal.length;
  const golesVisitante = form.detalleGolesVisitante.length;
  const yellowCards =
    form.estadisticasLocal.yellowCards + form.estadisticasVisitante.yellowCards;
  const redCards =
    form.estadisticasLocal.redCards + form.estadisticasVisitante.redCards;
  const cambios = incidencias.filter(
    (incident) => incident.tipo === "cambio"
  ).length;
  const lesiones = incidencias.filter(
    (incident) => incident.tipo === "lesion"
  ).length;
  const ultimaIncidencia = incidencias
    .slice()
    .sort((a, b) => b.minuto - a.minuto)[0];

  const metrics = [
    {
      icon: Goal,
      title: "Marcador actual",
      detail: `${localNombre} ${golesLocal} - ${golesVisitante} ${visitanteNombre}`,
      value: `${golesLocal}-${golesVisitante}`,
      tone: "text-[#84F0C8] bg-[#84F0C8]/12",
    },
    {
      icon: Goal,
      title: "Goles",
      detail: "Eventos de gol registrados",
      value: String(golesLocal + golesVisitante),
      tone: "text-[#AEEBFF] bg-[#5993B6]/18",
    },
    {
      icon: Square,
      title: "Tarjetas",
      detail: `Amarillas ${yellowCards} · Rojas ${redCards}`,
      value: String(yellowCards + redCards),
      tone: "text-[#FFE4A3] bg-[#FAB438]/14",
    },
    {
      icon: ArrowRightLeft,
      title: "Cambios",
      detail: "Movimientos confirmados",
      value: String(cambios),
      tone: "text-[#C7D8FF] bg-[#C7D8FF]/10",
    },
    {
      icon: ShieldAlert,
      title: "Lesiones",
      detail: "Seguimiento médico",
      value: String(lesiones),
      tone: "text-rose-300 bg-rose-300/12",
    },
    {
      icon: Activity,
      title: "Última incidencia",
      detail: ultimaIncidencia?.descripcion ?? "Sin detalle adicional",
      value: ultimaIncidencia ? `${ultimaIncidencia.minuto}'` : "--",
      tone: "text-[#AEEBFF] bg-white/10",
    },
  ];

  return (
    <aside className="space-y-4">
      <DecorativeCard>
        <LateralSummaryHeader
          title="Resumen lateral"
          description="Lectura rápida del flujo de incidencias y del estado actual del partido."
        />

        <div className="space-y-2.5">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.title}
                className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] px-3 py-3 xl:px-3.5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${metric.tone}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    {metric.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    {metric.detail}
                  </span>
                </span>
                <span className="font-brand text-[1.55rem] leading-none tracking-[0.03em] text-white">
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </DecorativeCard>

      <DecorativeCard>
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Estado actual
          </p>
          <p className="text-sm leading-6 text-white/68">
            El cambio de estado vive arriba para darle más protagonismo al flujo
            administrativo.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Estado cargado
          </p>
          <p className="mt-3 text-lg font-black text-white">{form.estado}</p>
          <p className="mt-1 text-sm text-white/62">
            Revisá este valor antes de registrar nuevas incidencias.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white/68">
          Flujo actual:{" "}
          <span className="font-semibold text-white">
            {getLastIncidentLabel(ultimaIncidencia)}
          </span>
        </div>
      </DecorativeCard>
    </aside>
  );
}

function DecorativeCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_28%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="relative space-y-4">{children}</div>
    </div>
  );
}
