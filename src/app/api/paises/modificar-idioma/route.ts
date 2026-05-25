import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { actualizarNombresPaisesAEspanol } from "@/features/paises/services/paises.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const resultado = await actualizarNombresPaisesAEspanol();

    return NextResponse.json(
      {
        message: `Proceso completado. ${resultado.actualizadas} selecciones actualizadas a español.`,
        meta: {
          total: resultado.total,
          actualizadas: resultado.actualizadas,
          sinCambios: resultado.sinCambios,
        },
        results: resultado.resultados,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para modificar el idioma de las selecciones." },
        { status: 403 }
      );
    }

    console.error("POST /api/paises/modificar-idioma error:", err);

    return NextResponse.json(
      { message: "Error al modificar el idioma de las selecciones" },
      { status: 500 }
    );
  }
}
