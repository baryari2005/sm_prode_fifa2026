"use client";

import {
  CheckSquare,
  Medal,
  Star,  
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

type DashboardStatsGridProps = {
  pronosticosCargados: number;
  totalPartidos: number;
  posicion?: number | null;
  puntosTotales: number;
  aciertosExactos: number;
  participantes: number;
  isAdmin: boolean;
  pendingUserCount: number;
  pendingUsersLoading: boolean;
};

export function DashboardStatsGrid({
  pronosticosCargados,
  totalPartidos,
  posicion,
  puntosTotales,
  aciertosExactos,
  participantes,
  isAdmin,
  pendingUserCount,
  pendingUsersLoading,
}: DashboardStatsGridProps) {
  const porcentaje =
    totalPartidos > 0
      ? Math.round((pronosticosCargados / totalPartidos) * 100)
      : 0;

  return (
    <section
      className={`grid gap-4 md:grid-cols-2 ${
        isAdmin ? "xl:grid-cols-5" : "xl:grid-cols-4"
      }`}
    >
      <StatsCard
        icon={CheckSquare}
        title="Pronósticos cargados"
        value={`${pronosticosCargados}`}
        detail={`de ${totalPartidos} partidos`}
        tone="green"
        progress={porcentaje}
      />

      <StatsCard
        icon={Medal}
        title="Posición actual"
        value={posicion ? `#${posicion}` : "-"}
        detail="ranking general"
        tone="gold"
      />

      <StatsCard
        icon={Star}
        title="Puntos obtenidos"
        value={`${puntosTotales}`}
        detail={`${aciertosExactos} exactos`}
        tone="blue"
      />

      <StatsCard
        icon={Users}
        title="Participantes"
        value={`${participantes}`}
        detail="grupo activo"
        tone="purple"
      />

      {isAdmin && (
        <StatsCard
          icon={UserPlus}
          title="Usuarios pendientes"
          value={pendingUsersLoading ? "..." : `${pendingUserCount}`}
          detail="pendientes de aprobación"
          tone="cyan"
        />
      )}
    </section>
  );
}

type StatsCardTone = "green" | "gold" | "blue" | "purple" | "cyan";

type StatsCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  detail: string;
  tone: StatsCardTone;
  progress?: number;
};

function StatsCard({
  icon: Icon,
  title,
  value,
  detail,
  tone,
  progress,
}: StatsCardProps) {
  const styles: Record<
    StatsCardTone,
    {
      card: string;
      icon: string;
      glow: string;
      progress: string;
    }
  > = {
    green: {
      card: "from-green-50 via-white to-white",
      icon: "bg-green-100 text-green-700",
      glow: "bg-green-400/20",
      progress: "bg-green-500",
    },
    gold: {
      card: "from-amber-50 via-white to-white",
      icon: "bg-amber-100 text-amber-700",
      glow: "bg-amber-400/20",
      progress: "bg-amber-500",
    },
    blue: {
      card: "from-blue-50 via-white to-white",
      icon: "bg-blue-100 text-blue-700",
      glow: "bg-blue-400/20",
      progress: "bg-blue-500",
    },
    purple: {
      card: "from-purple-50 via-white to-white",
      icon: "bg-purple-100 text-purple-700",
      glow: "bg-purple-400/20",
      progress: "bg-purple-500",
    },
    cyan: {
      card: "from-cyan-50 via-white to-white",
      icon: "bg-cyan-100 text-cyan-700",
      glow: "bg-cyan-400/20",
      progress: "bg-cyan-500",
    },
  };

  const style = styles[tone];

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-[1.6rem]
        border
        border-white/80
        bg-gradient-to-br
        ${style.card}
        p-5
        shadow-[0_16px_45px_rgba(15,23,42,0.08)]
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_22px_60px_rgba(15,23,42,0.13)]
      `}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl ${style.glow}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`
            grid
            h-12
            w-12
            place-items-center
            rounded-2xl
            ${style.icon}
            shadow-sm
            transition
            group-hover:scale-105
          `}
        >
          <Icon className="h-6 w-6" />
        </div>

        {progress !== undefined && (
          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
            {progress}%
          </div>
        )}
      </div>

      <div className="relative mt-5">
        <p className="text-sm font-bold text-slate-500">{title}</p>

        <p className="mt-2 text-4xl font-black tracking-[-0.06em] text-slate-950">
          {value}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-400">{detail}</p>
      </div>

      {progress !== undefined && (
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${style.progress}`}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </article>
  );
}