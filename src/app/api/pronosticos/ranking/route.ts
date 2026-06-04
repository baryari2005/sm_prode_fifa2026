import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...(init?.headers ?? {}),
    },
  });
}

function getDisplayName(user: {
  nombre?: string | null;
  apellido?: string | null;
  userId?: string | null;
  email?: string | null;
}) {
  const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim();
  return fullName || user.userId || user.email || "Usuario";
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const url = new URL(req.url);
    const faseIdParam = url.searchParams.get("faseId");
    const scopeParam = url.searchParams.get("scope");
    const faseId = faseIdParam ? Number(faseIdParam) : null;
    const scope =
      scopeParam === "grupos" || scopeParam === "eliminatorias"
        ? scopeParam
        : null;

    if (faseIdParam && (!faseId || Number.isNaN(faseId))) {
      return noStoreJson(
        { message: "faseId es invalido." },
        { status: 400 },
      );
    }

    if (scopeParam && !scope) {
      return noStoreJson(
        { message: "scope es invalido." },
        { status: 400 },
      );
    }

    const fases = await prisma.fase.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        orden: true,
      },
      orderBy: {
        orden: "asc",
      },
    });

    const phaseOfGroups = fases[0] ?? null;
    const knockoutPhases = phaseOfGroups
      ? fases.filter((fase) => fase.orden > phaseOfGroups.orden)
      : [];

    let resolvedFaseId = faseId;
    let resolvedFaseMeta:
      | {
          id: number;
          nombre: string;
          orden: number;
        }
      | null = null;

    if (scope === "grupos" && phaseOfGroups) {
      resolvedFaseId = phaseOfGroups.id;
      resolvedFaseMeta = {
        id: phaseOfGroups.id,
        nombre: "Fase de grupos",
        orden: phaseOfGroups.orden,
      };
    }

    if (scope === "eliminatorias") {
      const latestKnockoutPhase = knockoutPhases.at(-1) ?? null;

      if (latestKnockoutPhase) {
        resolvedFaseId = latestKnockoutPhase.id;
        resolvedFaseMeta = {
          id: latestKnockoutPhase.id,
          nombre: "Fase eliminatorias",
          orden: latestKnockoutPhase.orden,
        };
      } else {
        resolvedFaseId = null;
        resolvedFaseMeta = {
          id: 0,
          nombre: "Fase eliminatorias",
          orden: (phaseOfGroups?.orden ?? 0) + 1,
        };
      }
    }

    const [rankingRows, myScoredPredictions] = await Promise.all([
      resolvedFaseId
        ? prisma.rankingUsuarioFase.findMany({
            where: {
              faseId: resolvedFaseId,
            },
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  userId: true,
                  email: true,
                  avatarUrl: true,
                },
              },
              fase: {
                select: {
                  id: true,
                  nombre: true,
                  orden: true,
                },
              },
            },
            orderBy: [
              { puntosTotales: "desc" },
              { aciertosExactos: "desc" },
              { aciertosTendencia: "desc" },
              { updatedAt: "asc" },
            ],
          })
        : prisma.rankingUsuario.findMany({
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  userId: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: [
              { puntosTotales: "desc" },
              { aciertosExactos: "desc" },
              { aciertosTendencia: "desc" },
              { updatedAt: "asc" },
            ],
          }),
      prisma.prediccionPartido.findMany({
        where: {
          usuarioId: loggedInUser.id,
          calculadoAt: {
            not: null,
          },
          ...(scope === "grupos" && phaseOfGroups
            ? {
                partido: {
                  faseId: phaseOfGroups.id,
                },
              }
            : {}),
          ...(scope === "eliminatorias" && phaseOfGroups
            ? {
                partido: {
                  fase: {
                    orden: {
                      gt: phaseOfGroups.orden,
                    },
                  },
                },
              }
            : {}),
          ...(scope === null && resolvedFaseId
            ? {
                partido: {
                  faseId: resolvedFaseId,
                },
              }
            : {}),
        },
        include: {
          partido: {
            include: {
              fase: true,
              seleccionLocal: true,
              seleccionVisitante: true,
              resultado: true,
            },
          },
        },
        orderBy: {
          calculadoAt: "desc",
        },
        take: 20,
      }),
    ]);

    const fase = resolvedFaseMeta ??
      (resolvedFaseId && rankingRows.length > 0 && "fase" in rankingRows[0]
        ? rankingRows[0].fase
        : resolvedFaseId
          ? await prisma.fase.findUnique({
              where: { id: resolvedFaseId },
              select: { id: true, nombre: true, orden: true },
            })
          : null);

    const ranking = rankingRows.map((row, index) => ({
      posicion: index + 1,
      usuarioId: row.usuarioId,
      nombre: getDisplayName(row.usuario),
      avatarUrl: row.usuario.avatarUrl ?? null,
      puntosTotales: row.puntosTotales,
      aciertosExactos: row.aciertosExactos,
      aciertosTendencia: row.aciertosTendencia,
      partidosPronosticados: row.partidosPronosticados,
      partidosCalificados: row.partidosCalificados,
      updatedAt: row.updatedAt,
    }));

    const miRanking = ranking.find((item) => item.usuarioId === loggedInUser.id) ?? {
      posicion: null,
      usuarioId: loggedInUser.id,
      nombre: getDisplayName(loggedInUser),
      avatarUrl: loggedInUser.avatarUrl ?? null,
      puntosTotales: 0,
      aciertosExactos: 0,
      aciertosTendencia: 0,
      partidosPronosticados: 0,
      partidosCalificados: 0,
      updatedAt: null,
    };

    const historial = myScoredPredictions.map((item) => ({
      id: item.id,
      partidoId: item.partidoId,
      golesLocal: item.golesLocal,
      golesVisitante: item.golesVisitante,
      puntosOtorgados: item.puntosOtorgados,
      aciertoTipo: item.aciertoTipo,
      calculadoAt: item.calculadoAt,
      partido: {
        id: item.partido.id,
        fecha: item.partido.fecha,
        fase: item.partido.fase,
        seleccionLocal: item.partido.seleccionLocal,
        seleccionVisitante: item.partido.seleccionVisitante,
        resultado: item.partido.resultado,
      },
    }));

    return noStoreJson({
      data: {
        fase,
        miRanking,
        ranking,
        historial,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return noStoreJson(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      );
    }

    console.error("GET /api/pronosticos/ranking error:", err);

    return noStoreJson(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
