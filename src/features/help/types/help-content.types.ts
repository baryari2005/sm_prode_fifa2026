import type { LucideIcon } from "lucide-react";

export type HelpStep = {
  title: string;
  description: string;
};

export type HelpFaqItem = {
  question: string;
  answer: string;
};

export type HelpSection = {
  title: string;
  description?: string;
  icon: LucideIcon;
  steps?: HelpStep[];
  points?: string[];
  note?: string;
};

export type RulesEditableContent = {
  premios: {
    primerPuesto: string;
    segundoPuesto: string;
    tercerPuesto: string;
    otrosPremios: string;
  };
  participantesHabilitados: string[];
  participantesExcluidos: string[];
  criteriosDesempate: string[];
  condicionesPremio: string[];
};
