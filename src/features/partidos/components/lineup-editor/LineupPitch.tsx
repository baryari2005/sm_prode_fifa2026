"use client";

import type { DragEvent, RefObject } from "react";
import { Move, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <div className="rounded-[1.6rem] border border-[#008C93]/12 bg-gradient-to-b from-[#F7FDFC] via-white to-[#F7FAFC] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Move className="h-4 w-4 text-[#008C93]" />
            Posiciones en cancha
          </div>

          {formationPreviewRows ? (
            <p className="text-xs text-[#008C93]">
              Distribución detectada: {formationPreviewRows.join("-")}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Escribí una formación como 4-4-2 o 4-3-3 para acomodar los
              jugadores.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-slate-200"
          onClick={onApplyFormationLayout}
          disabled={applyFormationDisabled}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Aplicar distribución
        </Button>
      </div>

      <div
        ref={pitchRef}
        className="relative min-h-[360px] overflow-hidden rounded-[1.8rem] bg-[#2FA34A] p-4 text-white shadow-inner md:min-h-[430px] md:p-6"
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onPitchDragLeave}
        onDrop={onPitchDrop}
      >
        <div className="absolute inset-4 rounded-[1.5rem] border border-white/35 md:inset-6" />

        <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-white/35" />

        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 md:h-36 md:w-36" />

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />

        <div className="absolute left-1/2 top-6 h-20 w-56 -translate-x-1/2 border-x border-b border-white/35 md:h-24 md:w-72" />

        <div className="absolute bottom-6 left-1/2 h-20 w-56 -translate-x-1/2 border-x border-t border-white/35 md:h-24 md:w-72" />

        <div className="absolute left-1/2 top-6 h-8 w-28 -translate-x-1/2 border-x border-b border-white/35 md:w-36" />

        <div className="absolute bottom-6 left-1/2 h-8 w-28 -translate-x-1/2 border-x border-t border-white/35 md:w-36" />

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
              onDragOver={(event) =>
                onStarterDragOver(event, player.jugadorId)
              }
              onDrop={(event) => onStarterDrop(event, player.jugadorId)}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-move text-center transition ${
                draggingStarterId === player.jugadorId
                  ? "scale-105 opacity-80"
                  : ""
              } ${
                hoveredStarterId === player.jugadorId
                  ? "drop-shadow-[0_0_0.75rem_rgba(255,255,255,0.55)]"
                  : ""
              }`}
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black shadow-lg transition md:h-14 md:w-14 md:text-lg ${
                  hoveredStarterId === player.jugadorId
                    ? "border-[#FDBB30] bg-[#0A5DB4] ring-4 ring-[#FDBB30]/35"
                    : "border-white/80 bg-[#0B66C3]"
                }`}
              >
                {player.numero ?? "-"}
              </div>

              <p className="mt-1 max-w-[92px] truncate whitespace-nowrap text-[11px] font-black drop-shadow md:mt-2 md:max-w-[150px] md:text-sm">
                {player.nombre}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}