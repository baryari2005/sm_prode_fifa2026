"use client";

import { Download, Info, RefreshCw, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FIXTURE_PHASE_OPTIONS,
  getFixturePhaseLabel,
  type FixturePhaseSlug,
} from "@/features/partidos/constants/fixture-phase-filter.constants";

type ImportarPartidosHeaderProps = {
  canImport: boolean;
  importing: boolean;
  selectedPhase: FixturePhaseSlug | "todas";
  onPhaseChange: (phase: FixturePhaseSlug | "todas") => void;
  onImport: () => void;
};

export function ImportarPartidosHeader({
  canImport,
  importing,
  selectedPhase,
  onPhaseChange,
  onImport,
}: ImportarPartidosHeaderProps) {
  const selectedPhaseLabel =
    selectedPhase === "todas" ? "Todas las fases" : getFixturePhaseLabel(selectedPhase);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10">
                Fase seleccionada: {selectedPhaseLabel}
              </Badge>
              <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                Football-data API
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-white">
                <Trophy className="h-6 w-6 text-[#AEEBFF]" />
                Importar fixture
              </h3>
              <p className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                <span>Sincroniza partidos del Mundial 2026 desde football-data.org.</span>
                <Info className="h-4 w-4 text-white/45" />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <Button
              type="button"
              onClick={onImport}
              disabled={!canImport || importing}
              className="h-11 rounded-2xl bg-[#FAB438] font-bold text-[#1E2C46] shadow-lg shadow-[#FAB438]/20 transition hover:bg-[#F7C45A]"
            >
              {importing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Importar fixture API
                </>
              )}
            </Button>
          </div>
        </div>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-sm font-semibold text-white">
            Elegi la fase a importar
          </p>
          <p className="mt-1 text-sm leading-6 text-white/64">
            Podes importar todo el fixture o correr una sincronizacion puntual por fase.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => onPhaseChange("todas")}
              className={
                selectedPhase === "todas"
                  ? "rounded-2xl bg-[#5993B6] text-white hover:bg-[#6EA8CC]"
                  : "rounded-2xl border-white/10 bg-transparent text-white/74 hover:bg-white/10 hover:text-white"
              }
              variant="outline"
            >
              Todas las fases
            </Button>
            {FIXTURE_PHASE_OPTIONS.map((option) => (
              <Button
                key={option.slug}
                type="button"
                onClick={() => onPhaseChange(option.slug)}
                className={
                  selectedPhase === option.slug
                    ? "rounded-2xl bg-[#5993B6] text-white hover:bg-[#6EA8CC]"
                    : "rounded-2xl border-white/10 bg-transparent text-white/74 hover:bg-white/10 hover:text-white"
                }
                variant="outline"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
