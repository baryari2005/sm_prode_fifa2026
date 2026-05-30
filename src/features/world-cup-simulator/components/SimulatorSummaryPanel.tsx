"use client";

import { CheckCircle2, Medal, Swords, Trophy } from "lucide-react";

import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import { ResultMetricCard } from "@/components/ui/result-metric-card";
import { DASHBOARD_PANEL } from "@/features/dashboard/components/home/dashboard-home.styles";
import type { TeamStanding } from "@/features/world-cup-simulator/engine/types";

type SimulatorSummaryPanelProps = {
  completedMatches: number;
  totalMatches: number;
  bestThirds: TeamStanding[];
  hasRoundOf32: boolean;
  champion: TeamStanding | null;
};

export function SimulatorSummaryPanel({
  completedMatches,
  totalMatches,
  bestThirds,
  hasRoundOf32,
  champion,
}: SimulatorSummaryPanelProps) {
  return (
    <aside className={`${DASHBOARD_PANEL} rounded-[30px] p-5 md:p-6`}>
      <LateralSummaryHeader
        description="Seguimiento rápido del simulador mientras completás grupos y definís la llave."
        icon={Trophy}
      />

      <div className="space-y-4">
        <ResultMetricCard
          icono={CheckCircle2}
          titulo="Partidos simulados"
          descripcion="fase de grupos"
          resultado={`${completedMatches}/${totalMatches}`}
          className="border-white/10 bg-white/[0.08] text-white [&_p]:text-white"
        />
        <ResultMetricCard
          icono={Medal}
          titulo="Mejores terceros"
          descripcion="clasificados a 32avos"
          resultado={`${bestThirds.length}/8`}
          className="border-white/10 bg-white/[0.08] text-white [&_p]:text-white"
        />
        <ResultMetricCard
          icono={Swords}
          titulo="Cruces generados"
          descripcion="primera ronda eliminatoria"
          resultado={hasRoundOf32 ? "Sí" : "No"}
          className="border-white/10 bg-white/[0.08] text-white [&_p]:text-white"
        />
        <ResultMetricCard
          icono={Trophy}
          titulo="Campeón simulado"
          descripcion="objetivo mundial"
          resultado={champion?.codigo || champion?.nombre || "--"}
          className="border-white/10 bg-white/[0.08] text-white [&_p]:text-white"
        />
      </div>
    </aside>
  );
}
