"use client";

import { Input } from "@/components/ui/input";
import { FlagImage } from "@/components/ui/flag-image";
import { SectionCard } from "./common/SectionCard";

import { TEAM_STAT_DEFINITIONS } from "@/features/partidos/types/fixture-details";
import type { TeamStats } from "@/features/partidos/types/fixture-details";

type EstadisticasSectionProps = {
  localNombre: string;
  visitanteNombre: string;
  localBanderaUrl?: string | null;
  visitanteBanderaUrl?: string | null;
  estadisticasLocal: TeamStats;
  estadisticasVisitante: TeamStats;
  importing?: boolean;
  onImport?: (file: File) => Promise<void>;
  onLocalStatChange: (key: keyof TeamStats, value: number) => void;
  onVisitanteStatChange: (key: keyof TeamStats, value: number) => void;
};

const DARK_FIELD =
  "h-12 w-full rounded-2xl border-white/10 bg-transparent px-0 text-[1.9rem] font-black text-white shadow-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#5993B6]/40 md:text-[2rem]";

export function EstadisticasSection({
  localNombre,
  visitanteNombre,
  localBanderaUrl,
  visitanteBanderaUrl,
  estadisticasLocal,
  estadisticasVisitante,
  onLocalStatChange,
  onVisitanteStatChange,
}: EstadisticasSectionProps) {
  return (
    <SectionCard
      title="Estadísticas del partido"
      description="Cargá los valores manuales que después se mostrarán en el detalle del fixture."
      headerContent={
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Estadísticas del partido
          </p>          
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] items-center gap-3 rounded-[28px] border border-white/10 bg-[#223553] px-4 py-4 md:px-5">
          <TeamHeader name={localNombre} flagUrl={localBanderaUrl} align="left" />

          <div className="text-center">
            <span className="inline-flex min-w-[72px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3 text-center text-[1.35rem] font-black uppercase tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            VS
            </span>
          </div>

          <TeamHeader
            name={visitanteNombre}
            flagUrl={visitanteBanderaUrl}
            align="right"
          />
        </div>

        <div className="space-y-4">
          {TEAM_STAT_DEFINITIONS.map((stat) => (
            <div
              key={stat.key}
              className="grid grid-cols-[88px_minmax(0,1fr)_88px] items-center gap-4 
                  rounded-[22px] border border-white/10 bg-white/[0.05] 
                px-4 md:grid-cols-[120px_minmax(0,1fr)_120px] md:px-5"
              >
              <StatInput
                value={estadisticasLocal[stat.key]}
                unit={stat.unit}
                onChange={(value) => onLocalStatChange(stat.key, value)}
                align="left"
              />

              <div className="text-center text-base font-semibold text-white/78 md:text-[1.05rem]">
                {stat.label}
              </div>

              <StatInput
                value={estadisticasVisitante[stat.key]}
                unit={stat.unit}
                onChange={(value) => onVisitanteStatChange(stat.key, value)}
                align="right"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function TeamHeader({
  name,
  flagUrl,
  align,
}: {
  name: string;
  flagUrl?: string | null;
  align: "left" | "right";
}) {
  const flag = (
    <FlagImage
      bandera={flagUrl}
      nombre={name}
      widthClassName="w-12"
      heightClassName="h-8"
      className="drop-shadow-[0_8px_16px_rgba(2,8,23,0.32)]"
      imageClassName="object-contain"
    />
  );

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {align === "left" ? (
        <>
          <span className="truncate text-[1.05rem] font-black text-white md:text-[1.15rem]">
            {name}
          </span>
          {flag}
        </>
      ) : (
        <>
          {flag}
          <span className="truncate text-[1.05rem] font-black text-white md:text-[1.15rem]">
            {name}
          </span>
        </>
      )}
    </div>
  );
}

function StatInput({
  value,
  unit,
  onChange,
  align,
}: {
  value: number;
  unit: string;
  onChange: (value: number) => void;
  align: "left" | "right";
}) {
  return (
    <div
      className={
        align === "right"
          ? "justify-self-end"
          : "justify-self-start"
      }
    >
      <Input
        type="text"
        inputMode="numeric"
        value={`${value ?? 0}${unit}`}
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        onMouseUp={(event) => {
          event.preventDefault();
        }}
        onChange={(event) => {
          const onlyNumbers = event.target.value.replace(/\D/g, "");
          onChange(onlyNumbers === "" ? 0 : Number(onlyNumbers));
        }}
        onPaste={(event) => {
          event.preventDefault();
          const pastedText = event.clipboardData.getData("text");
          const onlyNumbers = pastedText.replace(/\D/g, "");
          onChange(onlyNumbers === "" ? 0 : Number(onlyNumbers));
        }}
        className={`${DARK_FIELD} h-11 !text-[1.5rem] max-w-[96px] ${
          align === "right" ? "pr-3 text-right" : "pl-3 text-left"
        }`}
      />
    </div>
  );
}
