"use client";

import { EmptyState } from "./EmptyState";
import { PlayersPanel } from "./PlayerPanel";
import { PlayerRow } from "./PlayerRow";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type LineupPlayer = TeamLineup["suplentes"][number];

type PlayerEventField = "goals" | "yellow" | "red" | "substituted";
type PlayerEventValue = number | boolean;

type BenchPanelProps = {
  teamCode?: string | null;
  teamName: string;
  players: LineupPlayer[];
  squad: JugadorSeleccion[];
  availablePlayers: JugadorSeleccion[];
  selectedPlayerId: string;
  onSelectedPlayerChange: (value: string) => void;
  addDisabled: boolean;
  onAdd: () => void;
  onUpdatePlayer: (
    index: number,
    field: PlayerEventField,
    value: PlayerEventValue
  ) => void;
  onRemovePlayer: (index: number) => void;
  compactPlayers?: boolean;
};

export function BenchPanel({
  teamCode,
  teamName,
  players,
  squad,
  availablePlayers,
  selectedPlayerId,
  onSelectedPlayerChange,
  addDisabled,
  onAdd,
  onUpdatePlayer,
  onRemovePlayer,
  compactPlayers = false,
}: BenchPanelProps) {
  return (
    <PlayersPanel
      title="Suplentes"
      description="Agregá suplentes para dejar listo el banco de cara al partido."
      selectLabel="Agregar suplente"
      selectedPlayerId={selectedPlayerId}
      onSelectedPlayerChange={onSelectedPlayerChange}
      availablePlayers={availablePlayers}
      onAdd={onAdd}
      addDisabled={addDisabled}
    >
      {players.length === 0 ? (
        <EmptyState text="Sin suplentes cargados." />
      ) : (
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
              playerRole="Suplente"
              goals={player.goals ?? 0}
              yellow={player.yellow ?? false}
              red={player.red ?? false}
              substituted={player.substituted ?? false}
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
      )}
    </PlayersPanel>
  );
}
