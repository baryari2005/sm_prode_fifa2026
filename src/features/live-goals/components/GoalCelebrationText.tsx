"use client";

import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

import { FlagImage } from "@/components/ui/flag-image";

type GoalCelebrationTextProps = {
  variant?: "goal" | "kickoff" | "halftime" | "final";
  teamName: string;
  teamFlagSrc?: string | null;
  teamFlagCode?: string | null;
  localTeamName?: string;
  localTeamFlagSrc?: string | null;
  localTeamFlagCode?: string | null;
  visitanteTeamName?: string;
  visitanteTeamFlagSrc?: string | null;
  visitanteTeamFlagCode?: string | null;
  scorerName?: string | null;
  minute?: number | null;
  headline?: string;
  badgeText?: string;
  subtitle?: string;
};

export function GoalCelebrationText({
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
}: GoalCelebrationTextProps) {
  const defaultHeadline =
    variant === "kickoff"
      ? "ARRANCÓ"
      : variant === "halftime"
        ? "ENTRETIEMPO"
        : variant === "final"
          ? "FINAL"
          : "GOOOL";

  const defaultBadgeText =
    variant === "kickoff"
      ? "Partido iniciado"
      : variant === "halftime"
        ? "Primer tiempo terminado"
        : variant === "final"
          ? "Partido finalizado"
          : "Gol detectado";

  const secondaryLine =
    subtitle ??
    (variant === "goal"
      ? minute
        ? `Gol de ${teamName} · ${minute}'`
        : `Gol de ${teamName}`
      : teamName);

  return (
    <motion.div
      className="relative z-30 mt-3 text-center"
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.42, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300 md:text-xs">
        <PartyPopper className="h-3.5 w-3.5" />
        {badgeText ?? defaultBadgeText}
      </div>

      <h2 className="mt-4 text-5xl font-black tracking-[-0.1em] text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.85)] md:text-7xl">
        {headline ?? defaultHeadline}
      </h2>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-lg font-bold text-white/90 md:text-2xl">
        {variant === "goal" ? (
          <>
            <FlagImage
              bandera={teamFlagSrc}
              codigo={teamFlagCode}
              nombre={teamName}
              widthClassName="w-10"
              heightClassName="h-7"
              fallbackMode="dash"
              fallbackTextClassName="text-xs text-white/90"
            />
            <span>{secondaryLine}</span>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <div className="inline-flex items-center gap-2">
              <FlagImage
                bandera={localTeamFlagSrc}
                codigo={localTeamFlagCode}
                nombre={localTeamName ?? "Local"}
                widthClassName="w-10"
                heightClassName="h-7"
                fallbackMode="dash"
                fallbackTextClassName="text-xs text-white/90"
              />
              <span>{localTeamName ?? "Local"}</span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black uppercase tracking-[0.16em] text-white/75 md:text-base">
              vs
            </span>
            <div className="inline-flex items-center gap-2">
              <FlagImage
                bandera={visitanteTeamFlagSrc}
                codigo={visitanteTeamFlagCode}
                nombre={visitanteTeamName ?? "Visitante"}
                widthClassName="w-10"
                heightClassName="h-7"
                fallbackMode="dash"
                fallbackTextClassName="text-xs text-white/90"
              />
              <span>{visitanteTeamName ?? "Visitante"}</span>
            </div>
          </div>
        )}
      </div>

      {scorerName ? (
        <p className="mt-2 text-sm font-semibold text-white/70 md:text-base">
          Lo hizo {scorerName}
        </p>
      ) : null}
    </motion.div>
  );
}
