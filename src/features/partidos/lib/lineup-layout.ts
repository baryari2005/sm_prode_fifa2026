import type { LineupPlayer } from "@/features/partidos/types/fixture-details";

export type PositionedLineupPlayer = LineupPlayer & {
  x: number;
  y: number;
};

export type InferredLineupRole = {
  jugadorId: string;
  label: string;
};

export function getLineupPositions(
  players: LineupPlayer[],
  side: "top" | "bottom",
  formation?: string | null
): PositionedLineupPlayer[] {
  if (players.length === 0) return [];

  const normalized = players.filter(Boolean);
  const uniqueCoordinates = new Set(
    normalized
      .filter((player) => player.x !== null && player.y !== null)
      .map((player) => `${player.x}-${player.y}`)
  );

  const needsAutoLayout =
    uniqueCoordinates.size <= 1 ||
    normalized.some((player) => player.x === null || player.y === null);

  if (!needsAutoLayout) {
    return normalized.map((player) => ({
      ...player,
      x: clamp(player.x ?? 50, 8, 92),
      y:
        side === "top"
          ? clamp(player.y ?? 12, 8, 92)
          : clamp(100 - (player.y ?? 12), 8, 92),
    }));
  }

  return buildAutoLineupPositions(normalized, formation, side);
}

export function buildAutoLineupPositions(
  players: LineupPlayer[],
  formation?: string | null,
  side: "top" | "bottom" = "top"
): PositionedLineupPlayer[] {
  const rows = buildFormationRows(players.length, formation);
  let index = 0;

  return rows.flatMap((count, rowIndex) => {
    const rowPlayers = players.slice(index, index + count);
    index += count;

    const rowYBase = 14 + rowIndex * (70 / Math.max(rows.length - 1, 1));
    const rowY = side === "top" ? rowYBase : 100 - rowYBase;

    return rowPlayers.map((player, playerIndex) => {
      const step = 100 / (rowPlayers.length + 1);
      const rowX = step * (playerIndex + 1);

      return {
        ...player,
        x: clamp(rowX, 8, 92),
        y: clamp(rowY, 8, 92),
      };
    });
  });
}

export function parseFormationRows(
  formation?: string | null,
  totalPlayers = 11
): number[] | null {
  if (!formation) return null;

  const parts = formation
    .split(/[^0-9]+/)
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (parts.length === 0) return null;

  const sum = parts.reduce((acc, value) => acc + value, 0);

  if (sum === totalPlayers) {
    return parts;
  }

  if (sum === totalPlayers - 1) {
    return [1, ...parts];
  }

  return null;
}

export function inferLineupRoles(
  players: PositionedLineupPlayer[],
  formation?: string | null
): InferredLineupRole[] {
  if (players.length === 0) return [];

  const rows = buildFormationRows(players.length, formation);
  const sorted = [...players].sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });

  let index = 0;
  const result: InferredLineupRole[] = [];

  rows.forEach((count, rowIndex) => {
    const rowPlayers = sorted.slice(index, index + count).sort((a, b) => a.x - b.x);
    index += count;

    rowPlayers.forEach((player, playerIndex) => {
      result.push({
        jugadorId: player.jugadorId,
        label: getRoleLabel(rowIndex, rows.length, rowPlayers.length, playerIndex),
      });
    });
  });

  return result;
}

function buildFormationRows(count: number, formation?: string | null) {
  const parsed = parseFormationRows(formation, count);

  if (parsed) {
    return parsed;
  }

  if (count <= 1) return [1];
  if (count === 2) return [1, 1];
  if (count === 3) return [1, 2];
  if (count === 4) return [1, 3];
  if (count === 5) return [1, 4];
  if (count === 6) return [1, 2, 3];
  if (count === 7) return [1, 3, 3];
  if (count === 8) return [1, 3, 4];
  if (count === 9) return [1, 3, 2, 3];
  if (count === 10) return [1, 4, 2, 3];

  return [1, 4, 3, 3];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getRoleLabel(
  rowIndex: number,
  totalRows: number,
  rowCount: number,
  playerIndex: number
) {
  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === totalRows - 1;

  if (isFirstRow && rowCount === 1) {
    return "Arquero";
  }

  if (totalRows === 1) {
    return getZoneLabel("Ataque", rowCount, playerIndex);
  }

  if (rowIndex === 1 && totalRows >= 3) {
    return getZoneLabel("Defensa", rowCount, playerIndex);
  }

  if (isLastRow) {
    return getZoneLabel("Ataque", rowCount, playerIndex);
  }

  return getZoneLabel("Mediocampo", rowCount, playerIndex);
}

function getZoneLabel(
  zone: "Defensa" | "Mediocampo" | "Ataque",
  rowCount: number,
  playerIndex: number
) {
  const side = getSideLabel(rowCount, playerIndex);

  if (zone === "Defensa") {
    if (rowCount >= 4 && (playerIndex === 1 || playerIndex === rowCount - 2)) {
      return playerIndex === 1 ? "Central izquierdo" : "Central derecho";
    }

    if (rowCount === 3 && playerIndex === 1) {
      return "Líbero / central";
    }

    return `${side} defensor`.replace("Centro defensor", "Defensor central");
  }

  if (zone === "Mediocampo") {
    if (rowCount === 1) return "Mediocentro";
    if (rowCount >= 3 && playerIndex === Math.floor(rowCount / 2)) {
      return "Mediocampista central";
    }

    return `${side} volante`
      .replace("Centro volante", "Volante interno")
      .replace("Izquierda volante", "Volante por izquierda")
      .replace("Derecha volante", "Volante por derecha");
  }

  if (rowCount === 1) return "Delantero centro";
  if (rowCount >= 3 && playerIndex === Math.floor(rowCount / 2)) {
    return "Delantero centro";
  }

  return `${side} atacante`
    .replace("Izquierda atacante", "Extremo izquierdo")
    .replace("Derecha atacante", "Extremo derecho")
    .replace("Centro atacante", "Segundo delantero");
}

function getSideLabel(rowCount: number, playerIndex: number) {
  if (rowCount === 1) return "Centro";
  if (playerIndex === 0) return "Izquierda";
  if (playerIndex === rowCount - 1) return "Derecha";

  const center = (rowCount - 1) / 2;
  if (Math.abs(playerIndex - center) < 0.5) return "Centro";

  return playerIndex < center ? "Izquierda" : "Derecha";
}
