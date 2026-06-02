import { NextRequest, NextResponse } from "next/server";

import { registerSchema } from "@/features/auth/schemas/schemas";
import { createOrReviveUser } from "@/features/users/services/user.service";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Error desconocido";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const normalizedBody = {
      ...body,
      localidad: "San Miguel",
    };

    const parsed = registerSchema.safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const userRole = await prisma.rol.findFirst({
      where: { nombre: "user" },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "Rol de usuario no encontrado" },
        { status: 500 }
      );
    }

    const values = parsed.data;

    const result = await createOrReviveUser({
      userId: values.userId.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      rolId: userRole.id,
      nombre: values.nombre,
      apellido: values.apellido,
      celular: values.celular,
      tipoDocumento: values.tipoDocumento,
      documento: values.documento,
      domicilio: values.domicilio,
      localidad: "San Miguel",
    });

    await prisma.usuario.update({
      where: { id: result.id },
      data: { aprobado: true },
    });

    return NextResponse.json({
      message: "Usuario registrado correctamente. Ya podés iniciar sesión.",
      userId: result.id,
    });
  } catch (error: unknown) {
    console.error("Register error:", error);

    const message = getErrorMessage(error);

    if (message.includes("Ya existe")) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email o userId" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
