"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarClock, Trophy, UsersRound } from "lucide-react";

type ImportantActionsCardProps = {
  pendingUserCount: number;
  canManageUsers: boolean;
  canManageFixture: boolean;
  canViewRanking: boolean;
  onGoUsers: () => void;
  onGoResultados: () => void;
  onGoFixture: () => void;
  onGoRanking: () => void;
};

type ActionItem = {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconSrc?: string;
  toneClassName: string;
  badge?: string;
  onClick: () => void;
};

export function ImportantActionsCard({
  pendingUserCount,
  canManageUsers,
  canManageFixture,
  canViewRanking,
  onGoUsers,
  onGoResultados,
  onGoFixture,
  onGoRanking,
}: ImportantActionsCardProps) {
  const actions: ActionItem[] = [
    ...(canManageUsers
      ? [
          {
            id: "usuarios",
            title: "Aprobar usuarios pendientes",
            description: "Revisá altas nuevas y accesos al Prode.",
            icon: UsersRound,
            toneClassName: "bg-emerald-50 text-emerald-700",
            badge:
              pendingUserCount > 0 ? `${pendingUserCount} pendientes` : undefined,
            onClick: onGoUsers,
          },
        ]
      : []),
    ...(canManageFixture
      ? [
          {
            id: "resultados",
            title: "Cargar resultado de partido",
            description: "Actualizá resultados oficiales y estados en vivo.",
            iconSrc: "/pelota.ico",
            toneClassName: "bg-violet-50 text-violet-700",
            onClick: onGoResultados,
          },
          {
            id: "fixture",
            title: "Gestionar fixture",
            description: "Ver y editar partidos, fases y horarios.",
            icon: CalendarClock,
            toneClassName: "bg-blue-50 text-blue-700",
            onClick: onGoFixture,
          },
        ]
      : []),
    ...(canViewRanking
      ? [
          {
            id: "ranking",
            title: "Ver ranking general",
            description: "Seguimiento rápido de posiciones y puntajes.",
            icon: Trophy,
            toneClassName: "bg-amber-50 text-amber-700",
            onClick: onGoRanking,
          },
        ]
      : []),
  ];

  if (actions.length === 0) return null;

  return (
    <aside className="group relative min-w-0 overflow-hidden rounded-[30px] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#008C93]/25 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] xl:p-4 2xl:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="mb-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#008C93]">
          Acciones importantes
        </p>
        <p className="mt-1.5 text-sm font-semibold leading-5 text-slate-500">
          Accesos directos para administrar el sistema.
        </p>
      </div>

      <div className="space-y-2.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className="group flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[22px] border border-slate-200/90 bg-white/95 px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/30 hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)] xl:px-3.5"
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${action.toneClassName}`}
            >
              {action.icon ? (
                <action.icon className="h-4.5 w-4.5" />
              ) : action.iconSrc ? (
                <Image
                  src={action.iconSrc}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                />
              ) : null}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="line-clamp-2 text-[13px] font-black leading-4 text-slate-950">
                  {action.title}
                </span>
                {action.badge ? (
                  <span className="rounded-full bg-[#008C93]/10 px-2.5 py-1 text-[11px] font-black text-[#008C93]">
                    {action.badge}
                  </span>
                ) : null}
              </span>

              <span className="mt-0.5 block line-clamp-2 text-[11px] font-semibold leading-4 text-slate-500">
                {action.description}
              </span>
            </span>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#008C93]" />
          </button>
        ))}
      </div>
    </aside>
  );
}
