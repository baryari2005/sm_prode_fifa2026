import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";

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

function normalizeGrupo(value?: string | null) {
  return value?.trim().toUpperCase() || null;
}

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const faseDeGrupos = await prisma.fase.findFirst({
      where: {
        activo: true,
        OR: [{ orden: 1 }, { nombre: { contains: "Grupos" } }],
      },
      orderBy: { orden: "asc" },
    });

    if (!faseDeGrupos) {
      return noStoreJson({ grupos: [] });
    }

    const partidos = await prisma.partido.findMany({
      where: {
        activo: true,
        faseId: faseDeGrupos.id,
      },
      include: {
        resultado: true,
        seleccionLocal: true,
        seleccionVisitante: true,
      },
      orderBy: [{ fecha: "asc" }, { createdAt: "asc" }],
    });

    const gruposMap = new Map<
      string,
      {
        grupo: string;
        equipos: Array<{
          id: string;
          nombre: string;
          codigo: string;
          banderaUrl: string | null;
          grupo: string;
          rankingFifa: null;
          fairPlayScore: null;
        }>;
        partidos: Array<{
          id: string;
          grupo: string;
          fecha: string;
          local: {
            id: string;
            nombre: string;
            codigo: string;
            banderaUrl: string | null;
            grupo: string;
            rankingFifa: null;
            fairPlayScore: null;
          };
          visitante: {
            id: string;
            nombre: string;
            codigo: string;
            banderaUrl: string | null;
            grupo: string;
            rankingFifa: null;
            fairPlayScore: null;
          };
          golesLocal: number | null;
          golesVisitante: number | null;
        }>;
      }
    >();

    for (const partido of partidos) {
      const grupo =
        normalizeGrupo(partido.seleccionLocal?.grupo) ??
        normalizeGrupo(partido.seleccionVisitante?.grupo);

      if (!grupo || !partido.seleccionLocal || !partido.seleccionVisitante) {
        continue;
      }

      const existing = gruposMap.get(grupo) ?? {
        grupo,
        equipos: [],
        partidos: [],
      };

      const local = {
        id: partido.seleccionLocal.id,
        nombre: partido.seleccionLocal.nombre,
        codigo: partido.seleccionLocal.codigo,
        banderaUrl: partido.seleccionLocal.bandera,
        grupo,
        rankingFifa: null,
        fairPlayScore: null,
      };

      const visitante = {
        id: partido.seleccionVisitante.id,
        nombre: partido.seleccionVisitante.nombre,
        codigo: partido.seleccionVisitante.codigo,
        banderaUrl: partido.seleccionVisitante.bandera,
        grupo,
        rankingFifa: null,
        fairPlayScore: null,
      };

      if (!existing.equipos.some((team) => team.id === local.id)) {
        existing.equipos.push(local);
      }

      if (!existing.equipos.some((team) => team.id === visitante.id)) {
        existing.equipos.push(visitante);
      }

      existing.partidos.push({
        id: partido.id,
        grupo,
        fecha: partido.fecha.toISOString(),
        local,
        visitante,
        golesLocal: partido.resultado?.golesLocal ?? null,
        golesVisitante: partido.resultado?.golesVisitante ?? null,
      });

      gruposMap.set(grupo, existing);
    }

    const grupos = Array.from(gruposMap.values())
      .sort((a, b) => a.grupo.localeCompare(b.grupo))
      .map((grupo) => ({
        ...grupo,
        equipos: [...grupo.equipos].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        partidos: [...grupo.partidos].sort((a, b) => a.fecha.localeCompare(b.fecha)),
      }));

    return noStoreJson({ grupos });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return noStoreJson(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return noStoreJson(
        { message: "No tenés permisos para usar el simulador." },
        { status: 403 },
      );
    }

    console.error("GET /api/simulador-mundial/base error:", err);

    return noStoreJson(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
