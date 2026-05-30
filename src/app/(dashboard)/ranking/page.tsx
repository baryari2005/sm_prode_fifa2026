"use client";

import { useEffect } from "react";
import { Award, ListOrdered, Medal, Target, Trophy } from "lucide-react";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";

import { useRankingPage } from "@/features/pronosticos/hooks/useRankingPage";
import { RankingHeader } from "@/features/pronosticos/components/RankingHeader";
import { MyRankingSummary } from "@/features/pronosticos/components/MyRankingSummary";
import { RankingTable } from "@/features/pronosticos/components/RankingTable";
import { PronosticosHistorial } from "@/features/pronosticos/components/PronosticosHistorial";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

export default function RankingPage() {
  const { miRanking, ranking, historial, loading, loadData } = useRankingPage();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <DashboardLoading source="Ranking" />;
  }

  const lider = ranking[0] ?? null;
  const resumen = [
    {
      label: "Tu posicion",
      detail: "ranking general",
      value: miRanking?.posicion ? `#${miRanking.posicion}` : "-",
      icon: Trophy,
      toneClass: "bg-[#FAB438]/14 text-[#FFE4A3]",
    },
    {
      label: "Tus puntos",
      detail: "acumulados",
      value: String(miRanking?.puntosTotales ?? 0),
      icon: Target,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      label: "Participantes",
      detail: "ranking visible",
      value: String(ranking.length),
      icon: ListOrdered,
      toneClass: "bg-emerald-400/14 text-emerald-200",
    },
    {
      label: "Historial",
      detail: "pronosticos calificados",
      value: String(historial.length),
      icon: Medal,
      toneClass: "bg-white/10 text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.82fr)] xl:items-stretch">
          <RankingHeader />

          <aside className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#1E2C46] p-4 text-white shadow-[0_18px_48px_rgba(2,6,23,0.18)] xl:min-h-[248px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_36%)]" />
            <div className="relative flex h-full flex-col">
              <div className="space-y-1.5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Resumen lateral
                </p>
                <h2 className="font-brand text-[1.6rem] leading-none tracking-[0.04em] text-white">
                  Tu carrera
                </h2>
              </div>

              <div className="mt-3.5 space-y-2">
                {resumen.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className={`flex min-w-0 items-center gap-3 rounded-[20px] px-3 py-2.5 ${DASHBOARD_SUBCARD}`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${stat.toneClass}`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                          {stat.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                          {stat.detail}
                        </span>
                      </span>
                      <span className="font-brand text-[1.35rem] leading-none tracking-[0.03em] text-white">
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className={`mt-auto rounded-[22px] p-3.5 ${DASHBOARD_SUBCARD}`}>
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#FAB438]/14 text-[#FFE4A3]">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">Lider actual</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white/70">
                      {lider?.nombre ?? "Ranking en preparacion"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#AEEBFF]">
                      {lider ? `${lider.puntosTotales} puntos` : "Sin datos todavia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 space-y-6">
          <MyRankingSummary data={miRanking} />
          <RankingTable rows={ranking} />
          <PronosticosHistorial rows={historial} />
        </div>
      </section>
    </div>
  );
}
