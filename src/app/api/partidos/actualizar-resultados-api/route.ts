import { EstadoPartido } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FootballDataScore = {
  winner?: string | null;
  fullTime?: {
    home: number | null;
    away: number | null;
  } | null;
  penalties?: {
    home: number | null;
    away: number | null;
  } | null;
};

type FootballDataFinishedMatch = {
  id: number;
  status: string;
  utcDate: string;
  stage?: string | null;
  score?: FootballDataScore | null;
};

type FootballDataFinishedResponse = {
  matches?: FootballDataFinishedMatch[];
  message?: string;
};

const API_STAGE_BY_PHASE: Record<string, string> = {
  grupos: "GROUP_STAGE",
  dieciseisavos: "LAST_32",
  octavos: "LAST_16",
  cuartos: "QUARTER_FINALS",
  semis: "SEMI_FINALS",
  "tercer-puesto": "THIRD_PLACE",
  final: "FINAL",
};

type SyncMatchResult = {
  footballDataId: number;
  success: boolean;
  partidoId?: string;
  action?: "created" | "updated" | "skipped";
  message: string;
};

function normalizarApiUrl(rawUrl: string) {
  return rawUrl.trim().replace(/^['"]+/, "").replace(/['";\s]+$/, "");
}

function ensureResultadosPermission(
  user: Awaited<ReturnType<typeof requireAuth>>
) {
  try {
    requirePermission(user, "resultados", "editar");
    return;
  } catch {}

  requirePermission(user, "resultados", "crear");
}

function buildMockFinishedMatches(
  partidos: Array<{ footballDataId: number }>
): FootballDataFinishedMatch[] {
  return partidos.map((partido, index) => {
    const local = (partido.footballDataId + index) % 4;
    const visitante = (partido.footballDataId + index + 2) % 3;

    return {
      id: partido.footballDataId,
      status: "FINISHED",
      utcDate: new Date().toISOString(),
      stage: "GROUP_STAGE",
      score: {
        winner:
          local > visitante
            ? "HOME_TEAM"
            : local < visitante
            ? "AWAY_TEAM"
            : "DRAW",
        fullTime: {
          home: local,
          away: visitante,
        },
        penalties: null,
      },
    };
  });
}

async function getFinishedMatchesFromApi() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const urlApi = process.env.MUNDIAL_2026_API_URL;

  if (!token) {
    throw new Error("Falta configurar FOOTBALL_DATA_API_TOKEN en .env.local");
  }

  if (!urlApi) {
    throw new Error("Falta configurar MUNDIAL_2026_API_URL en .env.local");
  }

  const apiUrl = new URL(normalizarApiUrl(urlApi));
  apiUrl.searchParams.set("season", "2026");
  apiUrl.searchParams.set("status", "FINISHED");

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as FootballDataFinishedResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Error al consultar football-data.org");
  }

  return payload.matches ?? [];
}

async function getFinishedMatchesMock() {
  const partidos = await prisma.partido.findMany({
    where: {
      activo: true,
      footballDataId: {
        not: null,
      },
    },
    select: {
      footballDataId: true,
    },
    take: 12,
    orderBy: {
      fecha: "asc",
    },
  });

  return buildMockFinishedMatches(
    partidos.filter(
      (partido): partido is { footballDataId: number } =>
        typeof partido.footballDataId === "number"
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    ensureResultadosPermission(loggedInUser);

    const url = new URL(req.url);
    const useMock = url.searchParams.get("mock") === "1";
    const requestedPhase = url.searchParams.get("fase") ?? "";
    const stageFilter = API_STAGE_BY_PHASE[requestedPhase];

    const finishedMatches = (useMock
      ? await getFinishedMatchesMock()
      : await getFinishedMatchesFromApi()
    ).filter((match) => (stageFilter ? match.stage === stageFilter : true));

    if (finishedMatches.length === 0) {
      return NextResponse.json({
        message: useMock
          ? "No hay partidos mock disponibles para sincronizar."
          : "La API no devolvio partidos finalizados para sincronizar.",
        source: useMock ? "mock" : "api",
        meta: {
          fase: requestedPhase || null,
          stageFilter: stageFilter || null,
        },
        resultados: [],
      });
    }

    const ids = finishedMatches.map((match) => match.id);

    const partidos = await prisma.partido.findMany({
      where: {
        activo: true,
        footballDataId: {
          in: ids,
        },
      },
      include: {
        resultado: true,
        seleccionLocal: true,
        seleccionVisitante: true,
      },
    });

    const partidosByFootballDataId = new Map(
      partidos
        .filter(
          (partido): partido is typeof partido & { footballDataId: number } =>
            typeof partido.footballDataId === "number"
        )
        .map((partido) => [partido.footballDataId, partido])
    );

    const resultados: SyncMatchResult[] = [];

    for (const match of finishedMatches) {
      const golesLocal = match.score?.fullTime?.home;
      const golesVisitante = match.score?.fullTime?.away;

      if (match.status !== "FINISHED") {
        resultados.push({
          footballDataId: match.id,
          success: true,
          action: "skipped",
          message: "Partido omitido porque no esta finalizado.",
        });
        continue;
      }

      if (golesLocal === null || golesLocal === undefined || golesVisitante === null || golesVisitante === undefined) {
        resultados.push({
          footballDataId: match.id,
          success: true,
          action: "skipped",
          message: "Partido omitido porque la API no devolvio goles finales.",
        });
        continue;
      }

      const partido = partidosByFootballDataId.get(match.id);

      if (!partido) {
        resultados.push({
          footballDataId: match.id,
          success: false,
          action: "skipped",
          message: "No se encontro un partido local con ese footballDataId.",
        });
        continue;
      }

      if (
        partido.resultado?.estado === EstadoPartido.EN_JUEGO ||
        partido.resultado?.estado === EstadoPartido.ENTRETIEMPO
      ) {
        resultados.push({
          footballDataId: match.id,
          partidoId: partido.id,
          success: true,
          action: "skipped",
          message: `${partido.seleccionLocal.nombre} vs ${partido.seleccionVisitante.nombre}: omitido porque el partido esta en juego.`,
        });
        continue;
      }

      await prisma.$transaction(async (tx) => {
        if (partido.resultado) {
          await tx.resultado.update({
            where: {
              partidoId: partido.id,
            },
            data: {
              golesLocal,
              golesVisitante,
              penalesLocal: match.score?.penalties?.home ?? null,
              penalesVisitante: match.score?.penalties?.away ?? null,
              estado: EstadoPartido.FINALIZADO,
              observaciones: useMock
                ? "Resultado sincronizado desde dataset mock."
                : "Resultado sincronizado desde football-data.org.",
            },
          });
        } else {
          await tx.resultado.create({
            data: {
              partidoId: partido.id,
              golesLocal,
              golesVisitante,
              penalesLocal: match.score?.penalties?.home ?? null,
              penalesVisitante: match.score?.penalties?.away ?? null,
              estado: EstadoPartido.FINALIZADO,
              observaciones: useMock
                ? "Resultado sincronizado desde dataset mock."
                : "Resultado sincronizado desde football-data.org.",
            },
          });
        }

      });

      if (partido.resultado) {
        resultados.push({
          footballDataId: match.id,
          partidoId: partido.id,
          success: true,
          action: "updated",
          message: `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: resultado actualizado. Pendiente de ranking diario.`,
        });
      } else {
        resultados.push({
          footballDataId: match.id,
          partidoId: partido.id,
          success: true,
          action: "created",
          message: `${partido.seleccionLocal.nombre} ${golesLocal} - ${golesVisitante} ${partido.seleccionVisitante.nombre}: resultado creado. Pendiente de ranking diario.`,
        });
      }
    }

    const creados = resultados.filter((item) => item.action === "created").length;
    const actualizados = resultados.filter((item) => item.action === "updated").length;
    const omitidos = resultados.filter((item) => item.action === "skipped").length;

    return NextResponse.json({
      message: `Sincronizacion completada. ${creados} resultados creados, ${actualizados} actualizados y ${omitidos} omitidos.`,
      source: useMock ? "mock" : "api",
      meta: {
        fase: requestedPhase || null,
        stageFilter: stageFilter || null,
      },
      resultados,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para sincronizar resultados." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/actualizar-resultados-api error:", err);

    return NextResponse.json(
      {
        message:
          err instanceof Error
            ? err.message
            : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
