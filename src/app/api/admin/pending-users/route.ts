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

    return noStoreJson({ count });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return noStoreJson(
        { message: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return noStoreJson(
        { message: "No tenés permisos para ver usuarios." },
        { status: 403 },
      );
    }

    console.error("GET /api/admin/pending-users error:", err);

    return noStoreJson({ message: "Error interno del servidor" }, { status: 500 });
  }
}
