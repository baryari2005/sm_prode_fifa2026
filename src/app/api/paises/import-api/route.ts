import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { getNombreSeleccionEnEspanol } from "@/features/paises/lib/selecciones-es";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FootballDataTeam = {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

type FootballDataTeamsResponse = {
  teams?: FootballDataTeam[];
  message?: string;
};

function normalizeName(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const token = process.env.FOOTBALL_DATA_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: "Falta configurar FOOTBALL_DATA_API_TOKEN" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/teams?season=2026",
      {
        method: "GET",
        headers: {
          "X-Auth-Token": token,
        },
        cache: "no-store",
      }
    );

    const payload = (await response.json()) as FootballDataTeamsResponse;

    if (!response.ok) {
      return NextResponse.json(
        { message: payload.message || "Error al consultar football-data.org" },
        { status: response.status }
      );
    }

    const teams = Array.isArray(payload.teams) ? payload.teams : [];
    const selecciones = await prisma.seleccion.findMany();
    const byCode = new Map(selecciones.map((item) => [item.codigo.toUpperCase(), item]));
    const byName = new Map(selecciones.map((item) => [normalizeName(item.nombre), item]));

    let updated = 0;
    let created = 0;
    const results: Array<{ team: string; status: string; seleccion?: string }> = [];

    for (const team of teams) {
      if (!team.id || !team.tla || !team.name) {
        results.push({
          team: team.name ?? team.tla ?? "Sin dato",
          status: "omitido: faltan datos",
        });
        continue;
      }

      const codigo = team.tla.toUpperCase();
      const nombreTraducido = getNombreSeleccionEnEspanol({
        codigo,
        nombre: team.name,
      });
      const matched =
        byCode.get(codigo) ??
        byName.get(normalizeName(team.name)) ??
        (team.shortName ? byName.get(normalizeName(team.shortName)) : undefined);

      if (!matched) {
        const createdSeleccion = await prisma.seleccion.create({
          data: {
            nombre: nombreTraducido,
            codigo,
            footballDataTeamId: team.id,
            bandera: team.crest ?? null,
            activo: true,
          },
        });

        byCode.set(codigo, createdSeleccion);
        byName.set(normalizeName(createdSeleccion.nombre), createdSeleccion);
        created += 1;
        results.push({
          team: team.name,
          status: "creada",
          seleccion: createdSeleccion.nombre,
        });
        continue;
      }

      const changed =
        matched.footballDataTeamId !== team.id ||
        (team.crest && matched.bandera !== team.crest) ||
        matched.nombre !== nombreTraducido;

      if (!changed) {
        results.push({
          team: team.name,
          status: "sin cambios",
          seleccion: matched.nombre,
        });
        continue;
      }

      const updatedSeleccion = await prisma.seleccion.update({
        where: { id: matched.id },
        data: {
          nombre: nombreTraducido,
          footballDataTeamId: team.id,
          bandera: team.crest ?? matched.bandera,
        },
      });

      byCode.set(codigo, updatedSeleccion);
      byName.set(normalizeName(updatedSeleccion.nombre), updatedSeleccion);
      updated += 1;
      results.push({
        team: team.name,
        status: "actualizada",
        seleccion: updatedSeleccion.nombre,
      });
    }

    return NextResponse.json({
      message: `Sincronizacion completada. ${updated} actualizadas, ${created} creadas.`,
      meta: {
        totalApi: teams.length,
        updated,
        created,
      },
      results,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenes permisos para sincronizar selecciones." },
        { status: 403 }
      );
    }

    console.error("POST /api/paises/import-api error:", err);
    return NextResponse.json(
      { message: "Error al sincronizar selecciones desde la API" },
      { status: 500 }
    );
  }
}
