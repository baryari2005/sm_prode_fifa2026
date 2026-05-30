import { prisma } from "@/lib/db";
import type { Prisma, Seleccion as PrismaSeleccion } from "@prisma/client";
import type { PaisCreateInput, PaisUpdateInput, Pais } from "../types/types";
import { getConfederacionSeleccion } from "../lib/confederaciones";
import { getNombreSeleccionEnEspanol } from "../lib/selecciones-es";

const SORT_FIELDS = [
  "nombre",
  "codigo",
  "footballDataTeamId",
  "grupo",
  "confederacion",
  "createdAt",
  "updatedAt",
] as const;

type PaisSortBy = (typeof SORT_FIELDS)[number];

function normalizeSortBy(sortBy: string): PaisSortBy {
  if (SORT_FIELDS.includes(sortBy as PaisSortBy)) {
    return sortBy as PaisSortBy;
  }

  return "nombre";
}

function buildOrderBy(
  sortBy: string,
  sortDir: Prisma.SortOrder
): Prisma.SeleccionOrderByWithRelationInput {
  const safeSortBy = normalizeSortBy(sortBy);

  switch (safeSortBy) {
    case "codigo":
      return { codigo: sortDir };

    case "grupo":
      return { grupo: sortDir };

    case "footballDataTeamId":
      return { footballDataTeamId: sortDir };

    case "confederacion":
      return { confederacion: sortDir };

    case "createdAt":
      return { createdAt: sortDir };

    case "updatedAt":
      return { updatedAt: sortDir };

    case "nombre":
    default:
      return { nombre: sortDir };
  }
}

function mapPrismaToPais(prismaPais: PrismaSeleccion): Pais {
  return {
    ...prismaPais,
    bandera: prismaPais.bandera ?? undefined,
    grupo: prismaPais.grupo ?? undefined,
    confederacion: prismaPais.confederacion ?? undefined,
  };
}

export async function listPaises(params: {
  q: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}) {
  const { q, page, pageSize, sortBy, sortDir } = params;

  const search = q.trim();

  const where: Prisma.SeleccionWhereInput = search
    ? {
        OR: [
          {
            nombre: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            codigo: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const total = await prisma.seleccion.count({ where });

  const items = (
    await prisma.seleccion.findMany({
      where,
      orderBy: buildOrderBy(sortBy, sortDir),
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ).map(mapPrismaToPais);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    meta: { total, page, pageSize, pageCount },
  };
}

export async function getPaisById(id: string): Promise<Pais | null> {
  const result = await prisma.seleccion.findUnique({
    where: { id },
  });

  return result ? mapPrismaToPais(result) : null;
}

export async function createPais(data: PaisCreateInput): Promise<Pais> {
  const existe = await prisma.seleccion.findFirst({
    where: {
      OR: [
        { nombre: data.nombre },
        { codigo: data.codigo },
        ...(typeof data.footballDataTeamId === "number"
          ? [{ footballDataTeamId: data.footballDataTeamId }]
          : []),
      ],
    },
  });

  if (existe) {
    throw new Error("Ya existe una seleccion con ese nombre, codigo o teamId");
  }

  const result = await prisma.seleccion.create({
    data: {
      ...data,
      activo: true,
    },
  });

  return mapPrismaToPais(result);
}

export async function updatePais(
  id: string,
  data: PaisUpdateInput
): Promise<Pais> {
  if (data.nombre || data.codigo || typeof data.footballDataTeamId === "number") {
    const existe = await prisma.seleccion.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(data.nombre ? [{ nombre: data.nombre }] : []),
          ...(data.codigo ? [{ codigo: data.codigo }] : []),
          ...(typeof data.footballDataTeamId === "number"
            ? [{ footballDataTeamId: data.footballDataTeamId }]
            : []),
        ],
      },
    });

    if (existe) {
      throw new Error("Ya existe una seleccion con ese nombre, codigo o teamId");
    }
  }

  const result = await prisma.seleccion.update({
    where: { id },
    data,
  });

  return mapPrismaToPais(result);
}

export async function deletePais(id: string): Promise<void> {
  await prisma.seleccion.update({
    where: { id },
    data: { activo: false },
  });
}

export async function activatePais(id: string): Promise<Pais> {
  const result = await prisma.seleccion.update({
    where: { id },
    data: { activo: true },
  });

  return mapPrismaToPais(result);
}

export function handlePaisError(err: unknown): {
  message: string;
  status: number;
} {
  if (err instanceof Error) {
    if (err.message.includes("Ya existe")) {
      return { message: err.message, status: 409 };
    }
  }

  return { message: "Error al procesar la solicitud", status: 400 };
}

export async function actualizarNombresPaisesAEspanol() {
  const selecciones = await prisma.seleccion.findMany({
    orderBy: { nombre: "asc" },
  });

  let actualizadas = 0;
  const resultados: Array<{
    id: string;
    codigo: string;
    nombreAnterior: string;
    nombreNuevo: string;
    estado: "actualizada" | "sin_cambios";
  }> = [];

  for (const seleccion of selecciones) {
    const nombreNuevo = getNombreSeleccionEnEspanol({
      codigo: seleccion.codigo,
      nombre: seleccion.nombre,
    });

    if (!nombreNuevo || nombreNuevo === seleccion.nombre) {
      resultados.push({
        id: seleccion.id,
        codigo: seleccion.codigo,
        nombreAnterior: seleccion.nombre,
        nombreNuevo: seleccion.nombre,
        estado: "sin_cambios",
      });
      continue;
    }

    await prisma.seleccion.update({
      where: { id: seleccion.id },
      data: { nombre: nombreNuevo },
    });

    actualizadas += 1;
    resultados.push({
      id: seleccion.id,
      codigo: seleccion.codigo,
      nombreAnterior: seleccion.nombre,
      nombreNuevo,
      estado: "actualizada",
    });
  }

  return {
    total: selecciones.length,
    actualizadas,
    sinCambios: selecciones.length - actualizadas,
    resultados,
  };
}

export async function completarConfederacionesPaises() {
  const selecciones = await prisma.seleccion.findMany({
    orderBy: { nombre: "asc" },
  });

  let actualizadas = 0;
  let sinCambios = 0;
  let sinMapeo = 0;

  const resultados: Array<{
    id: string;
    codigo: string;
    nombre: string;
    confederacionAnterior: string | null;
    confederacionNueva: string | null;
    estado: "actualizada" | "sin_cambios" | "sin_mapeo";
  }> = [];

  for (const seleccion of selecciones) {
    const confederacionNueva = getConfederacionSeleccion(seleccion.codigo);

    if (!confederacionNueva) {
      sinMapeo += 1;
      resultados.push({
        id: seleccion.id,
        codigo: seleccion.codigo,
        nombre: seleccion.nombre,
        confederacionAnterior: seleccion.confederacion,
        confederacionNueva: null,
        estado: "sin_mapeo",
      });
      continue;
    }

    if (seleccion.confederacion === confederacionNueva) {
      sinCambios += 1;
      resultados.push({
        id: seleccion.id,
        codigo: seleccion.codigo,
        nombre: seleccion.nombre,
        confederacionAnterior: seleccion.confederacion,
        confederacionNueva,
        estado: "sin_cambios",
      });
      continue;
    }

    await prisma.seleccion.update({
      where: { id: seleccion.id },
      data: { confederacion: confederacionNueva },
    });

    actualizadas += 1;
    resultados.push({
      id: seleccion.id,
      codigo: seleccion.codigo,
      nombre: seleccion.nombre,
      confederacionAnterior: seleccion.confederacion,
      confederacionNueva,
      estado: "actualizada",
    });
  }

  return {
    total: selecciones.length,
    actualizadas,
    sinCambios,
    sinMapeo,
    resultados,
  };
}
