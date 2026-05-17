import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { ReglaCruce, ReglaCruceCreateInput, ReglaCruceUpdateInput } from "@/features/partidos/types/types";

type GetReglasCruceParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

function buildOrderBy(
  sortBy?: string,
  sortDir: Prisma.SortOrder = "asc"
): Prisma.ReglaCruceOrderByWithRelationInput[] {
  switch (sortBy) {
    case "nombre":
      return [{ nombre: sortDir }];
    case "partidoNumero":
      return [{ partidoNumero: sortDir }];
    case "localOrigen":
      return [{ localOrigen: sortDir }];
    case "visitanteOrigen":
      return [{ visitanteOrigen: sortDir }];
    case "fecha":
      return [{ fecha: sortDir }];
    case "hora":
      return [{ hora: sortDir }];
    case "estadio":
      return [{ estadio: sortDir }];
    case "fase":
      return [{ fase: { nombre: sortDir } }];
    default:
      return [{ orden: "asc" }, { partidoNumero: "asc" }];
  }
}

export async function getReglasCruce(params?: GetReglasCruceParams): Promise<{
  items: ReglaCruce[];
  total: number;
}> {
  const search = params?.q?.trim();

  const where: Prisma.ReglaCruceWhereInput = {
    activo: true,
    ...(search
      ? {
          OR: [
            { nombre: { contains: search, mode: "insensitive" } },
            { localOrigen: { contains: search, mode: "insensitive" } },
            { visitanteOrigen: { contains: search, mode: "insensitive" } },
            { estadio: { contains: search, mode: "insensitive" } },
            {
              fase: {
                is: {
                  nombre: { contains: search, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  const take = params?.pageSize ?? 10;
  const page = Math.max(1, params?.page ?? 1);
  const skip = (page - 1) * take;
  const sortDir = params?.sortDir === "desc" ? "desc" : "asc";

  const [items, total] = await Promise.all([
    prisma.reglaCruce.findMany({
      where,
      include: { fase: true },
      orderBy: buildOrderBy(params?.sortBy, sortDir),
      take,
      skip,
    }),
    prisma.reglaCruce.count({ where }),
  ]);

  return { items, total };
}

export async function getAllReglasCruce(): Promise<ReglaCruce[]> {
  return prisma.reglaCruce.findMany({
    where: { activo: true },
    include: { fase: true },
    orderBy: [{ orden: "asc" }, { partidoNumero: "asc" }],
  });
}

export async function getReglaCruceById(id: string): Promise<ReglaCruce | null> {
  return prisma.reglaCruce.findFirst({
    where: { id, activo: true },
    include: { fase: true },
  });
}

export async function createReglaCruce(
  data: ReglaCruceCreateInput
): Promise<ReglaCruce> {
  return prisma.reglaCruce.create({
    data: {
      ...data,
      activo: true,
      orden: data.orden ?? 0,
    },
    include: { fase: true },
  });
}

export async function updateReglaCruce(
  id: string,
  data: ReglaCruceUpdateInput
): Promise<ReglaCruce> {
  return prisma.reglaCruce.update({
    where: { id },
    data,
    include: { fase: true },
  });
}

export async function deleteReglaCruce(id: string): Promise<void> {
  await prisma.reglaCruce.update({
    where: { id },
    data: { activo: false },
  });
}
