"use client";

import { CheckSquare, Radio, UserPlus, Users } from "lucide-react";

import { DashboardStatCard } from "@/features/dashboard/components/home/DashboardStatCard";

type DashboardStatsGridProps = {
  pronosticosCargados: number;
  totalPartidos: number;
  participantes: number;
  showPendingUsers: boolean;
  pendingUserCount: number;
  pendingUsersLoading: boolean;
  partidosEnJuegoCount: number;
};

export function DashboardStatsGrid({
  pronosticosCargados,
  totalPartidos,
  participantes,
  showPendingUsers,
  pendingUserCount,
  pendingUsersLoading,
  partidosEnJuegoCount,
}: DashboardStatsGridProps) {
  const porcentaje =
    totalPartidos > 0
      ? Math.round((pronosticosCargados / totalPartidos) * 100)
      : 0;

  return (
    <section
      className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4"
    >
      <DashboardStatCard
        icon={CheckSquare}
        title="Pronósticos cargados"
        value={`${pronosticosCargados}`}
        valueSecondary={`${totalPartidos}`}
        detail=""
        tone="green"
        progress={porcentaje}
      />

      <DashboardStatCard
        icon={Users}
        title="Participantes activos"
        value={`${participantes}`}
        detail="usuarios dentro del ranking actual"
        tone="purple"
      />

      {showPendingUsers ? (
        <DashboardStatCard
          icon={UserPlus}
          title="Usuarios pendientes"
          value={pendingUsersLoading ? "..." : `${pendingUserCount}`}
          detail="pendientes de aprobación"
          tone="amber"
        />
      ) : null}

      <DashboardStatCard
        icon={Radio}
        title="Partidos en juego"
        value={`${partidosEnJuegoCount}`}
        detail="encuentros activos ahora mismo"
        tone="blue"
      />
    </section>
  );
}
