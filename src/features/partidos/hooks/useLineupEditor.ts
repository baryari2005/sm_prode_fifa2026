"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

import {
  getLineupPositions,
  inferLineupRoles,
  parseFormationRows,
} from "@/features/partidos/lib/lineup-layout";

import {
  applyAutoStarterPositions,
  canAddStarter,
  clamp,
  createLineupPlayer,
  reorderLineupPlayers,
  type LineupGroup,
} from "@/features/partidos/helpers/lineup-editor.helpers";

export type LineupTabValue = "cancha" | "titulares" | "suplentes";

type UseLineupEditorParams = {
  lineup: TeamLineup;
  squad: JugadorSeleccion[];
  onChange: (lineup: TeamLineup) => void;
};

type UpdatePlayerField =
  | "goals"
  | "yellow"
  | "red"
  | "substituted"
  | "numero"
  | "posicion"
  | "x"
  | "y"
  | "nombre";

type UpdatePlayerValue = string | number | boolean | null;

export function useLineupEditor({
  lineup,
  squad,
  onChange,
}: UseLineupEditorParams) {
  const [activeTab, setActiveTab] = useState<LineupTabValue>("cancha");

  const [selectedStarterId, setSelectedStarterId] = useState("");
  const [selectedBenchId, setSelectedBenchId] = useState("");

  const [draggingStarterId, setDraggingStarterId] = useState<string | null>(
    null
  );

  const [draggingCardStarterId, setDraggingCardStarterId] = useState<
    string | null
  >(null);

  const [hoveredStarterId, setHoveredStarterId] = useState<string | null>(null);

  const pitchRef = useRef<HTMLDivElement | null>(null);

  const assignedIds = useMemo(() => {
    return new Set([
      ...lineup.titulares.map((player) => player.jugadorId),
      ...lineup.suplentes.map((player) => player.jugadorId),
    ]);
  }, [lineup.suplentes, lineup.titulares]);

  const availablePlayers = useMemo(() => {
    return squad.filter((player) => !assignedIds.has(player.id));
  }, [assignedIds, squad]);

  const formationPreviewRows = useMemo(() => {
    return parseFormationRows(lineup.formacion, lineup.titulares.length);
  }, [lineup.formacion, lineup.titulares.length]);

  const startersOnPitch = useMemo(() => {
    return getLineupPositions(lineup.titulares, "top", lineup.formacion);
  }, [lineup.formacion, lineup.titulares]);

  const starterRoles = useMemo(() => {
    return new Map(
      inferLineupRoles(startersOnPitch, lineup.formacion).map((item) => [
        item.jugadorId,
        item.label,
      ])
    );
  }, [lineup.formacion, startersOnPitch]);

  const canAddMoreStarters = canAddStarter(lineup.titulares.length);

  function addPlayer(playerId: string, type: LineupGroup) {
    if (type === "titulares" && !canAddMoreStarters) {
      return;
    }

    const player = squad.find((item) => item.id === playerId);

    if (!player) {
      return;
    }

    const nextPlayer = createLineupPlayer(player, type);
    const nextPlayers = [...lineup[type], nextPlayer];

    onChange({
      ...lineup,
      [type]:
        type === "titulares"
          ? applyAutoStarterPositions(nextPlayers, lineup.formacion)
          : nextPlayers,
    });
  }

  function updatePlayer(
    type: LineupGroup,
    index: number,
    field: UpdatePlayerField,
    value: UpdatePlayerValue
  ) {
    const nextPlayers = [...lineup[type]];

    nextPlayers[index] = {
      ...nextPlayers[index],
      [field]: value,
    };

    onChange({
      ...lineup,
      [type]: nextPlayers,
    });
  }

  function removePlayer(type: LineupGroup, index: number) {
    const nextPlayers = lineup[type].filter(
      (_, currentIndex) => currentIndex !== index
    );

    onChange({
      ...lineup,
      [type]:
        type === "titulares"
          ? applyAutoStarterPositions(nextPlayers, lineup.formacion)
          : nextPlayers,
    });
  }

  function applyFormationLayout() {
    onChange({
      ...lineup,
      titulares: applyAutoStarterPositions(
        lineup.titulares,
        lineup.formacion
      ),
    });
  }

  function reorderStarters(draggedId: string, targetId: string) {
    onChange({
      ...lineup,
      titulares: reorderLineupPlayers(
        lineup.titulares,
        draggedId,
        targetId,
        lineup.formacion
      ),
    });
  }

  function handlePitchDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!draggingStarterId || !pitchRef.current) {
      return;
    }

    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    onChange({
      ...lineup,
      titulares: lineup.titulares.map((player) =>
        player.jugadorId === draggingStarterId
          ? {
              ...player,
              x: clamp(x, 8, 92),
              y: clamp(y, 8, 92),
            }
          : player
      ),
    });

    setDraggingStarterId(null);
  }

  function swapStarterPositions(targetStarterId: string) {
    if (!draggingStarterId || draggingStarterId === targetStarterId) {
      return;
    }

    const draggingPlayer = lineup.titulares.find(
      (player) => player.jugadorId === draggingStarterId
    );

    const targetPlayer = lineup.titulares.find(
      (player) => player.jugadorId === targetStarterId
    );

    if (!draggingPlayer || !targetPlayer) {
      return;
    }

    onChange({
      ...lineup,
      titulares: lineup.titulares.map((player) => {
        if (player.jugadorId === draggingStarterId) {
          return {
            ...player,
            x: targetPlayer.x,
            y: targetPlayer.y,
          };
        }

        if (player.jugadorId === targetStarterId) {
          return {
            ...player,
            x: draggingPlayer.x,
            y: draggingPlayer.y,
          };
        }

        return player;
      }),
    });

    setDraggingStarterId(null);
    setHoveredStarterId(null);
  }

  return {
    activeTab,
    setActiveTab,

    selectedStarterId,
    setSelectedStarterId,

    selectedBenchId,
    setSelectedBenchId,

    draggingStarterId,
    setDraggingStarterId,

    draggingCardStarterId,
    setDraggingCardStarterId,

    hoveredStarterId,
    setHoveredStarterId,

    pitchRef,

    assignedIds,
    availablePlayers,
    formationPreviewRows,
    startersOnPitch,
    starterRoles,
    canAddMoreStarters,

    addPlayer,
    updatePlayer,
    removePlayer,
    applyFormationLayout,
    reorderStarters,
    handlePitchDrop,
    swapStarterPositions,
  };
}