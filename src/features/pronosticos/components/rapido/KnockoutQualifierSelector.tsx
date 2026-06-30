"use client";

import { Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";

type TeamOption = {
  id: string;
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
};

type KnockoutQualifierSelectorProps = {
  local: TeamOption;
  visitante: TeamOption;
  value?: string | null;
  disabled?: boolean;
  onChange: (equipoId: string) => void;
  variant?: "light" | "dark";
};

export function KnockoutQualifierSelector({
  local,
  visitante,
  value,
  disabled = false,
  onChange,
  variant = "light",
}: KnockoutQualifierSelectorProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={[
        "rounded-2xl border p-3",
        isDark
          ? "border-white/10 bg-white/[0.06]"
          : "border-sky-100 bg-sky-50/70",
      ].join(" ")}
    >
      <div
        className={[
          "mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em]",
          isDark ? "text-[#AEEBFF]" : "text-sky-700",
        ].join(" ")}
      >
        <Trophy className="h-4 w-4" />
        Pasa por penales
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {[local, visitante].map((team) => {
          const selected = value === team.id;

          return (
            <Button
              key={team.id}
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => onChange(team.id)}
              className={[
                "h-auto min-h-11 justify-start gap-2 rounded-2xl px-3 py-2 text-left shadow-none",
                selected
                  ? isDark
                    ? "border-[#FAB438]/45 bg-[#FAB438]/18 text-white hover:bg-[#FAB438]/22 hover:text-white"
                    : "border-sky-300 bg-white text-sky-800 hover:bg-white"
                  : isDark
                    ? "border-white/10 bg-white/[0.06] text-white/78 hover:bg-white/[0.1] hover:text-white"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white",
              ].join(" ")}
            >
              <FlagImage
                bandera={team.bandera}
                codigo={team.codigo}
                nombre={team.nombre}
                widthClassName="w-7"
                heightClassName="h-5"
                fallbackMode="emoji"
                fallbackTextClassName="text-base"
              />
              <span className="min-w-0 truncate text-sm font-bold">
                {team.nombre}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
