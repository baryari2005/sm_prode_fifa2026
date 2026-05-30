"use client";

import type { MatchIncident } from "@/features/partidos/types/fixture-details";

import { IncidentTimeline } from "./IncidentTimeline";
import { SectionCard } from "./common/SectionCard";

type IncidentTimelineCardProps = {
  incidencias: MatchIncident[];
  onEdit?: (id: string) => void;
  onRemove: (id: string) => void;
};

export function IncidentTimelineCard({
  incidencias,
  onEdit,
  onRemove,
}: IncidentTimelineCardProps) {
  return (
    <SectionCard
      title="Timeline de incidencias"
      description="Revisá, editá o eliminá los eventos ya cargados del partido."
      headerContent={
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Timeline de incidencias
          </p>          
        </div>
      }
    >
      <IncidentTimeline
        incidencias={incidencias}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </SectionCard>
  );
}
