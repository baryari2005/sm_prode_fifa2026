"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Goal,
  ShieldAlert,
  Siren,
  Square,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { IncidentType } from "@/features/partidos/types/fixture-details";

const incidentOptions: Array<{
  value: IncidentType;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "gol", label: "Gol", icon: Goal },
  { value: "tarjeta_amarilla", label: "Amarilla", icon: Square },
  { value: "tarjeta_roja", label: "Roja", icon: Square },
  { value: "cambio", label: "Cambio", icon: ArrowRightLeft },
  { value: "lesion", label: "Lesion", icon: ShieldAlert },
  { value: "penal", label: "Penal", icon: Siren },
  { value: "var", label: "VAR", icon: Video },
];

type IncidentTypeTabsProps = {
  value: IncidentType;
  onChange: (value: IncidentType) => void;
};

export function IncidentTypeTabs({ value, onChange }: IncidentTypeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {incidentOptions.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition-colors",
              active
                      ? "rounded-full bg-[#5993B6] text-white hover:bg-[#4B84A6]"
                      : "rounded-full border-white/12 bg-white/8 text-white hover:bg-white/12"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
