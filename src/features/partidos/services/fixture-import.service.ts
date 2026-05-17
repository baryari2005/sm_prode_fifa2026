import * as XLSX from "xlsx";
import type { GoalDetail, TeamStats } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccionCreateInput } from "@/features/partidos/types/types";

type GenericRow = Record<string, unknown>;

function normalizeRowsFromWorkbook(file: File): Promise<GenericRow[]> {
  return file.arrayBuffer().then((buffer) => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json<GenericRow>(worksheet, {
      defval: "",
      raw: false,
    });
  });
}

export async function parseImportFile(file: File): Promise<GenericRow[]> {
  if (file.name.endsWith(".json")) {
    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("El archivo JSON debe contener un array");
    }
    return parsed as GenericRow[];
  }

  return normalizeRowsFromWorkbook(file);
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableString(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export function mapRowsToPlantel(
  rows: GenericRow[],
  seleccionId: string
): JugadorSeleccionCreateInput[] {
  return rows
    .filter((row) => String(row.nombre ?? row.NOMBRE ?? "").trim().length > 0)
    .map((row) => ({
      seleccionId,
      nombre: String(row.nombre ?? row.NOMBRE ?? "").trim(),
      fotoUrl: toNullableString(row.fotoUrl ?? row.FOTO ?? row.FOTO_URL),
      numero: row.numero === "" ? null : toNumber(row.numero ?? row.NUMERO),
      posicion: String(row.posicion ?? row.POS ?? "").trim() || "M",
      edad: row.edad === "" ? null : toNumber(row.edad ?? row.EDAD),
      estatura: toNullableString(row.estatura ?? row.EST),
      peso: toNullableString(row.peso ?? row.P),
      nacionalidad: toNullableString(row.nacionalidad ?? row.NAC),
      apariciones: toNumber(row.apariciones ?? row.AP),
      suplencias: toNumber(row.suplencias ?? row.SUB),
      goles: toNumber(row.goles ?? row.G),
      asistencias: toNumber(row.asistencias ?? row.A),
      tiros: toNumber(row.tiros ?? row.TT),
      tirosAlArco: toNumber(row.tirosAlArco ?? row.TM),
      faltasCometidas: toNumber(row.faltasCometidas ?? row.FC),
      faltasSufridas: toNumber(row.faltasSufridas ?? row.FS),
      amarillas: toNumber(row.amarillas ?? row.TA),
      rojas: toNumber(row.rojas ?? row.TR),
      atajadas: toNumber(row.atajadas ?? row.ATAJADAS),
      golesConcedidos: toNumber(row.golesConcedidos ?? row.GA),
    }));
}

export function mapRowsToStats(rows: GenericRow[]): {
  estadisticasLocal: TeamStats;
  estadisticasVisitante: TeamStats;
} {
  const local = rows.find(
    (row) => String(row.equipo ?? row.team ?? "").toLowerCase() === "local"
  );
  const visitante = rows.find(
    (row) =>
      String(row.equipo ?? row.team ?? "").toLowerCase() === "visitante"
  );

  if (!local || !visitante) {
    throw new Error("El archivo debe incluir una fila para local y otra para visitante");
  }

  const mapRow = (row: GenericRow): TeamStats => ({
    shots: toNumber(row.remates ?? row.shots),
    shotsOnTarget: toNumber(row.rematesAlArco ?? row.shotsOnTarget),
    possession: toNumber(row.posesion ?? row.possession),
    passes: toNumber(row.pases ?? row.passes),
    passAccuracy: toNumber(row.precisionPases ?? row.passAccuracy),
    fouls: toNumber(row.faltas ?? row.fouls),
    yellowCards: toNumber(row.amarillas ?? row.yellowCards),
    redCards: toNumber(row.rojas ?? row.redCards),
    offsides: toNumber(row.offsides ?? row.posicionAdelantada),
    corners: toNumber(row.corners ?? row.tirosDeEsquina),
  });

  return {
    estadisticasLocal: mapRow(local),
    estadisticasVisitante: mapRow(visitante),
  };
}

export function mapRowsToGoalDetails(rows: GenericRow[]): {
  detalleGolesLocal: GoalDetail[];
  detalleGolesVisitante: GoalDetail[];
} {
  const build = (team: "local" | "visitante") =>
    rows
      .filter((row) => String(row.equipo ?? "").toLowerCase() === team)
      .map((row) => ({
        jugadorId: String(row.jugadorId ?? "").trim(),
        nombre: String(row.nombre ?? "").trim(),
        minuto: toNumber(row.minuto),
        penal:
          String(row.penal ?? "false").toLowerCase() === "true" ||
          String(row.penal ?? "") === "1",
      }))
      .filter((row) => row.jugadorId && row.nombre);

  return {
    detalleGolesLocal: build("local"),
    detalleGolesVisitante: build("visitante"),
  };
}
