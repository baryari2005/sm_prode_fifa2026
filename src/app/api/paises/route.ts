import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { paisCreateSchema } from "@/features/paises/schemas/paises.schema";
import { parsePaisListParams } from "@/features/paises/lib/paises.filters";
import {
  listPaises,
  createPais,
  handlePaisError,
} from "@/features/paises/services/paises.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "ver");

    const params = parsePaisListParams(req.url);
    const { items, meta } = await listPaises(params);

    return NextResponse.json({
      data: items,
      meta,
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
        { message: "No tenés permisos para ver selecciones." },
        { status: 403 }
      );
    }

    console.error("GET /api/paises error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "crear");

    const body = await req.json();
    const dto = paisCreateSchema.parse(body);

    // Transform null to undefined for optional fields
    const transformedDto = {
      ...dto,
      footballDataTeamId: dto.footballDataTeamId ?? undefined,
      bandera: dto.bandera ?? undefined,
      grupo: dto.grupo ?? undefined,
      confederacion: dto.confederacion ?? undefined,
    };

    const pais = await createPais(transformedDto);

    return NextResponse.json(pais, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear selecciones." },
        { status: 403 }
      );
    }

    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { message: "Datos inválidos", errors: err },
        { status: 400 }
      );
    }

    const { message, status } = handlePaisError(err);

    return NextResponse.json({ message }, { status });
  }
}
