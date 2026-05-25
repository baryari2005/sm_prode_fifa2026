"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { GoalCelebrationConfetti } from "@/features/live-goals/components/GoalCelebrationConfetti";
import { GoalCelebrationMascot } from "@/features/live-goals/components/GoalCelebrationMascot";
import { GoalCelebrationText } from "@/features/live-goals/components/GoalCelebrationText";
import type { GoalCelebrationOverlayProps } from "@/features/live-goals/types/live-goal.types";

const DURATION_BY_VARIANT = {
  goal: 4700,
  kickoff: 4200,
  halftime: 5200,
  final: 6200,
} as const;

export function GoalCelebrationOverlay({
  open,
  variant = "goal",
  teamName,
  teamFlagSrc,
  teamFlagCode,
  localTeamName,
  localTeamFlagSrc,
  localTeamFlagCode,
  visitanteTeamName,
  visitanteTeamFlagSrc,
  visitanteTeamFlagCode,
  scorerName,
  minute,
  headline,
  badgeText,
  subtitle,
  mascotSrc,
  onClose,
}: GoalCelebrationOverlayProps) {
  useEffect(() => {
    if (!open || !onClose) return;

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, DURATION_BY_VARIANT[variant]);

    return () => window.clearTimeout(timeoutId);
  }, [open, onClose, variant]);

  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-950/78 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,197,94,0.24),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(255,255,255,0.12),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_42%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(245deg,transparent_0%,rgba(255,255,255,0.06)_38%,transparent_56%)]" />

          <div className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6">
            <div className="relative flex w-full max-w-4xl flex-col items-center justify-center text-center">
              <GoalCelebrationConfetti />
              <GoalCelebrationMascot mascotSrc={mascotSrc} teamName={teamName} />
              <GoalCelebrationText
                variant={variant}
                teamName={teamName}
                teamFlagSrc={teamFlagSrc}
                teamFlagCode={teamFlagCode}
                localTeamName={localTeamName}
                localTeamFlagSrc={localTeamFlagSrc}
                localTeamFlagCode={localTeamFlagCode}
                visitanteTeamName={visitanteTeamName}
                visitanteTeamFlagSrc={visitanteTeamFlagSrc}
                visitanteTeamFlagCode={visitanteTeamFlagCode}
                scorerName={scorerName}
                minute={minute}
                headline={headline}
                badgeText={badgeText}
                subtitle={subtitle}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
