import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const fases = await prisma.fase.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        orden: "asc",
      },
      select: {
        id: true,
        nombre: true,
        orden: true,
      },
    });

    return NextResponse.json(fases);
  } catch (error) {
    console.error("[GET_FASES]", error);

    return NextResponse.json(
      { message: "Error al obtener las fases" },
      { status: 500 }
    );
  }
}