"use client";

import Image from "next/image";
import { useState } from "react";

import { LineupEditorCard } from "@/features/partidos/components/LineupEditorCard";
import { SectionCard } from "./common/SectionCard";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type AlineacionesSectionProps = {
  localNombre: string;
  visitanteNombre: string;
  localCodigo?: string | null;
  visitanteCodigo?: string | null;
  localBanderaUrl?: string | null;
  visitanteBanderaUrl?: string | null;
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  plantelLocal: JugadorSeleccion[];
  plantelVisitante: JugadorSeleccion[];
  onLocalChange: (lineup: TeamLineup) => void;
  onVisitanteChange: (lineup: TeamLineup) => void;
};

type ActiveTeam = "local" | "visitante";

export function AlineacionesSection({
  localNombre,
  visitanteNombre,
  localCodigo,
  visitanteCodigo,
  localBanderaUrl,
  visitanteBanderaUrl,
  alineacionLocal,
  alineacionVisitante,
  plantelLocal,
  plantelVisitante,
  onLocalChange,
  onVisitanteChange,
}: AlineacionesSectionProps) {
  const [activeTeam, setActiveTeam] = useState<ActiveTeam>("local");

  const activeLineupData =
    activeTeam === "local"
      ? {
          title: localNombre,
          teamCode: localCodigo,
          flagUrl: localBanderaUrl,
          lineup: alineacionLocal,
          squad: plantelLocal,
          onChange: onLocalChange,
        }
      : {
          title: visitanteNombre,
          teamCode: visitanteCodigo,
          flagUrl: visitanteBanderaUrl,
          lineup: alineacionVisitante,
          squad: plantelVisitante,
          onChange: onVisitanteChange,
        };

  return (
    <SectionCard
      title="Alineaciones de los equipos"
      description="Define formaciones, titulares, suplentes y eventos individuales para cada selección."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <TeamTabButton
              label={localNombre}
              flagUrl={localBanderaUrl}
              active={activeTeam === "local"}
              onClick={() => setActiveTeam("local")}
            />

            <TeamTabButton
              label={visitanteNombre}
              flagUrl={visitanteBanderaUrl}
              active={activeTeam === "visitante"}
              onClick={() => setActiveTeam("visitante")}
            />
          </div>
        </div>

        <div className="min-w-0">
          <LineupEditorCard
            title={activeLineupData.title}
            teamCode={activeLineupData.teamCode}
            flagUrl={activeLineupData.flagUrl}
            lineup={activeLineupData.lineup}
            squad={activeLineupData.squad}
            onChange={activeLineupData.onChange}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function TeamTabButton({
  label,
  flagUrl,
  active,
  onClick,
}: {
  label: string;
  flagUrl?: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 min-w-0 items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
        active
          ? "bg-[#008C93] text-white shadow-sm"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {flagUrl ? (
        <Image
          src={flagUrl}
          alt={label}
          width={36}
          height={24}
          unoptimized
          className="h-6 w-9 shrink-0 object-cover shadow-sm"
        />
      ) : null}

      <span className="truncate">{label}</span>
    </button>
  );
}
