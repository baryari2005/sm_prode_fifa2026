"use client";

import type { DragEvent, RefObject } from "react";
import { Move, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const GRASS_TEXTURE_URL = "/ui/cesped.png";

type PitchPlayer = {
  jugadorId: string;
  nombre: string;
  numero?: number | null;
  x: number;
  y: number;
};

type LineupPitchProps = {
  pitchRef: RefObject<HTMLDivElement | null>;
  formationPreviewRows: number[] | null;
  startersOnPitch: PitchPlayer[];
  draggingStarterId: string | null;
  hoveredStarterId: string | null;
  onApplyFormationLayout: () => void;
  applyFormationDisabled: boolean;
  onPitchDrop: (event: DragEvent<HTMLDivElement>) => void;
  onPitchDragLeave: () => void;
  onStarterDragStart: (jugadorId: string) => void;
  onStarterDragEnd: () => void;
  onStarterDragOver: (
    event: DragEvent<HTMLDivElement>,
    jugadorId: string
  ) => void;
  onStarterDrop: (
    event: DragEvent<HTMLDivElement>,
    jugadorId: string
  ) => void;
};

export function LineupPitch({
  pitchRef,
  formationPreviewRows,
  startersOnPitch,
  draggingStarterId,
  hoveredStarterId,
  onApplyFormationLayout,
  applyFormationDisabled,
  onPitchDrop,
  onPitchDragLeave,
  onStarterDragStart,
  onStarterDragEnd,
  onStarterDragOver,
  onStarterDrop,
}: LineupPitchProps) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            <Move className="h-4 w-4 text-[#AEEBFF]" />
            Posiciones en cancha
          </div>

          {formationPreviewRows ? (
            <p className="text-sm text-white/72">
              Distribución detectada: {formationPreviewRows.join("-")}
            </p>
          ) : (
            <p className="text-sm text-white/58">
              Escribí una formación como 4-4-2 o 4-3-3 para acomodar los jugadores.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
          onClick={onApplyFormationLayout}
          disabled={applyFormationDisabled}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Aplicar distribución
        </Button>
      </div>

      <div
        ref={pitchRef}
        className="relative min-h-[360px] overflow-hidden rounded-[1.8rem] p-4 text-white shadow-inner md:min-h-[430px] md:p-6"
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onPitchDragLeave}
        onDrop={onPitchDrop}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#4F9A53_0%,#448D49_32%,#367A3E_68%,#2F6837_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.42] mix-blend-soft-light"
          style={{ backgroundImage: `url('${GRASS_TEXTURE_URL}')` }}
        />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_88px,rgba(0,0,0,0.055)_88px,rgba(0,0,0,0.055)_176px)] opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_18%,transparent_72%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_48%,rgba(0,0,0,0.16)_100%)]" />
        <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />

        <div className="absolute inset-4 rounded-[1.5rem] border border-white shadow-[0_0_10px_rgba(255,255,255,0.12)] md:inset-6" />
        <div className="absolute left-6 right-6 top-1/2 h-[1.5px] -translate-y-1/2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.18)]" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-[0_0_10px_rgba(255,255,255,0.12)] md:h-36 md:w-36" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute left-1/2 top-6 h-20 w-56 -translate-x-1/2 border-x border-b border-white shadow-[0_0_8px_rgba(255,255,255,0.08)] md:h-24 md:w-72" />
        <div className="absolute bottom-6 left-1/2 h-20 w-56 -translate-x-1/2 border-x border-t border-white shadow-[0_0_8px_rgba(255,255,255,0.08)] md:h-24 md:w-72" />
        <div className="absolute left-1/2 top-6 h-8 w-28 -translate-x-1/2 border-x border-b border-white shadow-[0_0_8px_rgba(255,255,255,0.08)] md:w-36" />
        <div className="absolute bottom-6 left-1/2 h-8 w-28 -translate-x-1/2 border-x border-t border-white shadow-[0_0_8px_rgba(255,255,255,0.08)] md:w-36" />
        <div className="absolute left-4 top-4 h-5 w-5 rounded-br-full border-b border-r border-white md:left-6 md:top-6" />
        <div className="absolute right-4 top-4 h-5 w-5 rounded-bl-full border-b border-l border-white md:right-6 md:top-6" />
        <div className="absolute bottom-4 left-4 h-5 w-5 rounded-tr-full border-r border-t border-white md:bottom-6 md:left-6" />
        <div className="absolute bottom-4 right-4 h-5 w-5 rounded-tl-full border-l border-t border-white md:bottom-6 md:right-6" />

        {startersOnPitch.length === 0 ? (
          <div className="relative z-10 flex min-h-[315px] items-center justify-center text-center text-sm font-medium text-white/85 md:min-h-[380px]">
            Agregá titulares para ver y editar la formación en cancha.
          </div>
        ) : (
          startersOnPitch.map((player) => (
            <div
              key={`pitch-${player.jugadorId}`}
              draggable
              onDragStart={() => onStarterDragStart(player.jugadorId)}
              onDragEnd={onStarterDragEnd}
              onDragOver={(event) => onStarterDragOver(event, player.jugadorId)}
              onDrop={(event) => onStarterDrop(event, player.jugadorId)}
              className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-move text-center transition ${
                draggingStarterId === player.jugadorId ? "scale-105 opacity-80" : ""
              } ${
                hoveredStarterId === player.jugadorId
                  ? "drop-shadow-[0_0_0.75rem_rgba(255,255,255,0.55)]"
                  : ""
              }`}
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="pointer-events-none absolute left-1/2 top-[46%] h-10 w-12 -translate-x-1/2 rounded-full bg-black/25 blur-md transition-all duration-200 group-hover:h-12 group-hover:w-14 group-hover:bg-black/35 md:h-12 md:w-14" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/16 blur-lg opacity-80 transition-all duration-200 group-hover:opacity-100 md:h-[56px] md:w-[56px]" />

                <div
                  className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black shadow-[0_12px_22px_rgba(15,23,42,0.34)] transition md:h-14 md:w-14 md:text-lg ${
                    hoveredStarterId === player.jugadorId
                      ? "border-[#AEEBFF] bg-[#1E2C46] ring-4 ring-[#AEEBFF]/25"
                      : "border-[#2A425F] bg-[#243C58]"
                  }`}
                >
                  {player.numero ?? "-"}
                </div>

                <div className="relative mt-1.5 rounded-full border border-white/25 bg-slate-950/55 px-2.5 py-1 shadow-[0_8px_18px_rgba(15,23,42,0.25)] backdrop-blur-md transition-all duration-200 group-hover:bg-slate-950/70">
                  <p className="max-w-[86px] truncate text-[10px] font-black leading-none text-white md:max-w-[110px] md:text-[11px]">
                    {player.nombre}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
