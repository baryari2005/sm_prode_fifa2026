import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const selecciones = await prisma.seleccion.findMany({
      where: {
        activo: true,
        footballDataTeamId: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    let importedSelections = 0;
    let importedPlayers = 0;
    const summaries: Array<{
      seleccionId: string;
      success: boolean;
      imported: number;
      cleared: number;
      seleccionNombre?: string | null;
      coach?: string | null;
      message?: string | null;
    }> = [];

    for (const seleccion of selecciones) {
      const baseUrl = new URL(req.url);
      const target = `${baseUrl.origin}/api/paises/${seleccion.id}/plantel/import-api`;

      let response: Response | null = null;
      let payload:
        | {
            message?: string;
            meta?: {
              totalImported?: number;
              cleared?: number;
              seleccionId?: string;
              seleccionNombre?: string | null;
              coach?: string | null;
            };
          }
        | undefined;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        response = await fetch(target, {
          method: "POST",
          headers: {
            authorization: req.headers.get("authorization") ?? "",
          },
          cache: "no-store",
        });

        payload = (await response.json()) as typeof payload;

        if (response.ok) {
          break;
        }

        if (response.status !== 429 || attempt === 2) {
          break;
        }

        const retryAfterSeconds = Number(response.headers.get("retry-after") ?? 0);
        const backoffMs = retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : 2000 * (attempt + 1);

        await sleep(backoffMs);
      }

      if (!response?.ok) {
        summaries.push({
          seleccionId: payload?.meta?.seleccionId ?? seleccion.id,
          success: false,
          imported: 0,
          cleared: 0,
          seleccionNombre: payload?.meta?.seleccionNombre ?? null,
          coach: payload?.meta?.coach ?? null,
          message: payload?.message ?? `Error HTTP ${response?.status ?? 500}`,
        });
        await sleep(1200);
        continue;
      }

      importedSelections += 1;
      importedPlayers += payload?.meta?.totalImported ?? 0;
      summaries.push({
        seleccionId: payload?.meta?.seleccionId ?? seleccion.id,
        success: true,
        imported: payload?.meta?.totalImported ?? 0,
        cleared: payload?.meta?.cleared ?? 0,
        seleccionNombre: payload?.meta?.seleccionNombre ?? null,
        coach: payload?.meta?.coach ?? null,
        message: payload?.message ?? null,
      });

      await sleep(1200);
    }

    return NextResponse.json({
      message: `Importacion completada. ${importedPlayers} jugadores importados en ${importedSelections} selecciones.`,
      meta: {
        importedSelections,
        importedPlayers,
        failedSelections: summaries.filter((item) => !item.success).length,
        summaries,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para importar planteles." },
        { status: 403 }
      );
    }

    console.error("POST /api/planteles/import-api error:", err);
    return NextResponse.json(
      { message: "Error al importar todos los planteles desde la API" },
      { status: 500 }
    );
  }
}
