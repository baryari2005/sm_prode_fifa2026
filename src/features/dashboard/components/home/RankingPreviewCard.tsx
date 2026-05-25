"use client";

import { ArrowRight, Trophy } from "lucide-react";

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
    <article className="group relative min-w-0 overflow-hidden rounded-[30px] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-[#008C93]/25 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] xl:p-4 2xl:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Ranking rápido
            </p>
            <h2 className="text-base font-black tracking-[-0.04em] text-slate-950 xl:text-lg">
              Top participantes
            </h2>
          </div>
        </div>

        {canAccessRanking ? (
          <button
            type="button"
            onClick={onGoRanking}
            className="inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-black text-slate-500 transition hover:text-slate-900"
          >
            Ver ranking completo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {rankingDestacado.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
          Todavía no hay ranking disponible.
        </div>
      ) : (
        <div className="space-y-3">
          {rankingDestacado.slice(0, 3).map((row, index) => {
            const active = row.usuarioId === currentUserId;

            return (
              <div
                key={row.usuarioId}
                className={`flex min-w-0 items-center justify-between gap-3 rounded-[22px] border px-3.5 py-3.5 transition-all duration-200 xl:px-4 xl:py-4 ${
                  active
                    ? "border-[#008C93]/25 bg-[#008C93]/[0.07]"
                    : "border-slate-200/90 bg-white/95 hover:border-[#008C93]/25"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700">
                    {row.posicion ?? index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {row.nombre}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {getRankingLabel(index)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-sm font-black text-slate-950 xl:text-base">
                    {row.puntosTotales} pts
                  </span>
                  <span className="text-lg">{getMedal(index)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
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
