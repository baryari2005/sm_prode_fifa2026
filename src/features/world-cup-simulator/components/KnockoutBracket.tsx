"use client";

import { DatabaseZap, Shuffle, Trophy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { DASHBOARD_PANEL } from "@/features/dashboard/components/home/dashboard-home.styles";
import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";
import type { KnockoutRounds, TeamStanding } from "@/features/world-cup-simulator/engine/types";

import { KnockoutRoundColumn } from "./KnockoutRoundColumn";

type KnockoutBracketProps = {
  rounds: KnockoutRounds;
  champion: TeamStanding | null;
  onScoreChange: (
    matchId: string,
    side: "local" | "visitante",
    value: number | null,
    penaltyWinner?: "local" | "visitante" | null,
  ) => void;
  canPersist?: boolean;
  runningPhase?: FixturePhaseSlug | null;
  mockingPhase?: FixturePhaseSlug | null;
  onSimulatePhase?: (phase: FixturePhaseSlug) => void;
  onGenerateMocks?: (phase: FixturePhaseSlug) => void;
};

const ROUND_PHASES: Array<{ title: string; slug: FixturePhaseSlug }> = [
  { title: "32avos", slug: "dieciseisavos" },
  { title: "Octavos", slug: "octavos" },
  { title: "Cuartos", slug: "cuartos" },
  { title: "Semifinal", slug: "semis" },
  { title: "Tercer puesto", slug: "tercer-puesto" },
  { title: "Final", slug: "final" },
];

export function KnockoutBracket({
  rounds,
  champion,
  onScoreChange,
  canPersist = false,
  runningPhase = null,
  mockingPhase = null,
  onSimulatePhase,
  onGenerateMocks,
}: KnockoutBracketProps) {
  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-6`}>
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Llave final
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">Camino al campeon</h2>
        <p className="mt-2 max-w-3xl text-sm text-white/68">
          La llave se completa con los clasificados del simulador. Si un partido
          termina empatado, elegi el ganador por penales para que avance.
        </p>
        {canPersist ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {ROUND_PHASES.map((phase) => (
              <div key={phase.slug} className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSimulatePhase?.(phase.slug)}
                  disabled={runningPhase !== null}
                  className="rounded-full bg-[#5993B6] text-white hover:bg-[#6da3c3]"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  {runningPhase === phase.slug
                    ? `Finalizando ${phase.title}...`
                    : `Finalizar ${phase.title}`}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateMocks?.(phase.slug)}
                  disabled={mockingPhase !== null}
                  className="rounded-full border-white/15 bg-white/6 text-white hover:bg-white/10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {mockingPhase === phase.slug
                    ? `Mocks ${phase.title}...`
                    : `Mocks ${phase.title}`}
                </Button>
              </div>
            ))}
            <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
              <DatabaseZap className="mr-2 inline h-3.5 w-3.5" />
              Persistencia real de resultados y pronosticos mock
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-[1560px] items-start gap-6">
          <KnockoutRoundColumn
            title="32avos"
            matches={rounds.roundOf32}
            onScoreChange={onScoreChange}
          />
          <KnockoutRoundColumn
            title="Octavos"
            matches={rounds.roundOf16}
            onScoreChange={onScoreChange}
          />
          <KnockoutRoundColumn
            title="Cuartos"
            matches={rounds.quarterFinals}
            onScoreChange={onScoreChange}
          />
          <KnockoutRoundColumn
            title="Semifinal"
            matches={rounds.semiFinals}
            onScoreChange={onScoreChange}
          />

          <div className="flex min-h-[540px] items-center">
            <div className="w-[290px] rounded-[32px] border border-[#FAB438]/24 bg-[radial-gradient(circle_at_top,rgba(250,180,56,0.18),transparent_45%),linear-gradient(135deg,rgba(14,27,49,0.98)_0%,rgba(20,37,64,0.96)_100%)] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#FAB438]/30 bg-[#FAB438]/12 text-[#FFE4A3]">
                <Trophy className="h-10 w-10" />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
                Objetivo mundial
              </p>
              <h3 className="mt-2 text-3xl font-black text-white">Final</h3>
              <div className="mt-6 space-y-4">
                {rounds.final.map((match) => (
                  <div key={match.id} className="flex justify-center">
                    <div className="scale-[1.02]">
                      <KnockoutRoundColumn
                        title="Final"
                        matches={[match]}
                        onScoreChange={onScoreChange}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  Campeon
                </p>
                {champion ? (
                  <div className="mt-3 flex flex-col items-center gap-3">
                    <FlagImage
                      nombre={champion.nombre}
                      codigo={champion.codigo}
                      bandera={champion.banderaUrl}
                      widthClassName="w-14"
                      heightClassName="h-10"
                    />
                    <div>
                      <p className="text-lg font-black text-white">{champion.nombre}</p>
                      <p className="text-sm text-white/55">{champion.codigo}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-white/55">Por definir</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
