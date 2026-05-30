"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Goal, ListOrdered, Network, Trophy } from "lucide-react";

import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type QuickActionsCardProps = {
  canAccessPronosticos: boolean;
  canAccessRanking: boolean;
  showAdminFixtureActions: boolean;
  showAdminTablaPosicionesAction: boolean;
  showAdminGoleadoresAction: boolean;
  showAdminSimularCrucesAction: boolean;
  onGoPronosticos: () => void;
  onGoFixture: () => void;
  onGoRanking: () => void;
  onGoTablaPosiciones: () => void;
  onGoGoleadores: () => void;
  onGoSimularCruces: () => void;
};

type QuickActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  toneClassName: string;
  onClick: () => void;
};

export function QuickActionsCard({
  canAccessPronosticos,
  canAccessRanking,
  showAdminFixtureActions,
  showAdminTablaPosicionesAction,
  showAdminGoleadoresAction,
  showAdminSimularCrucesAction,
  onGoPronosticos,
  onGoFixture,
  onGoRanking,
  onGoTablaPosiciones,
  onGoGoleadores,
  onGoSimularCruces,
}: QuickActionsCardProps) {
  const actions: QuickActionItem[] = [
    showAdminFixtureActions
      ? {
          id: "fixture",
          label: "Fixture",
          icon: CalendarDays,
          toneClassName: "bg-[#5993B6]/18 text-[#D8F2FF]",
          onClick: onGoFixture,
        }
      : null,
    showAdminTablaPosicionesAction
      ? {
          id: "tabla",
          label: "Tabla de posiciones",
          icon: ListOrdered,
          toneClassName: "bg-white/[0.08] text-[#AEEBFF]",
          onClick: onGoTablaPosiciones,
        }
      : null,
    showAdminGoleadoresAction
      ? {
          id: "goleadores",
          label: "Goleadores",
          icon: Goal,
          toneClassName: "bg-[#FAB438]/16 text-[#FFE4A3]",
          onClick: onGoGoleadores,
        }
      : null,
    showAdminSimularCrucesAction
      ? {
          id: "cruces",
          label: "Simular cruces",
          icon: Network,
          toneClassName: "bg-[#5993B6]/18 text-[#D8F2FF]",
          onClick: onGoSimularCruces,
        }
      : null,
    !showAdminFixtureActions && canAccessPronosticos
      ? {
          id: "pronosticos",
          label: "Mis pronósticos",
          icon: CalendarDays,
          toneClassName: "bg-[#FAB438]/16 text-[#FFE4A3]",
          onClick: onGoPronosticos,
        }
      : null,
    !showAdminFixtureActions && canAccessRanking
      ? {
          id: "ranking",
          label: "Mi ranking",
          icon: Trophy,
          toneClassName: "bg-[#5993B6]/18 text-[#D8F2FF]",
          onClick: onGoRanking,
        }
      : null,
  ].filter(Boolean) as QuickActionItem[];

  if (actions.length === 0) return null;

  return (
    <section className={DASHBOARD_PANEL}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Accesos rápidos
        </p>
        <h2 className="brand-heading mt-1 text-xl font-black !tracking-[0.04em] text-white">
          Entrá directo a las secciones clave
        </h2>
      </div>

      <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className={`group flex min-w-0 cursor-pointer items-center gap-3 rounded-[24px] px-3.5 py-3.5 text-left xl:px-4 xl:py-4 ${DASHBOARD_SUBCARD}`}
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${action.toneClassName}`}
            >
              <action.icon className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-black text-white">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
