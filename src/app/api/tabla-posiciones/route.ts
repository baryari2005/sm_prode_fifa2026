import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { ordenarTablaPosiciones } from "@/features/partidos/services/tabla-posiciones.service";
import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FootballDataStandingTeam = {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

type FootballDataStandingRow = {
  position?: number | null;
  team?: FootballDataStandingTeam | null;
  playedGames?: number | null;
  won?: number | null;
  draw?: number | null;
  lost?: number | null;
  points?: number | null;
  goalsFor?: number | null;
  goalsAgainst?: number | null;
  goalDifference?: number | null;
};

type FootballDataStanding = {
  stage?: string | null;
  type?: string | null;
  group?: string | null;
  table?: FootballDataStandingRow[] | null;
};

type FootballDataStandingsResponse = {
  standings?: FootballDataStanding[];
  message?: string;
};

function sanitizeEnvUrl(value?: string | null) {
  if (!value) return null;

  return value
    .trim()
    .replace(/;+\s*$/g, "")
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

function getStandingsApiUrl() {
  const explicitUrl = sanitizeEnvUrl(
    process.env.MUNDIAL_2026_STANDINGS_API_URL
  );

  if (explicitUrl) {
    return new URL(explicitUrl);
  }

  const matchesUrl = sanitizeEnvUrl(process.env.MUNDIAL_2026_API_URL);

  if (matchesUrl) {
    const url = new URL(matchesUrl);
    url.pathname = url.pathname.replace(/\/matches\/?$/i, "/standings");
    url.search = "";
    return url;
  }

  return new URL("https://api.football-data.org/v4/competitions/WC/standings");
}

function normalizeGroup(value?: string | null) {
  if (!value) return null;

  return value.replace(/^GROUP_/i, "").replace(/^Grupo\s+/i, "").trim() || null;
}

function normalizeText(value?: string | null) {
  if (!value) return "";

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildFallbackSeleccionId(team: FootballDataStandingTeam) {
  if (team.tla) return `api-${team.tla.toUpperCase()}`;
  if (team.id) return `api-${team.id}`;
  return `api-${normalizeText(team.name || team.shortName || "sin-equipo")}`;
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const token = process.env.FOOTBALL_DATA_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          message:
            "Falta configurar FOOTBALL_DATA_API_TOKEN en el archivo .env.local",
        },
        { status: 500 }
      );
    }

    const apiUrl = getStandingsApiUrl();
    apiUrl.searchParams.set("season", "2026");

    const [apiResponse, selecciones] = await Promise.all([
      fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "X-Auth-Token": token,
        },
        cache: "no-store",
      }),
      prisma.seleccion.findMany({
        where: {
          activo: true,
        },
      }),
    ]);

    const apiData = (await apiResponse.json()) as FootballDataStandingsResponse;

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          message: "Error al consultar standings en football-data.org",
          status: apiResponse.status,
          error: apiData,
        },
        { status: apiResponse.status }
      );
    }

    const seleccionesPorCodigo = new Map(
      selecciones.map((seleccion) => [seleccion.codigo.toUpperCase(), seleccion])
    );
    const seleccionesPorNombre = new Map(
      selecciones.map((seleccion) => [normalizeText(seleccion.nombre), seleccion])
    );

    const tablaApi =
      apiData.standings
        ?.filter(
          (standing) =>
            standing.type === "TOTAL" &&
            Boolean(standing.group) &&
            Array.isArray(standing.table)
        )
        .flatMap((standing) => {
          const grupo = normalizeGroup(standing.group);

          return (standing.table || []).map((row): PosicionEquipo => {
            const team = row.team || {};
            const codigo = team.tla?.toUpperCase() || "";
            const seleccion =
              seleccionesPorCodigo.get(codigo) ||
              seleccionesPorNombre.get(
                normalizeText(team.name || team.shortName || "")
              );

            return {
              posicion: row.position ?? 0,
              seleccionId: seleccion?.id || buildFallbackSeleccionId(team),
              nombre:
                seleccion?.nombre || team.name || team.shortName || "Sin nombre",
              codigo: seleccion?.codigo || codigo || "S/N",
              bandera: seleccion?.bandera || null,
              grupo: seleccion?.grupo || grupo,
              puntos: row.points ?? 0,
              partidosJugados: row.playedGames ?? 0,
              ganancias: row.won ?? 0,
              empates: row.draw ?? 0,
              derrotas: row.lost ?? 0,
              golesAFavor: row.goalsFor ?? 0,
              golesEnContra: row.goalsAgainst ?? 0,
              diferencial: row.goalDifference ?? 0,
            };
          });
        }) || [];

    return NextResponse.json({
      tabla: ordenarTablaPosiciones(tablaApi),
      source: "api",
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver la tabla de posiciones." },
        { status: 403 }
      );
    }

    console.error("GET /api/tabla-posiciones error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
