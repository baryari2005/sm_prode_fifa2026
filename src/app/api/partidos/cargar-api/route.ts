import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CargaPartidoAction = "created" | "existing" | "updated" | "omitted" | "error";

type FootballDataTeam = {
  id: number | null;
  name: string | null;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  group: string | null;
  venue: string | null;
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
};

type FootballDataResponse = {
  count?: number;
  resultSet?: {
    count?: number;
  };
  matches?: FootballDataMatch[];
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

function obtenerNombreFase(stage: string) {
  const fases: Record<string, string> = {
    GROUP_STAGE: "Fase de Grupos",
    LAST_32: "Dieciseisavos de Final",
    LAST_16: "Octavos de Final",
    QUARTER_FINALS: "Cuartos de Final",
    SEMI_FINALS: "Semifinal",
    THIRD_PLACE: "Tercer Puesto",
    FINAL: "Final",
  };

  return fases[stage] ?? stage;
}

function esSeleccionValida(team: FootballDataTeam) {
  if (!team) return false;
  if (!team.name) return false;
  if (!team.tla) return false;

  const codigo = team.tla.toUpperCase();

  if (codigo === "TBD") return false;
  if (codigo === "TBA") return false;

  return true;
}

function normalizarSeleccion(team: FootballDataTeam) {
  return {
    footballDataTeamId: team.id ?? null,
    nombre: team.name ?? team.shortName ?? "Sin nombre",
    codigo: team.tla ?? "S/N",
    bandera: team.crest ?? "",
  };
}

function getGrupoDesdeApi(partidoApi: FootballDataMatch) {
  return partidoApi.group?.replace("GROUP_", "") ?? "A";
}

function normalizarApiUrl(rawUrl: string) {
  return rawUrl.trim().replace(/^['"]+/, "").replace(/['";\s]+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");

    const token = process.env.FOOTBALL_DATA_API_TOKEN;
    const urlApi = process.env.MUNDIAL_2026_API_URL;

    if (!token) {
      return NextResponse.json(
        {
          message:
            "Falta configurar FOOTBALL_DATA_API_TOKEN en el archivo .env.local",
        },
        { status: 500 }
      );
    }

    if (!urlApi) {
      return NextResponse.json(
        {
          message: "Falta configurar MUNDIAL_2026_API_URL en el archivo .env.local",
        },
        { status: 500 }
      );
    }

    const apiUrl = new URL(normalizarApiUrl(urlApi));
    apiUrl.searchParams.set("season", "2026");

    const requestedPhase = new URL(req.url).searchParams.get("fase") ?? "";
    const stageFilter = API_STAGE_BY_PHASE[requestedPhase];

    const apiResponse = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
      },
      cache: "no-store",
    });

    const apiData = (await apiResponse.json()) as FootballDataResponse;

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          message: "Error al consultar football-data.org",
          status: apiResponse.status,
          error: apiData,
        },
        { status: apiResponse.status }
      );
    }

    const partidosApi = (apiData.matches ?? []).filter((partidoApi) =>
      stageFilter ? partidoApi.stage === stageFilter : true
    );

    if (partidosApi.length === 0) {
      return NextResponse.json({
        message: "La API no devolvio partidos para el Mundial 2026.",
        resultados: [],
      });
    }

    const resultados: Array<{
      success: boolean;
      partido?: unknown;
      partidoApiId?: number;
      action: CargaPartidoAction;
      message: string;
    }> = [];

    for (const partidoApi of partidosApi) {
      try {
        if (
          !esSeleccionValida(partidoApi.homeTeam) ||
          !esSeleccionValida(partidoApi.awayTeam)
        ) {
          resultados.push({
            success: false,
            partidoApiId: partidoApi.id,
            action: "omitted",
            message:
              "Partido omitido porque todavia no tiene selecciones confirmadas.",
          });

          continue;
        }

        const seleccionLocalData = normalizarSeleccion(partidoApi.homeTeam);
        const seleccionVisitanteData = normalizarSeleccion(partidoApi.awayTeam);
        const faseNombre = obtenerNombreFase(partidoApi.stage);
        const grupo = getGrupoDesdeApi(partidoApi);

        let fase = await prisma.fase.findFirst({
          where: { nombre: faseNombre },
        });

        if (!fase) {
          const maxOrden = await prisma.fase.findFirst({
            orderBy: { orden: "desc" },
            select: { orden: true },
          });

          fase = await prisma.fase.create({
            data: {
              nombre: faseNombre,
              orden: (maxOrden?.orden ?? 0) + 1,
              descripcion: `Partidos de ${faseNombre}`,
            },
          });
        }

        let seleccionLocal = await prisma.seleccion.findFirst({
          where: { codigo: seleccionLocalData.codigo },
        });

        if (!seleccionLocal) {
          seleccionLocal = await prisma.seleccion.create({
            data: {
              nombre: seleccionLocalData.nombre,
              codigo: seleccionLocalData.codigo,
              footballDataTeamId: seleccionLocalData.footballDataTeamId,
              bandera: seleccionLocalData.bandera,
              grupo,
            },
          });
        } else if (
          seleccionLocal.nombre !== seleccionLocalData.nombre ||
          seleccionLocal.footballDataTeamId !== seleccionLocalData.footballDataTeamId ||
          seleccionLocal.bandera !== seleccionLocalData.bandera ||
          seleccionLocal.grupo !== grupo
        ) {
          seleccionLocal = await prisma.seleccion.update({
            where: { id: seleccionLocal.id },
            data: {
              nombre: seleccionLocalData.nombre,
              footballDataTeamId: seleccionLocalData.footballDataTeamId,
              bandera: seleccionLocalData.bandera,
              grupo,
            },
          });
        }

        let seleccionVisitante = await prisma.seleccion.findFirst({
          where: { codigo: seleccionVisitanteData.codigo },
        });

        if (!seleccionVisitante) {
          seleccionVisitante = await prisma.seleccion.create({
            data: {
              nombre: seleccionVisitanteData.nombre,
              codigo: seleccionVisitanteData.codigo,
              footballDataTeamId: seleccionVisitanteData.footballDataTeamId,
              bandera: seleccionVisitanteData.bandera,
              grupo,
            },
          });
        } else if (
          seleccionVisitante.nombre !== seleccionVisitanteData.nombre ||
          seleccionVisitante.footballDataTeamId !== seleccionVisitanteData.footballDataTeamId ||
          seleccionVisitante.bandera !== seleccionVisitanteData.bandera ||
          seleccionVisitante.grupo !== grupo
        ) {
          seleccionVisitante = await prisma.seleccion.update({
            where: { id: seleccionVisitante.id },
            data: {
              nombre: seleccionVisitanteData.nombre,
              footballDataTeamId: seleccionVisitanteData.footballDataTeamId,
              bandera: seleccionVisitanteData.bandera,
              grupo,
            },
          });
        }

        const partidoPorFootballDataId = await prisma.partido.findUnique({
          where: { footballDataId: partidoApi.id },
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        });

        if (partidoPorFootballDataId) {
          resultados.push({
            success: true,
            partido: partidoPorFootballDataId,
            action: "existing",
            message: `Partido ${seleccionLocal.nombre} vs ${seleccionVisitante.nombre} ya existia con footballDataId.`,
          });

          continue;
        }

        const partidoExistente = await prisma.partido.findFirst({
          where: {
            fecha: new Date(partidoApi.utcDate),
            seleccionLocalId: seleccionLocal.id,
            seleccionVisitanteId: seleccionVisitante.id,
          },
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        });

        if (partidoExistente) {
          const partidoActualizado = await prisma.partido.update({
            where: { id: partidoExistente.id },
            data: {
              footballDataId: partidoApi.id,
              estadio: partidoApi.venue ?? partidoExistente.estadio ?? "A confirmar",
            },
            include: {
              fase: true,
              seleccionLocal: true,
              seleccionVisitante: true,
              resultado: true,
            },
          });

          resultados.push({
            success: true,
            partido: partidoActualizado,
            action: "updated",
            message: `Partido ${seleccionLocal.nombre} vs ${seleccionVisitante.nombre} ya existia y se actualizo con footballDataId.`,
          });

          continue;
        }

        const partido = await prisma.partido.create({
          data: {
            footballDataId: partidoApi.id,
            fecha: new Date(partidoApi.utcDate),
            estadio: partidoApi.venue ?? "A confirmar",
            ciudad: "A confirmar",
            faseId: fase.id,
            seleccionLocalId: seleccionLocal.id,
            seleccionVisitanteId: seleccionVisitante.id,
          },
          include: {
            fase: true,
            seleccionLocal: true,
            seleccionVisitante: true,
            resultado: true,
          },
        });

        resultados.push({
          success: true,
          partido,
          action: "created",
          message: `Partido ${seleccionLocal.nombre} vs ${seleccionVisitante.nombre} creado`,
        });
      } catch (error) {
        resultados.push({
          success: false,
          partidoApiId: partidoApi.id,
          action: "error",
          message: `Error creando partido: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        });
      }
    }

    const creados = resultados.filter((r) => r.action === "created").length;
    const existentes = resultados.filter((r) => r.action === "existing").length;
    const actualizados = resultados.filter((r) => r.action === "updated").length;
    const omitidos = resultados.filter((r) => r.action === "omitted").length;
    const fallidos = resultados.filter((r) => r.action === "error").length;
    const totalProcesados = resultados.length;
    const totalEnBase = await prisma.partido.count({
      where: {
        activo: true,
      },
    });

    return NextResponse.json({
      message: `Carga completada. ${creados} partidos creados, ${actualizados} actualizados, ${existentes} existentes, ${omitidos} omitidos y ${fallidos} errores.`,
      meta: {
        fase: requestedPhase || null,
        stageFilter: stageFilter || null,
        totalApi: partidosApi.length,
        totalProcesados,
        creados,
        actualizados,
        existentes,
        omitidos,
        fallidos,
        totalEnBase,
      },
      resultados,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "No autorizado. Debes iniciar sesion.",
        },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          message: "No tenés permisos para cargar partidos.",
        },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/cargar-api error:", err);

    return NextResponse.json(
      {
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
