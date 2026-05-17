"use client";

import { Info } from "lucide-react";

import { EmptyState } from "./EmptyState";
import { PlayerRow } from "./PlayerRow";


import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";
import { PlayersPanel } from "./PlayerPanel";

type LineupPlayer = TeamLineup["titulares"][number];

type PlayerEventField = "goals" | "yellow" | "red" | "substituted";
type PlayerEventValue = number | boolean;

type StartersPanelProps = {
  teamCode?: string | null;
  teamName: string;
  players: LineupPlayer[];
  squad: JugadorSeleccion[];
  availablePlayers: JugadorSeleccion[];

  selectedPlayerId: string;
  onSelectedPlayerChange: (value: string) => void;

  addDisabled: boolean;
  onAdd: () => void;

  starterRoles: Map<string, string>;

  draggingCardStarterId: string | null;
  onDraggingCardStarterIdChange: (value: string | null) => void;

  onReorderStarters: (draggedId: string, targetId: string) => void;

  onUpdatePlayer: (
    index: number,
    field: PlayerEventField,
    value: PlayerEventValue
  ) => void;

  onRemovePlayer: (index: number) => void;
};

export function StartersPanel({
  teamCode,
  teamName,
  players,
  squad,
  availablePlayers,
  selectedPlayerId,
  onSelectedPlayerChange,
  addDisabled,
  onAdd,
  starterRoles,
  draggingCardStarterId,
  onDraggingCardStarterIdChange,
  onReorderStarters,
  onUpdatePlayer,
  onRemovePlayer,
}: StartersPanelProps) {
  return (
    <PlayersPanel
      title="Titulares"
      description="Agregá hasta 11 titulares, reordenalos arrastrando y cargá eventos individuales."
      selectLabel="Agregar titular"
      selectedPlayerId={selectedPlayerId}
      onSelectedPlayerChange={onSelectedPlayerChange}
      availablePlayers={availablePlayers}
      onAdd={onAdd}
      addDisabled={addDisabled}
    >
      {players.length === 0 ? (
        <EmptyState text="Sin titulares cargados." />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#008C93]/25 bg-[#008C93]/5 px-3 py-2 text-xs text-slate-600">
            <Info className="h-4 w-4 shrink-0 text-[#008C93]" />
            Podés arrastrar los titulares para cambiar el orden.
          </div>

          {players.map((player, index) => (
            <PlayerRow
              key={`${player.jugadorId}-${index}`}
              imageUrl={
                squad.find((item) => item.id === player.jugadorId)?.fotoUrl ??
                null
              }
              teamCode={teamCode}
              teamName={teamName}
              playerName={player.nombre}
              playerNumber={player.numero}
              playerRole={starterRoles.get(player.jugadorId) ?? "Titular"}
              goals={player.goals ?? 0}
              yellow={player.yellow ?? false}
              red={player.red ?? false}
              substituted={player.substituted ?? false}
              draggable
              isDragging={draggingCardStarterId === player.jugadorId}
              onDragStart={() =>
                onDraggingCardStarterIdChange(player.jugadorId)
              }
              onDragEnd={() => onDraggingCardStarterIdChange(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();

                if (!draggingCardStarterId) {
                  return;
                }

                onReorderStarters(draggingCardStarterId, player.jugadorId);
                onDraggingCardStarterIdChange(null);
              }}
              onGoalsChange={(value) =>
                onUpdatePlayer(index, "goals", value)
              }
              onYellowChange={(checked) =>
                onUpdatePlayer(index, "yellow", checked)
              }
              onRedChange={(checked) =>
                onUpdatePlayer(index, "red", checked)
              }
              onSubstitutedChange={(checked) =>
                onUpdatePlayer(index, "substituted", checked)
              }
              onRemove={() => onRemovePlayer(index)}
            />
          ))}
        </div>
      )}
    </PlayersPanel>
  );
}
