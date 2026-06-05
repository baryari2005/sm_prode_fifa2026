import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PatchUserDto } from "../schemas/user.patch.schema";
import { ymdToUTCDate } from "../lib/user.date";
import { shouldBlockProtectedDevSupMutation } from "../lib/user-protection";

function toNull(v: unknown) {
  return v === "" || v === undefined ? null : v;
}

function normalizeTrimmedNullable(v: unknown) {
  const normalized = toNull(v);
  return normalized?.toString().trim() ?? null;
}

export async function getUserByIdOrThrow(id: string) {
  const user = await prisma.usuario.findUnique({
    where: { id },
    include: { rol: true },
  });

  if (!user || user.deletedAt) {
    const error = new Error("Usuario no encontrado");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  return user;
}

export async function updateUserById(
  id: string,
  dto: PatchUserDto,
  actor?: { rol?: { nombre?: string | null } | null },
) {
  const exists = await prisma.usuario.findUnique({
    where: { id },
    include: { rol: true },
  });

  if (!exists || exists.deletedAt) {
    const error = new Error("Usuario no encontrado");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  if (
    actor &&
    shouldBlockProtectedDevSupMutation({
      actor,
      target: exists,
    }) &&
    ("rolId" in dto || "aprobado" in dto)
  ) {
    const error = new Error(
      "El usuario con rol dev-sup solo puede ser administrado por otro dev-sup."
    );
    (error as Error & { status?: number }).status = 403;
    throw error;
  }

  const data: Record<string, unknown> = {};

  if ("userId" in dto) data.userId = dto.userId?.trim();
  if ("email" in dto) data.email = dto.email?.toLowerCase().trim();
  if ("rolId" in dto) data.rolId = dto.rolId;
  if ("aprobado" in dto) data.aprobado = dto.aprobado;
  if ("password" in dto && dto.password) {
    data.password = await bcrypt.hash(dto.password, 12);
  }

  if ("nombre" in dto) data.nombre = normalizeTrimmedNullable(dto.nombre);
  if ("apellido" in dto) data.apellido = normalizeTrimmedNullable(dto.apellido);
  if ("avatarUrl" in dto) data.avatarUrl = toNull(dto.avatarUrl);
  if ("celular" in dto) data.celular = toNull(dto.celular);
  if ("domicilio" in dto) data.domicilio = toNull(dto.domicilio);
  if ("localidad" in dto) data.localidad = toNull(dto.localidad);
  if ("codigoPostal" in dto) data.codigoPostal = toNull(dto.codigoPostal);

  if ("tipoDocumento" in dto) data.tipoDocumento = dto.tipoDocumento ?? null;
  if ("documento" in dto) data.documento = toNull(dto.documento);
  if ("cuil" in dto) data.cuil = toNull(dto.cuil);

  if ("fechaNacimiento" in dto) {
    data.fechaNacimiento = ymdToUTCDate(dto.fechaNacimiento ?? null);
  }

  if ("genero" in dto) data.genero = dto.genero ?? null;
  if ("estadoCivil" in dto) data.estadoCivil = dto.estadoCivil ?? null;
  if ("nacionalidad" in dto) data.nacionalidad = dto.nacionalidad ?? null;

  const updated = await prisma.usuario.update({
    where: { id },
    data,
    include: { rol: true },
  });

  return updated;
}

export async function softDeleteUserById(
  id: string,
  actor?: { rol?: { nombre?: string | null } | null },
) {
  const user = await prisma.usuario.findUnique({
    where: { id },
    include: { rol: true },
  });

  if (!user || user.deletedAt) {
    const error = new Error("Usuario no encontrado");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  if (
    actor &&
    shouldBlockProtectedDevSupMutation({
      actor,
      target: user,
    })
  ) {
    const error = new Error(
      "El usuario con rol dev-sup solo puede ser eliminado por otro dev-sup."
    );
    (error as Error & { status?: number }).status = 403;
    throw error;
  }

  await prisma.usuario.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export function mapUserDetailError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = (error.meta?.target as string[] | undefined) ?? [];

    let message = "Existe otro registro con ese valor.";
    if (target.includes("email")) message = "El email ya está registrado.";
    if (target.includes("userId")) message = "El usuario (userId) ya existe.";
    if (target.includes("documento")) message = "El documento ya está registrado.";
    if (target.includes("cuil")) message = "El CUIL ya está registrado.";

    return { message, status: 409 };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as { issues?: { message?: string }[] }).issues)
  ) {
    const issues = (error as { issues: { message?: string }[] }).issues;
    return {
      message: issues.map((i) => i.message).filter(Boolean).join(", ") || "Bad Request",
      status: 400,
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  ) {
    return {
      message: String((error as { message: string }).message),
      status: Number((error as { status: number }).status) || 400,
    };
  }

  return {
    message:
      error instanceof Error ? error.message : "Bad Request",
    status: 400,
  };
}
