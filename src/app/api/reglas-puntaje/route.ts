import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/server-auth";
import { requirePermission } from "@/lib/server-auth";
import { reglaPuntajeSchema } from "@/features/reglas-puntaje/schemas/regla-puntaje.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function faseYaEmpezo(faseId: number) {
  const primerPartido = await prisma.partido.findFirst({
    where: {
      faseId,
      activo: true,
    },
    orderBy: {
      fecha: "asc",
    },
    select: {
      fecha: true,
    },
  });

  if (!primerPartido) return false;

  return primerPartido.fecha <= new Date();
}

export async function GET(req: NextRequest) {
  try {
    const usuario = await requireAuth(req);
    requirePermission(usuario, "reglas-puntaje", "ver");

    const { searchParams } = new URL(req.url);
    const faseId = Number(searchParams.get("faseId"));

    if (!faseId) {
      return NextResponse.json(
        { message: "faseId es requerido" },
        { status: 400 }
      );
    }

    const regla = await prisma.reglaPuntaje.findUnique({
      where: {
        faseId,
      },
    });

    const bloqueada = await faseYaEmpezo(faseId);

    if (!regla) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      ...regla,
      bloqueada,
    });
  } catch (error) {
    console.error("[GET_REGLA_PUNTAJE]", error);

    return NextResponse.json(
      { message: "Error al obtener la regla de puntaje" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const usuario = await requireAuth(req);
    requirePermission(usuario, "reglas-puntaje", "editar");

    const body = await req.json();
    const parsed = reglaPuntajeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { faseId, puntosExacto, puntosParcial, puntosSinAcierto } =
      parsed.data;

    const bloqueada = await faseYaEmpezo(faseId);

    if (bloqueada) {
      return NextResponse.json(
        {
          message:
            "Esta fase ya comenzó. Las reglas de puntaje no pueden modificarse.",
        },
        { status: 409 }
      );
    }

    const regla = await prisma.reglaPuntaje.upsert({
      where: {
        faseId,
      },
      create: {
        faseId,
        puntosExacto,
        puntosParcial,
        puntosSinAcierto,
      },
      update: {
        puntosExacto,
        puntosParcial,
        puntosSinAcierto,
      },
    });

    return NextResponse.json({
      ...regla,
      bloqueada: false,
    });
  } catch (error) {
    console.error("[POST_REGLA_PUNTAJE]", error);

    return NextResponse.json(
      { message: "Error al guardar la regla de puntaje" },
      { status: 500 }
    );
  }
}