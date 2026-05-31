"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardHero } from "@/features/dashboard/components/home/DashboardHero";
import { DashboardMainGrid } from "@/features/dashboard/components/home/DashboardMainGrid";
import { DashboardStatsGrid } from "@/features/dashboard/components/home/DashboardStatsGrid";
import { ImportantActionsCard } from "@/features/dashboard/components/home/ImportantActionsCard";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { useLiveAutoRefresh } from "@/hooks/useLiveAutoRefresh";
import { useCan } from "@/hooks/useCan";
import { useAuth } from "@/stores/auth";
import { getDisplayName } from "../../features/dashboard/utils/dashboardFormat";
import { useDashboardRoleFlags } from "@/features/dashboard/hooks/useDashboardRoleFlags";
import { usePendingUsers } from "@/features/dashboard/hooks/usePendingUsers";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { useProdeDashboard } from "@/features/pronosticos/hooks/useProdeDashboard";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";

export default function DashboardPage() {
  const router = useRouter();
  const now = useCountdownNow();

  const user = useAuth((state) => state.user);
  const displayName = getDisplayName(user);
  const { isAdmin } = useDashboardRoleFlags(user);

  const canAccessPronosticosSection = useCan("pronosticos", "ver");
  const canAccessRankingSection = useCan("ranking", "ver");
  const canViewDashboardPronosticos = useCan(
    "dashboard",
    "ver_acceso_pronosticos",
  );
  const canViewDashboardRanking = useCan("dashboard", "ver_acceso_ranking");
  const canViewUsuarios = useCan("usuarios", "ver");
  const canViewPartidos = useCan("partidos", "ver");
  const canViewPartidoDetalle = useCan("partidos", "ver_detalle");

  const canAccessPronosticos =
    canAccessPronosticosSection && canViewDashboardPronosticos;
  const canAccessRanking = canAccessRankingSection && canViewDashboardRanking;
  const showPendingUsersStat = isAdmin && canViewUsuarios;
  const showAdminFixtureActions = isAdmin && canViewPartidos;

  const { count: pendingUserCount, loading: pendingUsersLoading } =
    usePendingUsers(showPendingUsersStat);

  const {
    loading,
    pronosticosCargados,
    participantes,
    totalPartidos,
    proximosPartidos,
    partidosEnJuego,
    rankingDestacado,
    loadData,
  } = useProdeDashboard(user?.id, {
    canLoadRanking: canAccessRanking,
  });

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const autoRefresh = useLiveAutoRefresh({
    enabled: true,
    intervalSeconds: 30,
    onRefresh: async () => {
      await loadData({ silent: true });
    },
  });

  if (loading) {
    return (
      <DashboardLoading
        badgeLabel="Loading home"        
      />
    );
  }

  const roleName = user?.rol?.nombre ?? "User";

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

          <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
            <DashboardHero
              displayName={displayName}
              roleName={roleName}
              pronosticosCargados={pronosticosCargados}
              totalPartidos={totalPartidos}
              partidosEnJuegoCount={partidosEnJuego.length}
              isAutoRefreshing={autoRefresh.isRefreshing}
              nextAutoRefreshIn={autoRefresh.nextRefreshIn}
              lastAutoRefreshAt={autoRefresh.lastRefreshAt}
            />

            <ImportantActionsCard
              pendingUserCount={pendingUserCount}
              canManageUsers={showPendingUsersStat}
              canManageFixture={showAdminFixtureActions}
              canViewRanking={canAccessRanking}
              onGoUsers={() => {
                if (!showPendingUsersStat) return;
                router.push("/users");
              }}
              onGoResultados={() => {
                if (!showAdminFixtureActions) return;
                router.push("/admin/partidos");
              }}
              onGoFixture={() => {
                if (!showAdminFixtureActions) return;
                router.push("/admin/partidos");
              }}
              onGoRanking={() => {
                if (!canAccessRanking) return;
                router.push("/ranking");
              }}
            />
          </div>
        </section>

        <DashboardStatsGrid
          pronosticosCargados={pronosticosCargados}
          totalPartidos={totalPartidos}
          participantes={participantes}
          showPendingUsers={showPendingUsersStat}
          pendingUserCount={pendingUserCount}
          pendingUsersLoading={pendingUsersLoading}
          partidosEnJuegoCount={partidosEnJuego.length}
        />

        <DashboardMainGrid
          rankingDestacado={rankingDestacado}
          currentUserId={user?.id}
          partidosEnJuego={partidosEnJuego}
          proximosPartidos={proximosPartidos}
          now={now}
          canAccessPronosticos={canAccessPronosticos}
          canAccessRanking={canAccessRanking}
          canViewPartidoDetalle={canViewPartidoDetalle}
          showAdminFixtureActions={showAdminFixtureActions}
          showAdminTablaPosicionesAction={showAdminFixtureActions}
          showAdminGoleadoresAction={showAdminFixtureActions}
          showAdminSimularCrucesAction={showAdminFixtureActions}
          onGoPronosticos={() => {
            if (!canAccessPronosticos) return;
            router.push("/pronosticos");
          }}
          onGoRanking={() => {
            if (!canAccessRanking) return;
            router.push("/ranking");
          }}
          onGoFixture={() => {
            if (showAdminFixtureActions) {
              router.push("/admin/partidos");
              return;
            }

            if (!canAccessPronosticos) return;
            router.push("/pronosticos");
          }}
          onGoTablaPosiciones={() => {
            if (!showAdminFixtureActions) return;
            router.push("/admin/tabla-posiciones");
          }}
          onGoGoleadores={() => {
            if (!showAdminFixtureActions) return;
            router.push("/admin/goleadores");
          }}
          onGoSimularCruces={() => {
            if (!showAdminFixtureActions) return;
            router.push("/admin/cruces");
          }}
          onGoPartido={(partidoId) => {
            if (showAdminFixtureActions) {
              router.push(`/admin/partidos/${partidoId}`);
              return;
            }

            if (canViewPartidoDetalle) {
              router.push(`/admin/partidos/${partidoId}`);
              return;
            }

            if (!canAccessPronosticos) return;
            router.push(`/pronosticos?partido=${partidoId}`);
          }}
          onGoPronosticoPartido={(partidoId) => {
            if (!canAccessPronosticos) return;
            router.push(`/pronosticos/rapido?partidoId=${partidoId}`);
          }}
        />

        <footer className="flex flex-col items-center justify-between gap-2 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4 text-center text-xs font-semibold text-white/74 shadow-[0_14px_32px_rgba(30,44,70,0.14)] backdrop-blur sm:flex-row">
          <span>Prode Mundial © 2026</span>
          <span className="text-white/54">
            Competí, pronosticá y seguí el torneo en tiempo real.
          </span>
        </footer>
      </div>
    </main>
  );
}
