"use client";

import { ChevronRight, Trophy } from "lucide-react";

import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type RankingDestacadoItem = {
  usuarioId: string;
  posicion?: number | null;
  nombre: string;
  puntosTotales: number;
};

type RankingPreviewCardProps = {
  rankingDestacado: RankingDestacadoItem[];
  currentUserId?: string | null;
  canAccessRanking: boolean;
  onGoRanking: () => void;
};

export function RankingPreviewCard({
  rankingDestacado,
  currentUserId,
  canAccessRanking,
  onGoRanking,
}: RankingPreviewCardProps) {
  return (
    <article className={DASHBOARD_PANEL}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#D8F2FF]">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Ranking rápido
            </p>
            <h2 className="brand-heading text-lg font-black !tracking-[0.04em] text-white xl:text-xl">
              Top participantes
            </h2>
          </div>
        </div>

        {canAccessRanking ? (
          <button
            type="button"
            onClick={onGoRanking}
            className="inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-black text-white/62 transition hover:text-white"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {rankingDestacado.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/14 bg-white/[0.04] px-4 py-10 text-center text-sm font-semibold text-white/60">
          Todavia no hay ranking disponible.
        </div>
      ) : (
        <div className="space-y-3">
          {rankingDestacado.slice(0, 3).map((row, index) => {
            const active = row.usuarioId === currentUserId;

            return (
              <div
                key={row.usuarioId}
                className={`flex min-w-0 items-center justify-between gap-3 rounded-[22px] px-3.5 py-3.5 xl:px-4 xl:py-4 ${
                  active
                    ? "border border-[#FAB438]/25 bg-[#16233a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(30,44,70,0.16)]"
                    : DASHBOARD_SUBCARD
                }`}
              >
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black ${active ? "bg-white/10 text-white" : "bg-[#5993B6]/18 text-white"}`}>
                    {row.posicion ?? index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {row.nombre}
                    </p>
                    <p className="text-xs font-semibold text-white/60">
                      {getRankingLabel(index)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-sm font-black text-white xl:text-base">
                    {row.puntosTotales} pts
                  </span>
                  <span className="text-lg">{getMedal(index)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/60">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        El ranking se actualiza en tiempo real.
      </div>
    </article>
  );
}

function getRankingLabel(index: number) {
  if (index === 0) return "Liderando el torneo";
  if (index === 1) return "Muy cerca de la cima";
  return "Peleando el podio";
}

function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  return "🥉";
}
