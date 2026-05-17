import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "usuarios", "ver");

    const count = await prisma.usuario.count({
      where: {
        aprobado: false,
        deletedAt: null,
      },
    });

    return NextResponse.json({ count });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver usuarios." },
        { status: 403 }
      );
    }

    console.error("GET /api/admin/pending-users error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
