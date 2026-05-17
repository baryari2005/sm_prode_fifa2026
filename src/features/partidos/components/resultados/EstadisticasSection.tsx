"use client";

import Image from "next/image";
import { SectionCard } from "./common/SectionCard";
import { Input } from "@/components/ui/input";

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
      title="Estadísticas del equipo"
      description="Carga los valores manuales que después se mostrarán en el detalle del fixture."
      // actions={
      //   <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
      //     <Upload className="mr-2 h-4 w-4" />
      //     {importing ? "Importando..." : "Importar Excel/JSON"}

      //     <input
      //       type="file"
      //       className="hidden"
      //       accept=".json,.xlsx,.xls,.csv"
      //       onChange={(event) => {
      //         const file = event.target.files?.[0];

      //         if (file) {
      //           void onImport(file);
      //         }

      //         event.currentTarget.value = "";
      //       }}
      //     />
      //   </label>
      // }
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4">
          <TeamHeader
            name={localNombre}
            flagUrl={localBanderaUrl}
            align="left"
          />

          <div className="text-center text-xs font-black uppercase tracking-[0.22em] text-[#008C93]/70">
            VS
          </div>

          <TeamHeader
            name={visitanteNombre}
            flagUrl={visitanteBanderaUrl}
            align="right"
          />
        </div>

        <div className="divide-y divide-slate-100">
          {TEAM_STAT_DEFINITIONS.map((stat) => (
            <div
              key={stat.key}
              className="grid grid-cols-1 items-center gap-3 px-4 py-3 md:grid-cols-[minmax(120px,1fr)_220px_minmax(120px,1fr)]"
            >
              <StatInput
                value={estadisticasLocal[stat.key]}
                onChange={(value) => onLocalStatChange(stat.key, value)}
              />

              <div className="order-first text-center text-sm font-semibold text-slate-700 md:order-none">
                {stat.label}
              </div>

              <StatInput
                value={estadisticasVisitante[stat.key]}
                onChange={(value) => onVisitanteStatChange(stat.key, value)}
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
  const flag = flagUrl ? (
    <Image
      src={flagUrl}
      alt={name}
      width={40}
      height={28}
      unoptimized
      className="h-7 w-10 shrink-0 object-cover shadow-sm"
    />
  ) : null;

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {align === "left" ? (
        <>
          <span className="truncate text-base font-black text-slate-950">
            {name}
          </span>
          {flag}
        </>
      ) : (
        <>
          {flag}
          <span className="truncate text-base font-black text-slate-950">
            {name}
          </span>
        </>
      )}
    </div>
  );
}

function StatInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      value={String(value ?? 0)}
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
      className="mx-auto h-11 w-full max-w-[180px] rounded-xl border-slate-200 bg-white text-center text-lg font-bold text-slate-950 shadow-sm focus-visible:ring-2 focus-visible:ring-[#008C93]/20"
    />
  );
}
