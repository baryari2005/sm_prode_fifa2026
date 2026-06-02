import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  matches?: FootballDataMatch[];
  message?: string;
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
  if (!team?.name || !team.tla) return false;

  const codigo = team.tla.toUpperCase();
  return codigo !== "TBD" && codigo !== "TBA";
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
        { message: "Falta configurar FOOTBALL_DATA_API_TOKEN en el archivo .env.local" },
        { status: 500 }
      );
    }

    if (!urlApi) {
      return NextResponse.json(
        { message: "Falta configurar MUNDIAL_2026_API_URL en el archivo .env.local" },
        { status: 500 }
      );
    }

    const apiUrl = new URL(normalizarApiUrl(urlApi));
    apiUrl.searchParams.set("season", "2026");

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

    const partidosApi = apiData.matches ?? [];

    if (partidosApi.length === 0) {
      return NextResponse.json({
        message: "La API no devolvio partidos para el Mundial 2026.",
        resultados: [],
      });
    }

    const partidosActuales = await prisma.partido.findMany({
      where: { activo: true },
      select: { id: true },
    });

    const partidoIds = partidosActuales.map((partido) => partido.id);

    const borrado = await prisma.$transaction(async (tx) => {
      const resultadosEliminados = partidoIds.length
        ? await tx.resultado.deleteMany({
            where: {
              partidoId: { in: partidoIds },
            },
          })
        : { count: 0 };

      const prediccionesEliminadas = partidoIds.length
        ? await tx.prediccionPartido.deleteMany({
            where: {
              partidoId: { in: partidoIds },
            },
          })
        : { count: 0 };

      const partidosEliminados = await tx.partido.deleteMany({
        where: { activo: true },
      });

      const plantelesEliminados = await tx.jugadorSeleccion.deleteMany({});
      const seleccionesEliminadas = await tx.seleccion.deleteMany({});

      await tx.rankingUsuario.updateMany({
        data: {
          puntosTotales: 0,
          aciertosExactos: 0,
          aciertosTendencia: 0,
          partidosPronosticados: 0,
          partidosCalificados: 0,
        },
      });

      return {
        resultadosEliminados: resultadosEliminados.count,
        prediccionesEliminadas: prediccionesEliminadas.count,
        partidosEliminados: partidosEliminados.count,
        plantelesEliminados: plantelesEliminados.count,
        seleccionesEliminadas: seleccionesEliminadas.count,
      };
    });

    const resultados: Array<{
      success: boolean;
      partidoApiId?: number;
      partidoId?: string;
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
            message: "Partido omitido porque todavia no tiene selecciones confirmadas.",
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
        } else {
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
        } else {
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
        });

        resultados.push({
          success: true,
          partidoApiId: partidoApi.id,
          partidoId: partido.id,
          message: `Partido ${seleccionLocal.nombre} vs ${seleccionVisitante.nombre} recreado desde API.`,
        });
      } catch (error) {
        resultados.push({
          success: false,
          partidoApiId: partidoApi.id,
          message: `Error recreando partido: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        });
      }
    }

    const creados = resultados.filter((item) => item.success).length;
    const omitidos = resultados.filter((item) =>
      item.message.toLowerCase().includes("omitido")
    ).length;
    const fallidos = resultados.filter(
      (item) => !item.success && !item.message.toLowerCase().includes("omitido")
    ).length;

    return NextResponse.json({
      message: `Reimportacion completa. ${borrado.seleccionesEliminadas} selecciones eliminadas, ${borrado.partidosEliminados} partidos eliminados, ${creados} recreados, ${omitidos} omitidos y ${fallidos} errores.`,
      meta: {
        totalApi: partidosApi.length,
        ...borrado,
        creados,
        omitidos,
        fallidos,
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
        { message: "No tenés permisos para reimportar partidos." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos/reimportar-api error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
