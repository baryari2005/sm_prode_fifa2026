import { prisma } from "@/lib/db";
import { EstadoPartido } from "@prisma/client";

export type HelpScoreRuleSummary = {
  puntosExacto: number;
  puntosParcial: number;
  puntosSinAcierto: number;
  puntosClasificadoPenales: number;
  faseNombre: string | null;
  usaMultiplesReglas: boolean;
};

const FALLBACK_SCORE_RULE: HelpScoreRuleSummary = {
  puntosExacto: 3,
  puntosParcial: 1,
  puntosSinAcierto: 0,
  puntosClasificadoPenales: 1,
  faseNombre: null,
  usaMultiplesReglas: false,
};

export async function getHelpScoreRuleSummary(): Promise<HelpScoreRuleSummary> {
  const now = new Date();

  try {
    const [reglas, partidoEnJuego, proximoPartido, ultimoPartido] = await Promise.all([
      prisma.reglaPuntaje.findMany({
        where: { activo: true },
        include: {
          fase: {
            select: {
              id: true,
              nombre: true,
              orden: true,
            },
          },
        },
        orderBy: {
          fase: {
            orden: "asc",
          },
        },
      }),
      prisma.partido.findFirst({
        where: {
          resultado: {
            estado: EstadoPartido.EN_JUEGO,
          },
        },
        select: {
          faseId: true,
        },
        orderBy: {
          fecha: "asc",
        },
      }),
      prisma.partido.findFirst({
        where: {
          fecha: {
            gte: now,
          },
        },
        select: {
          faseId: true,
        },
        orderBy: {
          fecha: "asc",
        },
      }),
      prisma.partido.findFirst({
        where: {
          fecha: {
            lt: now,
          },
        },
        select: {
          faseId: true,
        },
        orderBy: {
          fecha: "desc",
        },
      }),
    ]);

    if (!reglas.length) {
      return FALLBACK_SCORE_RULE;
    }

    const faseActualId =
      partidoEnJuego?.faseId ?? proximoPartido?.faseId ?? ultimoPartido?.faseId ?? null;

    const reglaActual =
      reglas.find((regla) => regla.faseId === faseActualId) ?? reglas[0];

    const combinaciones = new Set(
      reglas.map(
        (regla) =>
          `${regla.puntosExacto}-${regla.puntosParcial}-${regla.puntosSinAcierto}-${regla.puntosClasificadoPenales}`
      )
    );

    return {
      puntosExacto: reglaActual.puntosExacto,
      puntosParcial: reglaActual.puntosParcial,
      puntosSinAcierto: reglaActual.puntosSinAcierto,
      puntosClasificadoPenales: reglaActual.puntosClasificadoPenales,
      faseNombre: reglaActual.fase?.nombre ?? null,
      usaMultiplesReglas: combinaciones.size > 1,
    };
  } catch (error) {
    console.error("getHelpScoreRuleSummary error:", error);
    return FALLBACK_SCORE_RULE;
  }
}
