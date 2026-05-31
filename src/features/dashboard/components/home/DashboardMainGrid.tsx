"use client";

import { LiveMatchesCard } from "@/features/dashboard/components/home/LiveMatchesCard";
import { QuickActionsCard } from "@/features/dashboard/components/home/QuickActionsCard";
import { RankingPreviewCard } from "@/features/dashboard/components/home/RankingPreviewCard";
import { UpcomingMatchesCard } from "@/features/dashboard/components/home/UpcomingMatchesCard";
import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

type RankingDestacadoItem = {
  usuarioId: string;
  posicion?: number | null;
  nombre: string;
  puntosTotales: number;
};

type DashboardMainGridProps = {
  rankingDestacado: RankingDestacadoItem[];
  currentUserId?: string | null;
  partidosEnJuego: PartidoConRelaciones[];
  proximosPartidos: PartidoConRelaciones[];
  now: number;
  canAccessPronosticos: boolean;
  canAccessRanking: boolean;
  canViewPartidoDetalle: boolean;
  showAdminFixtureActions: boolean;
  showAdminTablaPosicionesAction: boolean;
  showAdminGoleadoresAction: boolean;
  showAdminSimularCrucesAction: boolean;
  onGoPronosticos: () => void;
  onGoRanking: () => void;
  onGoFixture: () => void;
  onGoTablaPosiciones: () => void;
  onGoGoleadores: () => void;
  onGoSimularCruces: () => void;
  onGoPartido: (partidoId: string) => void;
  onGoPronosticoPartido: (partidoId: string) => void;
};

export function DashboardMainGrid({
  rankingDestacado,
  currentUserId,
  partidosEnJuego,
  proximosPartidos,
  now,
  canAccessPronosticos,
  canAccessRanking,
  canViewPartidoDetalle,
  showAdminFixtureActions,
  showAdminTablaPosicionesAction,
  showAdminGoleadoresAction,
  showAdminSimularCrucesAction,
  onGoPronosticos,
  onGoRanking,
  onGoFixture,
  onGoTablaPosiciones,
  onGoGoleadores,
  onGoSimularCruces,
  onGoPartido,
  onGoPronosticoPartido,
}: DashboardMainGridProps) {
  const actionLabel = showAdminFixtureActions
    ? "Ver fixture completo"
    : canAccessPronosticos
      ? "Ver todos"
      : null;

  const canOpenLiveMatch =
    showAdminFixtureActions || canAccessPronosticos || canViewPartidoDetalle;
  const canOpenUpcomingMatch = canAccessPronosticos;

  return (
    <div className="space-y-5">
      <section className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-[1.35fr_1.2fr_0.82fr] 2xl:gap-5">
        <LiveMatchesCard
          partidosEnJuego={partidosEnJuego}
          proximosPartidos={proximosPartidos}
          now={now}
          actionLabel={actionLabel}
          canGoFixture={showAdminFixtureActions || canAccessPronosticos}
          canOpenPartido={canOpenLiveMatch}
          onGoPartido={onGoPartido}
          onGoFixture={onGoFixture}
        />

        <UpcomingMatchesCard
          proximosPartidos={proximosPartidos}
          now={now}
          actionLabel={actionLabel}
          canGoFixture={showAdminFixtureActions || canAccessPronosticos}
          canOpenPronosticoPartido={canOpenUpcomingMatch}
          onGoPronosticoPartido={onGoPronosticoPartido}
          onGoFixture={onGoFixture}
        />

        <RankingPreviewCard
          rankingDestacado={rankingDestacado}
          currentUserId={currentUserId}
          canAccessRanking={canAccessRanking}
          onGoRanking={onGoRanking}
        />
      </section>

      <QuickActionsCard
        canAccessPronosticos={canAccessPronosticos}
        canAccessRanking={canAccessRanking}
        showAdminFixtureActions={showAdminFixtureActions}
        showAdminTablaPosicionesAction={showAdminTablaPosicionesAction}
        showAdminGoleadoresAction={showAdminGoleadoresAction}
        showAdminSimularCrucesAction={showAdminSimularCrucesAction}
        onGoPronosticos={onGoPronosticos}
        onGoFixture={onGoFixture}
        onGoRanking={onGoRanking}
        onGoTablaPosiciones={onGoTablaPosiciones}
        onGoGoleadores={onGoGoleadores}
        onGoSimularCruces={onGoSimularCruces}
      />
    </div>
  );
}
