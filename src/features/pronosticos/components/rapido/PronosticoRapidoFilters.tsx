"use client";

import { Button } from "@/components/ui/button";
import { GrupoFilter } from "@/features/partidos/components/GrupoFilter";
import { PHASE_FILTERS } from "@/features/pronosticos/constants/pronostico-rapido.constants";

import type { PhaseFilterValue } from "@/features/pronosticos/types/pronostico-rapido.types";
import { Sparkles } from "lucide-react";

type PronosticoRapidoFiltersProps = {
  faseActiva: string | null;
  faseActivaLabel: string;
  mostrandoFaseGrupos: boolean;
  gruposDisponibles: string[];
  grupoSeleccionado: string | null;
  onPhaseChange: (fase: PhaseFilterValue) => void;
  onGrupoChange: (grupo: string | null) => void;
};

export function PronosticoRapidoFilters({
  faseActiva,
  faseActivaLabel,
  mostrandoFaseGrupos,
  gruposDisponibles,
  grupoSeleccionado,
  onPhaseChange,
  onGrupoChange,
}: PronosticoRapidoFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PHASE_FILTERS.map((fase) => {
          const active =
            fase.value === null
              ? faseActiva === null
              : faseActiva === fase.value;

          return (
            <Button
              key={fase.label}
              type="button"
              size="sm"
              onClick={() => onPhaseChange(fase.value)}
              variant={active ? "default" : "outline"}
            >
              {fase.label}
            </Button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#008C93]/20 bg-[#008C93]/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="mb-1 h-5 w-5 text-[#008C93]" />
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#008C93]">
            Filtro de pronósticos
          </p>
        </div>

        <h2 className="text-lg font-black tracking-tight text-slate-950">
          {faseActivaLabel}
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {faseActiva
            ? "Mostrando solamente los partidos de esta fase."
            : "Mostrando todos los partidos disponibles para pronosticar."}
        </p>
      </div>

      {mostrandoFaseGrupos && gruposDisponibles.length > 0 && (
        <GrupoFilter
          grupos={gruposDisponibles}
          grupoSeleccionado={grupoSeleccionado}
          onGrupoChange={onGrupoChange}
        />
      )}
    </div>
  );
}
