import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";

import {
  getPartidos,
  createPartido,
  getSelecciones,
  getFases,
} from "@/features/partidos/services/partido.service";
import { partidoCreateSchema } from "@/features/partidos/schemas/partido.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 300;

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const url = new URL(req.url);

    const faseId = url.searchParams.get("faseId");
    const fechaDesde = url.searchParams.get("fechaDesde");
    const fechaHasta = url.searchParams.get("fechaHasta");
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    const params: {
      faseId?: number;
      fechaDesde?: Date;
      fechaHasta?: Date;
      limit?: number;
      offset?: number;
    } = {};

    if (faseId) params.faseId = Number(faseId);
    if (fechaDesde) params.fechaDesde = new Date(fechaDesde);
    if (fechaHasta) params.fechaHasta = new Date(fechaHasta);

    const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT;
    const offset = offsetParam ? Number(offsetParam) : 0;

    params.limit = Number.isNaN(limit)
      ? DEFAULT_LIMIT
      : Math.min(limit, MAX_LIMIT);

    params.offset = Number.isNaN(offset) ? 0 : offset;

    const { items, total } = await getPartidos(params);

    return NextResponse.json({
      data: items,
      meta: {
        total,
        limit: params.limit,
        offset: params.offset,
      },
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
        { message: "No tenés permisos para ver partidos." },
        { status: 403 }
      );
    }

    console.error("GET /api/partidos error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "crear");

    const body = await req.json();
    const dto = partidoCreateSchema.parse(body);

    const partido = await createPartido({
      footballDataId: dto.footballDataId ?? null,
      fecha: dto.fecha,
      faseId: dto.faseId,
      seleccionLocalId: dto.seleccionLocalId,
      seleccionVisitanteId: dto.seleccionVisitanteId,
      estadio: dto.estadio ?? null,
      ciudad: dto.ciudad ?? null,
    });

    return NextResponse.json(partido, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear partidos." },
        { status: 403 }
      );
    }

    console.error("POST /api/partidos error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Endpoint adicional para obtener selecciones y fases disponibles
export async function OPTIONS(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const [selecciones, fases] = await Promise.all([
      getSelecciones(),
      getFases(),
    ]);

    return NextResponse.json({
      selecciones,
      fases,
    });
  } catch {
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
