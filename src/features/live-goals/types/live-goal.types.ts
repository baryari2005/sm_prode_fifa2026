export type GoalCelebrationOverlayProps = {
  open: boolean;
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
  mascotSrc: string;
  onClose?: () => void;
};

export type GoalCelebrationParticle = {
  id: number;
  left: string;
  top: string;
  size: string;
  color: string;
  duration: number;
  delay: number;
  x: number;
  y: number;
  rotate: number;
};
