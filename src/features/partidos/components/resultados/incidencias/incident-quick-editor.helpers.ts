import { createMatchIncident } from "@/features/partidos/helpers/resultado-incidencias.helpers";
import type {
  IncidentTeamSide,
  IncidentType,
  TeamLineup,
} from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type BatchPlayerRow = {
  playerId: string;
  minute: string;
  description?: string;
  lesionTipo?: string;
};

type BatchSubstitutionRow = {
  jugadorSaleId: string;
  jugadorEntraId: string;
  minuto: string;
  descripcion?: string;
};

function findPlayerName(players: JugadorSeleccion[], id: string) {
  return players.find((player) => player.id === id)?.nombre ?? null;
}

function toIncidentMinute(value: string) {
  const minute = Number(value);
  if (!Number.isFinite(minute) || minute < 0 || minute > 130) {
    return null;
  }

  return minute;
}

export function buildPlayerBatchIncidents(params: {
  tipo: Extract<IncidentType, "tarjeta_amarilla" | "tarjeta_roja" | "lesion">;
  equipo: Exclude<IncidentTeamSide, "general">;
  rows: BatchPlayerRow[];
  players: JugadorSeleccion[];
}) {
  return params.rows.flatMap((row) => {
    const minute = toIncidentMinute(row.minute);
    if (!row.playerId || minute === null) {
      return [];
    }

    return [
      createMatchIncident({
        tipo: params.tipo,
        minuto: minute,
        equipo: params.equipo,
        jugadorId: row.playerId,
        jugadorNombre: findPlayerName(params.players, row.playerId),
        descripcion: row.description?.trim() || null,
        lesionTipo:
          params.tipo === "lesion" ? row.lesionTipo?.trim() || null : null,
      }),
    ];
  });
}

export function buildSubstitutionBatchIncidents(params: {
  equipo: Exclude<IncidentTeamSide, "general">;
  rows: BatchSubstitutionRow[];
  lineup: TeamLineup;
}) {
  const players = [...params.lineup.titulares, ...params.lineup.suplentes].map(
    (player) => ({
      id: player.jugadorId,
      nombre: player.nombre,
    }),
  );

  return params.rows.flatMap((row) => {
    const minute = toIncidentMinute(row.minuto);
    if (
      !row.jugadorSaleId ||
      !row.jugadorEntraId ||
      row.jugadorSaleId === row.jugadorEntraId ||
      minute === null
    ) {
      return [];
    }

    return [
      createMatchIncident({
        tipo: "cambio",
        minuto: minute,
        equipo: params.equipo,
        jugadorSaleId: row.jugadorSaleId,
        jugadorSaleNombre:
          players.find((player) => player.id === row.jugadorSaleId)?.nombre ??
          null,
        jugadorEntraId: row.jugadorEntraId,
        jugadorEntraNombre:
          players.find((player) => player.id === row.jugadorEntraId)?.nombre ??
          null,
        descripcion: row.descripcion?.trim() || null,
      }),
    ];
  });
}
