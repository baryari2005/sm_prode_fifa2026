import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { getReglasCruce, createReglaCruce } from "@/features/partidos/services/reglas-cruce.service";
import { reglaCruceCreateSchema } from "@/features/partidos/schemas/regla-cruce.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "partidos", "ver");

    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    const sortBy = url.searchParams.get("sortBy") ?? undefined;
    const sortDir =
      url.searchParams.get("sortDir") === "desc" ? "desc" : "asc";

    const safePage = Number.isNaN(page) ? 1 : Math.max(1, page);
    const safePageSize = Number.isNaN(pageSize)
      ? 10
      : Math.min(Math.max(1, pageSize), 100);

    const { items, total } = await getReglasCruce({
      q,
      page: safePage,
      pageSize: safePageSize,
      sortBy,
      sortDir,
    });

    return NextResponse.json({
      data: items,
      meta: {
        total,
        page: safePage,
        pageSize: safePageSize,
        pageCount: Math.max(1, Math.ceil(total / safePageSize)),
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
        { message: "No tenés permisos para ver reglas." },
        { status: 403 }
      );
    }

    console.error("GET /api/reglas-cruces error:", err);
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
    const dto = reglaCruceCreateSchema.parse(body);

    const regla = await createReglaCruce({
      nombre: dto.nombre,
      partidoNumero: dto.partidoNumero,
      faseId: dto.faseId,
      localOrigen: dto.localOrigen,
      visitanteOrigen: dto.visitanteOrigen,
      estadio: dto.estadio ?? null,
      fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      hora: dto.hora ?? null,
      orden: dto.orden ?? 0,
    });

    return NextResponse.json(regla, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear reglas." },
        { status: 403 }
      );
    }

    console.error("POST /api/reglas-cruces error:", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
