import { EstadoPartido } from "@prisma/client";
import { z } from "zod";

export const lineupPlayerSchema = z.object({
  jugadorId: z.string().uuid(),
  nombre: z.string().min(1),
  numero: z.number().int().min(0).nullable(),
  posicion: z.string().min(1),
  x: z.number().min(0).max(100).nullable(),
  y: z.number().min(0).max(100).nullable(),
  goals: z.number().int().min(0).default(0),
  yellow: z.boolean().default(false),
  red: z.boolean().default(false),
  substituted: z.boolean().default(false),
});

export const goalDetailSchema = z.object({
  jugadorId: z.string().uuid(),
  nombre: z.string().min(1),
  minuto: z.number().int().min(0).max(130),
  penal: z.boolean().default(false),
  autogol: z.boolean().optional(),
});

export const matchIncidentSchema = z.object({
  id: z.string().min(1),
  tipo: z.enum([
    "gol",
    "tarjeta_amarilla",
    "tarjeta_roja",
    "cambio",
    "lesion",
    "penal",
    "var",
  ]),
  minuto: z.number().int().min(0).max(130),
  equipo: z.enum(["local", "visitante", "general"]),
  jugadorId: z.string().uuid().nullable().optional(),
  jugadorNombre: z.string().nullable().optional(),
  asistidorId: z.string().uuid().nullable().optional(),
  asistidorNombre: z.string().nullable().optional(),
  jugadorSaleId: z.string().uuid().nullable().optional(),
  jugadorSaleNombre: z.string().nullable().optional(),
  jugadorEntraId: z.string().uuid().nullable().optional(),
  jugadorEntraNombre: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  penal: z.boolean().optional(),
  autogol: z.boolean().optional(),
  varResultado: z.string().nullable().optional(),
  lesionTipo: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const teamStatsSchema = z.object({
  shots: z.number().int().min(0).default(0),
  shotsOnTarget: z.number().int().min(0).default(0),
  possession: z.number().int().min(0).max(100).default(0),
  passes: z.number().int().min(0).default(0),
  passAccuracy: z.number().int().min(0).max(100).default(0),
  fouls: z.number().int().min(0).default(0),
  yellowCards: z.number().int().min(0).default(0),
  redCards: z.number().int().min(0).default(0),
  offsides: z.number().int().min(0).default(0),
  corners: z.number().int().min(0).default(0),
});

export const teamLineupSchema = z.object({
  formacion: z.string().default(""),
  entrenador: z.string().default(""),
  titulares: z.array(lineupPlayerSchema).default([]),
  suplentes: z.array(lineupPlayerSchema).default([]),
});

export const resultadoCreateSchema = z.object({
  partidoId: z.string().uuid(),
  golesLocal: z.number().int().min(0).default(0),
  golesVisitante: z.number().int().min(0).default(0),
  penalesLocal: z.number().int().min(0).nullable().optional(),
  penalesVisitante: z.number().int().min(0).nullable().optional(),
  estado: z.nativeEnum(EstadoPartido).default(EstadoPartido.PENDIENTE),
  tiempoJuego: z.number().int().min(0).max(120).nullable().optional(),
  observaciones: z.string().nullable().optional(),
  estadisticasLocal: teamStatsSchema.optional(),
  estadisticasVisitante: teamStatsSchema.optional(),
  alineacionLocal: teamLineupSchema.optional(),
  alineacionVisitante: teamLineupSchema.optional(),
  detalleGolesLocal: z.array(goalDetailSchema).optional(),
  detalleGolesVisitante: z.array(goalDetailSchema).optional(),
  incidencias: z.array(matchIncidentSchema).optional(),
});

export const resultadoUpdateSchema = z.object({
  golesLocal: z.number().int().min(0).optional(),
  golesVisitante: z.number().int().min(0).optional(),
  penalesLocal: z.number().int().min(0).nullable().optional(),
  penalesVisitante: z.number().int().min(0).nullable().optional(),
  estado: z.nativeEnum(EstadoPartido).optional(),
  tiempoJuego: z.number().int().min(0).max(120).nullable().optional(),
  observaciones: z.string().nullable().optional(),
  estadisticasLocal: teamStatsSchema.nullable().optional(),
  estadisticasVisitante: teamStatsSchema.nullable().optional(),
  alineacionLocal: teamLineupSchema.nullable().optional(),
  alineacionVisitante: teamLineupSchema.nullable().optional(),
  detalleGolesLocal: z.array(goalDetailSchema).nullable().optional(),
  detalleGolesVisitante: z.array(goalDetailSchema).nullable().optional(),
  incidencias: z.array(matchIncidentSchema).nullable().optional(),
});
