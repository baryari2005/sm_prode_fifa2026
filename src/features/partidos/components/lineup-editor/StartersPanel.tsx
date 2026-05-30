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
  compactPlayers?: boolean;
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
  compactPlayers = false,
}: StartersPanelProps) {
  return (
    <PlayersPanel
      title="Titulares"
      description="Agregá hasta 11 titulares y reordenalos arrastrando sobre la lista."
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
          <div className="flex items-center gap-2 rounded-xl border border-[#AEEBFF]/18 bg-[#5993B6]/10 px-3 py-2 text-sm text-white/72">
            <Info className="h-4 w-4 shrink-0 text-[#AEEBFF]" />
            Podés arrastrar los titulares para cambiar el orden.
          </div>

          <div className={compactPlayers ? "grid gap-2 xl:grid-cols-2" : "space-y-2"}>
            {players.map((player, index) => (
              <PlayerRow
                key={`${player.jugadorId}-${index}`}
                imageUrl={
                  squad.find((item) => item.id === player.jugadorId)?.fotoUrl ?? null
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
                onDragStart={() => onDraggingCardStarterIdChange(player.jugadorId)}
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
                onGoalsChange={(value) => onUpdatePlayer(index, "goals", value)}
                onYellowChange={(checked) => onUpdatePlayer(index, "yellow", checked)}
                onRedChange={(checked) => onUpdatePlayer(index, "red", checked)}
                onSubstitutedChange={(checked) =>
                  onUpdatePlayer(index, "substituted", checked)
                }
                onRemove={() => onRemovePlayer(index)}
                compact={compactPlayers}
              />
            ))}
          </div>
        </div>
      )}
    </PlayersPanel>
  );
}
