"use client";

import type { MatchIncident } from "@/features/partidos/types/fixture-details";
import { IncidentTimelineItem } from "./IncidentTimelineItem";

type IncidentTimelineProps = {
  incidencias: MatchIncident[];
  onEdit?: (id: string) => void;
  onRemove: (id: string) => void;
};

export function IncidentTimeline({
  incidencias,
  onEdit,
  onRemove,
}: IncidentTimelineProps) {
  if (incidencias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.04] px-4 py-6 text-sm text-white/55">
        Todavía no cargaste incidencias para este partido.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incidencias
        .slice()
        .sort((a, b) => a.minuto - b.minuto)
        .map((incident) => (
          <IncidentTimelineItem
            key={incident.id}
            incident={incident}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
}
