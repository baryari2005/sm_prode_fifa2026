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

    console.log(body);
    
    const parsed = registerSchema.safeParse(body);


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
      tipoDocumento: values.tipoDocumento,
      documento: values.documento,
      cuil: values.cuil,
      celular: values.celular,
      domicilio: values.domicilio,
      localidad: values.localidad,
      codigoPostal: values.codigoPostal,
      fechaNacimiento: new Date(`${values.fechaNacimiento}T00:00:00`),
      genero: values.genero,
      estadoCivil: values.estadoCivil,
      nacionalidad: values.nacionalidad,
    });

    await prisma.usuario.update({
      where: { id: result.id },
      data: { aprobado: false },
    });

    return NextResponse.json({
      message: "Usuario registrado correctamente. Pendiente de aprobación.",
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
