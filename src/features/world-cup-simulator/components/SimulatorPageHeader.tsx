"use client";

import { Database, GitBranch, RefreshCcw, Shuffle, Trophy } from "lucide-react";

import { PageHeaderWithBrand } from "@/components/brand/PageHeaderWithBrand";
import { Button } from "@/components/ui/button";
import { brandImages } from "@/config/brand-images";

type SimulatorPageHeaderProps = {
  totalMatches: number;
  onReset: () => void;
  onRandomize: () => void;
  onShowBracket: () => void;
  onGenerateMatches?: () => void;
  canPersist?: boolean;
  isGeneratingMatches?: boolean;
};

export function SimulatorPageHeader({
  totalMatches,
  onReset,
  onRandomize,
  onShowBracket,
  onGenerateMatches,
  canPersist = false,
  isGeneratingMatches = false,
}: SimulatorPageHeaderProps) {
  return (
    <PageHeaderWithBrand
      badge="Simulación read-only"
      metricLabel="partidos base"
      metricValue={String(totalMatches)}
      title="Simulador de cruces"
      description="Probá distintos resultados, mirá quién clasifica y descubrí el camino al campeón sin tocar datos reales del sistema."
      imageSrc={brandImages.prode.trophyImage}
      imageAlt="Copa del Mundial"
      watermarkSrc={brandImages.institucional.masSanMiguelLogo}
      actions={
        <>
          <Button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/14 bg-white/10 text-white hover:bg-white/16"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reiniciar
          </Button>
          <Button
            type="button"
            onClick={onRandomize}
            className="rounded-full border border-[#FAB438]/35 bg-[#FAB438]/16 text-[#FFE4A3] hover:bg-[#FAB438]/22"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Completar aleatorio
          </Button>
          <Button
            type="button"
            onClick={onShowBracket}
            className="rounded-full bg-[#5993B6] text-white hover:bg-[#6da3c3]"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Ver llave
          </Button>
          {canPersist && onGenerateMatches ? (
            <Button
              type="button"
              onClick={onGenerateMatches}
              disabled={isGeneratingMatches}
              className="rounded-full border border-emerald-300/35 bg-emerald-400/12 text-emerald-100 hover:bg-emerald-400/18"
            >
              <Database className={`mr-2 h-4 w-4 ${isGeneratingMatches ? "animate-pulse" : ""}`} />
              {isGeneratingMatches ? "Cargando partidos..." : "Cargar partidos"}
            </Button>
          ) : null}
        </>
      }
    >
      <div className="flex flex-wrap gap-3">
        <div className="rounded-full border border-sky-100/14 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-100">
          Solo lectura sobre datos base
        </div>
        <div className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-200">
          Clasificados + llave + campeón
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          <Trophy className="mr-1 inline h-3.5 w-3.5" />
          MVP independiente
        </div>
      </div>
    </PageHeaderWithBrand>
  );
}
