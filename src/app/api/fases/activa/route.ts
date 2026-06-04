import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const faseActiva = await prisma.fase.findFirst({
      where: {
        activo: true,
        partidos: {
          some: {
            activo: true,
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        orden: true,
      },
      orderBy: [
        {
          orden: "desc",
        },
        {
          id: "desc",
        },
      ],
    });

    return NextResponse.json(faseActiva, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[GET_FASE_ACTIVA]", error);

    return NextResponse.json(
      { message: "Error al obtener la fase activa" },
      { status: 500 },
    );
  }
}
