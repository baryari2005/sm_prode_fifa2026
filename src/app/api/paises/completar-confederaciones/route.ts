import { NextRequest, NextResponse } from "next/server";

import { completarConfederacionesPaises } from "@/features/paises/services/paises.service";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const result = await completarConfederacionesPaises();

    return NextResponse.json(
      {
        message: `Confederaciones completadas. ${result.actualizadas} actualizadas, ${result.sinCambios} sin cambios, ${result.sinMapeo} sin mapeo.`,
        meta: {
          total: result.total,
          actualizadas: result.actualizadas,
          sinCambios: result.sinCambios,
          sinMapeo: result.sinMapeo,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para completar confederaciones." },
        { status: 403 },
      );
    }

    console.error("POST /api/paises/completar-confederaciones error:", err);
    return NextResponse.json(
      { message: "Error al completar confederaciones." },
      { status: 500 },
    );
  }
}
