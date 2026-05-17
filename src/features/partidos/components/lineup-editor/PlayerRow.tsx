"use client";

import type { DragEvent } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlayerJerseyAvatar } from "@/features/partidos/components/detalle/lineups/PlayerJerseyAvatar";

import { BooleanField } from "./BooleanField";
import { NumberField } from "./NumberField";

type PlayerRowProps = {
  imageUrl?: string | null;
  teamCode?: string | null;
  teamName: string;
  playerName: string;
  playerNumber?: number | null;
  playerRole: string;
  goals: number;
  yellow: boolean;
  red: boolean;
  substituted: boolean;

  draggable?: boolean;
  isDragging?: boolean;

  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;

  onGoalsChange: (value: number) => void;
  onYellowChange: (checked: boolean) => void;
  onRedChange: (checked: boolean) => void;
  onSubstitutedChange: (checked: boolean) => void;
  onRemove: () => void;
};

export function PlayerRow({
  imageUrl,
  teamCode,
  teamName,
  playerName,
  playerNumber,
  playerRole,
  goals,
  yellow,
  red,
  substituted,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onGoalsChange,
  onYellowChange,
  onRedChange,
  onSubstitutedChange,
  onRemove,
}: PlayerRowProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-[1.15rem] border border-slate-200/90 bg-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(210px,1fr)_90px_1fr_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <PlayerJerseyAvatar
            imageUrl={imageUrl}
            teamCode={teamCode}
            teamName={teamName}
            number={playerNumber}
            className="h-12 w-12 rounded-xl"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">
              {playerName} {playerNumber ? `#${playerNumber}` : ""}
            </p>

            <p className="text-xs font-semibold text-[#008C93]">{playerRole}</p>
          </div>
        </div>

        <NumberField label="Goles" value={goals} onChange={onGoalsChange} />

        <div className="grid gap-2 sm:grid-cols-3">
          <BooleanField
            label="Amarilla"
            checked={yellow}
            onChange={onYellowChange}
          />

          <BooleanField label="Roja" checked={red} onChange={onRedChange} />

          <BooleanField
            label="Cambio"
            checked={substituted}
            onChange={onSubstitutedChange}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${playerName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
