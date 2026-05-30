"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, ChevronRight, Sparkles, Trophy, UsersRound } from "lucide-react";

import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

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
          toneClassName: "bg-[#5993B6]/18 text-[#AEEBFF]",
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
          toneClassName: "bg-white/[0.08] !text-[#AEEBFF]",
          onClick: onGoResultados,
        },
        {
          id: "fixture",
          title: "Gestionar fixture",
          description: "Ver y editar partidos, fases y horarios.",
          icon: CalendarClock,
          toneClassName: "bg-white/[0.08] text-[#AEEBFF]",
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
          toneClassName: "bg-[#5993B6]/18 text-[#AEEBFF]",
          onClick: onGoRanking,
        },
      ]
      : []),
  ];

  if (actions.length === 0) return null;

  return (
    <aside className={DASHBOARD_PANEL}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <LateralSummaryHeader
        title="Acciones importantes"
        description="Accesos directos para administrar el sistema."
      />

      <div className="space-y-2.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className={`group flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[22px] px-3 py-3 text-left xl:px-3.5 ${DASHBOARD_SUBCARD}`}
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
                  className="h-[18px] w-[18px] object-contain brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(61%)_sepia(21%)_saturate(688%)_hue-rotate(162deg)_brightness(92%)_contrast(89%)]"
                />
              ) : (
                <Sparkles className="h-4.5 w-4.5" />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                  {action.title}
                </span>
                {action.badge ? (
                  <span className="rounded-full bg-[#FAB438]/12 px-2.5 py-1 text-[11px] font-black text-[#FFE4A3]">
                    {action.badge}
                  </span>
                ) : null}
              </span>

              <span className="mt-0.5 block line-clamp-2 text-[11px] font-semibold leading-4 text-white/64">
                {action.description}
              </span>
            </span>

            <ChevronRight className="h-4 w-4 shrink-0 text-[#5993B6] transition group-hover:translate-x-0.5 group-hover:text-[#AEEBFF]" />
          </button>
        ))}
      </div>
    </aside>
  );
}
