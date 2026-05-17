"use client";

import { Download, Info, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FIXTURE_PHASE_OPTIONS,
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
  return (
    <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6" />
                Importar fixture
              </CardTitle>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>
                Sincroniza partidos del Mundial 2026 desde football-data.org.
              </span>
              <Info className="h-4 w-4 text-slate-400" />
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">            
            <Button
              type="button"
              onClick={onImport}
              disabled={!canImport || importing}
              className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
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

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Elegi la fase a importar
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedPhase === "todas" ? "default" : "outline"}
              onClick={() => onPhaseChange("todas")}
              className="rounded-2xl"
            >
              Todas las fases
            </Button>
            {FIXTURE_PHASE_OPTIONS.map((option) => (
              <Button
                key={option.slug}
                type="button"
                variant={selectedPhase === option.slug ? "default" : "outline"}
                onClick={() => onPhaseChange(option.slug)}
                className="rounded-2xl"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </CardHeader>
  );
}
