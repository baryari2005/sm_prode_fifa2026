"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Goal, ListOrdered, Network, Trophy } from "lucide-react";

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
          toneClassName: "bg-blue-50 text-blue-700",
          onClick: onGoFixture,
        }
      : null,
    showAdminTablaPosicionesAction
      ? {
          id: "tabla",
          label: "Tabla de posiciones",
          icon: ListOrdered,
          toneClassName: "bg-violet-50 text-violet-700",
          onClick: onGoTablaPosiciones,
        }
      : null,
    showAdminGoleadoresAction
      ? {
          id: "goleadores",
          label: "Goleadores",
          icon: Goal,
          toneClassName: "bg-cyan-50 text-cyan-700",
          onClick: onGoGoleadores,
        }
      : null,
    showAdminSimularCrucesAction
      ? {
          id: "cruces",
          label: "Simular cruces",
          icon: Network,
          toneClassName: "bg-red-50 text-red-700",
          onClick: onGoSimularCruces,
        }
      : null,
    !showAdminFixtureActions && canAccessPronosticos
      ? {
          id: "pronosticos",
          label: "Mis pronósticos",
          icon: CalendarDays,
          toneClassName: "bg-emerald-50 text-emerald-700",
          onClick: onGoPronosticos,
        }
      : null,
    !showAdminFixtureActions && canAccessRanking
      ? {
          id: "ranking",
          label: "Mi ranking",
          icon: Trophy,
          toneClassName: "bg-amber-50 text-amber-700",
          onClick: onGoRanking,
        }
      : null,
  ].filter(Boolean) as QuickActionItem[];

  if (actions.length === 0) return null;

  return (
    <section className="group relative min-w-0 overflow-hidden rounded-[30px] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#008C93]/25 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] xl:p-4 2xl:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Accesos rápidos
        </p>
        <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-slate-950">
          Entrá directo a las secciones clave
        </h2>
      </div>

      <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-[24px] border border-slate-200/90 bg-white/95 px-3.5 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/30 hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)] xl:px-4 xl:py-4"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${action.toneClassName}`}
            >
              <action.icon className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-black text-slate-800">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
