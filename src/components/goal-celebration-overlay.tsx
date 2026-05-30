"use client";

import { useMemo } from "react";

import { brandImages } from "@/config/brand-images";
import { GoalCelebrationOverlay as GoalCelebrationOverlayView } from "@/features/live-goals/components/GoalCelebrationOverlay";
import { useGoalCelebrationStore } from "@/stores/goal-celebration";

const CELEBRATION_MASCOTS = [
  brandImages.celebrations.goals[0],
  brandImages.celebrations.goals[1],
  brandImages.celebrations.goals[2],
  brandImages.celebrations.goals[3],
  brandImages.celebrations.goals[4],
  brandImages.celebrations.goals[5],
];

const STATE_MASCOTS = {
  KICKOFF: brandImages.celebrations.kickoff,
  HALFTIME: brandImages.celebrations.halftime,
  FINAL: brandImages.celebrations.final,
} as const;

export function GoalCelebrationOverlay() {
  const currentEvent = useGoalCelebrationStore((state) => state.currentEvent);
  const shiftQueue = useGoalCelebrationStore((state) => state.shiftQueue);

  const mascotSrc = useMemo(() => {
    if (!currentEvent) return CELEBRATION_MASCOTS[0];

    if (currentEvent.kind !== "GOAL") {
      return STATE_MASCOTS[currentEvent.kind];
    }

    const hash = currentEvent.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return CELEBRATION_MASCOTS[hash % CELEBRATION_MASCOTS.length];
  }, [currentEvent]);

  const overlayCopy = useMemo(() => {
    if (!currentEvent) {
      return {
        variant: "goal" as const,
        teamName: "",
        teamFlagSrc: null,
        teamFlagCode: null,
        localTeamName: "",
        localTeamFlagSrc: null,
        localTeamFlagCode: null,
        visitanteTeamName: "",
        visitanteTeamFlagSrc: null,
        visitanteTeamFlagCode: null,
        headline: undefined,
        badgeText: undefined,
        subtitle: undefined,
      };
    }

    if (currentEvent.kind === "KICKOFF") {
      return {
        variant: "kickoff" as const,
        teamName: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
        teamFlagSrc: null,
        teamFlagCode: null,
        localTeamName: currentEvent.localNombre,
        localTeamFlagSrc: currentEvent.localBandera ?? null,
        localTeamFlagCode: currentEvent.localCodigo ?? null,
        visitanteTeamName: currentEvent.visitanteNombre,
        visitanteTeamFlagSrc: currentEvent.visitanteBandera ?? null,
        visitanteTeamFlagCode: currentEvent.visitanteCodigo ?? null,
        headline: "ARRANCÓ",
        badgeText: "Partido iniciado",
        subtitle: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
      };
    }

    if (currentEvent.kind === "HALFTIME") {
      return {
        variant: "halftime" as const,
        teamName: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
        teamFlagSrc: null,
        teamFlagCode: null,
        localTeamName: currentEvent.localNombre,
        localTeamFlagSrc: currentEvent.localBandera ?? null,
        localTeamFlagCode: currentEvent.localCodigo ?? null,
        visitanteTeamName: currentEvent.visitanteNombre,
        visitanteTeamFlagSrc: currentEvent.visitanteBandera ?? null,
        visitanteTeamFlagCode: currentEvent.visitanteCodigo ?? null,
        headline: "ENTRETIEMPO",
        badgeText: "Primer tiempo terminado",
        subtitle: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
      };
    }

    if (currentEvent.kind === "FINAL") {
      return {
        variant: "final" as const,
        teamName: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
        teamFlagSrc: null,
        teamFlagCode: null,
        localTeamName: currentEvent.localNombre,
        localTeamFlagSrc: currentEvent.localBandera ?? null,
        localTeamFlagCode: currentEvent.localCodigo ?? null,
        visitanteTeamName: currentEvent.visitanteNombre,
        visitanteTeamFlagSrc: currentEvent.visitanteBandera ?? null,
        visitanteTeamFlagCode: currentEvent.visitanteCodigo ?? null,
        headline: "FINAL",
        badgeText: "Partido finalizado",
        subtitle: `${currentEvent.localNombre} vs ${currentEvent.visitanteNombre}`,
      };
    }

    return {
      variant: "goal" as const,
      teamName: currentEvent.seleccionNombre ?? "",
      teamFlagSrc: currentEvent.bandera ?? null,
      teamFlagCode: currentEvent.codigo ?? null,
      localTeamName: currentEvent.localNombre,
      localTeamFlagSrc: currentEvent.localBandera ?? null,
      localTeamFlagCode: currentEvent.localCodigo ?? null,
      visitanteTeamName: currentEvent.visitanteNombre,
      visitanteTeamFlagSrc: currentEvent.visitanteBandera ?? null,
      visitanteTeamFlagCode: currentEvent.visitanteCodigo ?? null,
      headline: undefined,
      badgeText: undefined,
      subtitle: undefined,
    };
  }, [currentEvent]);

  return (
    <GoalCelebrationOverlayView
      open={Boolean(currentEvent)}
      variant={overlayCopy.variant}
      teamName={overlayCopy.teamName}
      teamFlagSrc={overlayCopy.teamFlagSrc}
      teamFlagCode={overlayCopy.teamFlagCode}
      localTeamName={overlayCopy.localTeamName}
      localTeamFlagSrc={overlayCopy.localTeamFlagSrc}
      localTeamFlagCode={overlayCopy.localTeamFlagCode}
      visitanteTeamName={overlayCopy.visitanteTeamName}
      visitanteTeamFlagSrc={overlayCopy.visitanteTeamFlagSrc}
      visitanteTeamFlagCode={overlayCopy.visitanteTeamFlagCode}
      minute={null}
      scorerName={null}
      headline={overlayCopy.headline}
      badgeText={overlayCopy.badgeText}
      subtitle={overlayCopy.subtitle}
      mascotSrc={mascotSrc}
      onClose={currentEvent ? shiftQueue : undefined}
    />
  );
}
