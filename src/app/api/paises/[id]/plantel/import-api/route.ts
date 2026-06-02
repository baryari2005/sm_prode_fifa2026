import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { prisma } from "@/lib/db";
import { replaceJugadoresSeleccion } from "@/features/partidos/services/partido.service";
import { normalizePlantelPositionCode } from "@/features/planteles/helpers/plantel-position.helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type FootballDataPlayer = {
  id?: number | null;
  name?: string | null;
  position?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  shirtNumber?: number | null;
};

type FootballDataCoach = {
  name?: string | null;
};

type FootballDataTeamResponse = {
  id?: number | null;
  name?: string | null;
  coach?: FootballDataCoach | null;
  squad?: FootballDataPlayer[];
};

function mapPosition(position?: string | null) {
  const normalizedCode = normalizePlantelPositionCode(position);

  if (normalizedCode !== "M" || !position?.trim()) {
    return normalizedCode;
  }

  const normalized = position.trim().toLowerCase();

  switch (normalized) {
    case "attacking midfield":
      return "MO";
    case "central midfield":
      return "MC";
    case "defensive midfield":
      return "MD";
    case "right winger":
      return "ED";
    case "left winger":
      return "EI";
    case "left-back":
      return "LI";
    case "right-back":
      return "LD";
    case "centre-back":
      return "DC";
    case "centre-forward":
      return "FC";
    default:
      return "M";
  }
}

function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "paises", "editar");

    const seleccion = await prisma.seleccion.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        footballDataTeamId: true,
      },
    });

    if (!seleccion) {
      return NextResponse.json({ message: "Seleccion no encontrada" }, { status: 404 });
    }

    if (!seleccion.footballDataTeamId) {
      return NextResponse.json(
        { message: "La seleccion no tiene configurado un footballData teamId" },
        { status: 400 }
      );
    }

    const token = process.env.FOOTBALL_DATA_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: "Falta configurar FOOTBALL_DATA_API_TOKEN" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.football-data.org/v4/teams/${seleccion.footballDataTeamId}`,
      {
        method: "GET",
        headers: {
          "X-Auth-Token": token,
        },
        cache: "no-store",
      }
    );

    const payload = (await response.json()) as FootballDataTeamResponse & {
      message?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { message: payload.message || "Error al consultar football-data.org" },
        {
          status: response.status,
          headers: response.headers.get("retry-after")
            ? {
                "retry-after": response.headers.get("retry-after") as string,
              }
            : undefined,
        }
      );
    }

    const squad = Array.isArray(payload.squad) ? payload.squad : [];

    const normalizedSquad = [];
    for (const player of squad) {
      if (!player.name) continue;

      normalizedSquad.push({
          seleccionId: seleccion.id,
          nombre: player.name,
          fotoUrl: null,
          numero: player.shirtNumber ?? null,
          posicion: mapPosition(player.position),
          edad: calculateAge(player.dateOfBirth),
          estatura: null,
          peso: null,
          nacionalidad: player.nationality ?? null,
          apariciones: 0,
          suplencias: 0,
          goles: 0,
          asistencias: 0,
          tiros: 0,
          tirosAlArco: 0,
          faltasCometidas: 0,
          faltasSufridas: 0,
          amarillas: 0,
          rojas: 0,
          atajadas: 0,
          golesConcedidos: 0,
      });
    }

    const { cleared, created } = await replaceJugadoresSeleccion(
      seleccion.id,
      normalizedSquad
    );

    return NextResponse.json({
      data: created,
      meta: {
        cleared,
        totalImported: created.length,
        squadSize: squad.length,
        coach: payload.coach?.name ?? null,
        seleccionId: seleccion.id,
        seleccionNombre: seleccion.nombre,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para importar el plantel." },
        { status: 403 }
      );
    }

    console.error("POST /api/paises/[id]/plantel/import-api error:", err);
    return NextResponse.json({ message: "Error al importar desde la API" }, { status: 500 });
  }
}
