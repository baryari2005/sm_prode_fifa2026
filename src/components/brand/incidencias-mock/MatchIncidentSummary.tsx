"use client";

import {
  Activity,
  ArrowRightLeft,
  Goal,
  ShieldAlert,
  Square,
} from "lucide-react";

import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import { DASHBOARD_SUBCARD } from "@/features/dashboard/components/home/dashboard-home.styles";

const metrics = [
  { icon: Goal, title: "Marcador actual", detail: "Mexico 2 - 1 Sudafrica", value: "2-1", tone: "text-[#84F0C8] bg-[#84F0C8]/12" },
  { icon: Goal, title: "Goles", detail: "Eventos cargados", value: "3", tone: "text-[#AEEBFF] bg-[#5993B6]/18" },
  { icon: Square, title: "Tarjetas", detail: "Amonestaciones y expulsiones", value: "2", tone: "text-[#FFE4A3] bg-[#FAB438]/14" },
  { icon: ArrowRightLeft, title: "Cambios", detail: "Movimientos confirmados", value: "4", tone: "text-[#C7D8FF] bg-[#C7D8FF]/10" },
  { icon: ShieldAlert, title: "Lesiones", detail: "Seguimiento medico", value: "1", tone: "text-rose-300 bg-rose-300/12" },
  { icon: Activity, title: "Ultima incidencia", detail: "VAR · Gol confirmado", value: "78'", tone: "text-[#AEEBFF] bg-white/10" },
];

export function MatchIncidentSummary() {
  return (
    <aside className="space-y-4">
      <LateralSummaryHeader
        title="Vista rápida"
        description="Lectura rapida del flujo de incidencias y del estado del partido."
      />

      <div className="space-y-2.5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className={`flex items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${metric.tone}`}>
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
    </aside>
  );
}
