import type { LineupPlayer } from "@/features/partidos/types/fixture-details";

export type MatchLineupSide = "local" | "visitante";

export type PositionedLineupPlayer = LineupPlayer & {
  x: number;
  y: number;
};

const LOCAL_GOALKEEPER_Y = 8;
const VISITANTE_GOALKEEPER_Y = 92;

const LOCAL_ROW_YS: Record<number, number[]> = {
  1: [32],
  2: [24, 42],
  3: [20, 32, 44],
  4: [18, 28, 37, 46],
  5: [15, 23, 31, 38, 44],
};

function parseFormation(formacion?: string): number[] {
  if (!formacion) return [];

  return formacion
    .split("-")
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part) && part > 0);
}

function getXPositions(count: number): number[] {
  if (count <= 1) return [50];

  const marginByCount: Record<number, number> = {
    2: 34,
    3: 24,
    4: 16,
    5: 10,
    6: 7,
  };

  const margin = marginByCount[count] ?? 8;
  const available = 100 - margin * 2;
  const step = available / (count - 1);

  return Array.from({ length: count }, (_, index) =>
    Math.round((margin + step * index) * 100) / 100
  );
}

function getRowYs(rowCount: number, side: MatchLineupSide): number[] {
  const localYs = LOCAL_ROW_YS[rowCount] ?? LOCAL_ROW_YS[4];

  if (side === "local") {
    return localYs;
  }

  return localYs.map((y) => 100 - y);
}

function isGoalkeeper(player: LineupPlayer) {
  const posicion = player.posicion?.toLowerCase() ?? "";

  return (
    posicion.includes("arquero") ||
    posicion.includes("portero") ||
    posicion.includes("goalkeeper") ||
    player.numero === 1
  );
}

function splitGoalkeeper(players: LineupPlayer[]) {
  const goalkeeper = players.find(isGoalkeeper) ?? players[0];

  const outfieldPlayers = players.filter(
    (player) => player.jugadorId !== goalkeeper?.jugadorId
  );

  return {
    goalkeeper,
    outfieldPlayers,
  };
}

function getFallbackFormationRows(playersCount: number) {
  if (playersCount <= 0) return [];
  if (playersCount <= 3) return [playersCount];
  if (playersCount <= 6) return [3, playersCount - 3];

  return [4, 3, playersCount - 7].filter((row) => row > 0);
}

export function getMatchLineupPositions(
  titulares: LineupPlayer[],
  side: MatchLineupSide,
  formacion?: string
): PositionedLineupPlayer[] {
  if (!titulares.length) return [];

  const { goalkeeper, outfieldPlayers } = splitGoalkeeper(titulares);

  const formationRows = parseFormation(formacion);
  const rows =
    formationRows.length > 0
      ? formationRows
      : getFallbackFormationRows(outfieldPlayers.length);

  const rowYs = getRowYs(rows.length, side);

  const goalkeeperY =
    side === "local" ? LOCAL_GOALKEEPER_Y : VISITANTE_GOALKEEPER_Y;

  const positionedPlayers: PositionedLineupPlayer[] = [];

  if (goalkeeper) {
    positionedPlayers.push({
      ...goalkeeper,
      x: 50,
      y: goalkeeperY,
    });
  }

  let playerCursor = 0;

  rows.forEach((playersInRow, rowIndex) => {
    const rowPlayers = outfieldPlayers.slice(
      playerCursor,
      playerCursor + playersInRow
    );

    playerCursor += playersInRow;

    const xPositions = getXPositions(rowPlayers.length);
    const y = rowYs[rowIndex] ?? 50;

    rowPlayers.forEach((player, index) => {
      positionedPlayers.push({
        ...player,
        x: xPositions[index] ?? 50,
        y,
      });
    });
  });

  const remainingPlayers = outfieldPlayers.slice(playerCursor);

  if (remainingPlayers.length > 0) {
    const xPositions = getXPositions(remainingPlayers.length);
    const y = side === "local" ? 48 : 52;

    remainingPlayers.forEach((player, index) => {
      positionedPlayers.push({
        ...player,
        x: xPositions[index] ?? 50,
        y,
      });
    });
  }

  return positionedPlayers;
}