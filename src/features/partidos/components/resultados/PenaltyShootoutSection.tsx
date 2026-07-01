"use client";

import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
import type { ResultadoFormState } from "@/features/partidos/types/resultado-manual.types";

type TeamPenaltyOption = {
  id: string;
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
};

type PenaltyShootoutSectionProps = {
  local: TeamPenaltyOption;
  visitante: TeamPenaltyOption;
  form: ResultadoFormState;
  disabled?: boolean;
  onChange: (patch: Partial<ResultadoFormState>) => void;
};

function cleanPenaltyValue(value: string) {
  const onlyNumbers = value.replace(/\D/g, "");

  if (onlyNumbers === "") return "";

  return String(Math.min(Number(onlyNumbers), 99));
}

function getPenaltyWinner(form: ResultadoFormState) {
  const local = form.penalesLocal === "" ? null : Number(form.penalesLocal);
  const visitante =
    form.penalesVisitante === "" ? null : Number(form.penalesVisitante);

  if (local === null || visitante === null || local === visitante) return null;

  return local > visitante ? "local" : "visitante";
}

export function PenaltyShootoutSection({
  local,
  visitante,
  form,
  disabled = false,
  onChange,
}: PenaltyShootoutSectionProps) {
  const winner = getPenaltyWinner(form);

  function selectWinner(side: "local" | "visitante") {
    if (side === "local") {
      onChange({
        penalesLocal: "5",
        penalesVisitante: "4",
      });
      return;
    }

    onChange({
      penalesLocal: "4",
      penalesVisitante: "5",
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            <ShieldCheck className="h-4 w-4" />
            Definicion por penales
          </p>
          <p className="max-w-2xl text-sm leading-6 text-white/68">
            Como el partido termino empatado en una fase eliminatoria, indica
            quien paso de ronda. Este dato define si los empates de
            eliminatorias pueden sumar puntos.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
          <TeamWinnerButton
            team={local}
            selected={winner === "local"}
            disabled={disabled}
            onClick={() => selectWinner("local")}
          />
          <TeamWinnerButton
            team={visitante}
            selected={winner === "visitante"}
            disabled={disabled}
            onClick={() => selectWinner("visitante")}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
        <PenaltyScoreInput
          label={local.nombre}
          value={form.penalesLocal}
          disabled={disabled}
          onChange={(value) => onChange({ penalesLocal: cleanPenaltyValue(value) })}
        />
        <span className="hidden pb-3 text-center text-xs font-black uppercase tracking-[0.18em] text-white/42 sm:block">
          penales
        </span>
        <PenaltyScoreInput
          label={visitante.nombre}
          value={form.penalesVisitante}
          disabled={disabled}
          onChange={(value) =>
            onChange({ penalesVisitante: cleanPenaltyValue(value) })
          }
        />
      </div>
    </section>
  );
}

function TeamWinnerButton({
  team,
  selected,
  disabled,
  onClick,
}: {
  team: TeamPenaltyOption;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-auto min-h-12 justify-start gap-2 rounded-2xl px-3 py-2 text-left shadow-none",
        selected
          ? "border-[#FAB438]/45 bg-[#FAB438]/18 text-white hover:bg-[#FAB438]/22 hover:text-white"
          : "border-white/10 bg-white/[0.06] text-white/78 hover:bg-white/[0.1] hover:text-white",
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
        Pasa {team.nombre}
      </span>
    </Button>
  );
}

function PenaltyScoreInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block truncate text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
        {label}
      </span>
      <Input
        value={value}
        disabled={disabled}
        inputMode="numeric"
        maxLength={2}
        onFocus={(event) => event.target.select()}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border-white/10 bg-white/10 text-center text-lg font-black text-white placeholder:text-white/28 disabled:opacity-60"
      />
    </label>
  );
}
