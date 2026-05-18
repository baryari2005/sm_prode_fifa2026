import { AciertoTipo, Prisma } from "@prisma/client";

type ScoreResult = {
  puntosOtorgados: number;
  aciertoTipo: AciertoTipo;
};

type PuntajeRegla = {
  puntosExacto: number;
  puntosParcial: number;
  puntosSinAcierto: number;
};

function getResultadoClave(golesLocal: number, golesVisitante: number) {
  if (golesLocal > golesVisitante) return "LOCAL";
  if (golesLocal < golesVisitante) return "VISITANTE";
  return "EMPATE";
}

export function calcularPuntajePronostico(input: {
  prediccionLocal: number;
  prediccionVisitante: number;
  resultadoLocal: number;
  resultadoVisitante: number;
  regla?: PuntajeRegla;
}): ScoreResult {
  const {
    prediccionLocal,
    prediccionVisitante,
    resultadoLocal,
    resultadoVisitante,
    regla,
  } = input;

  const puntosExacto = regla?.puntosExacto ?? 3;
  const puntosParcial = regla?.puntosParcial ?? 1;
  const puntosSinAcierto = regla?.puntosSinAcierto ?? 0;

  const esExacto =
    prediccionLocal === resultadoLocal &&
    prediccionVisitante === resultadoVisitante;

  if (esExacto) {
    return {
      puntosOtorgados: puntosExacto,
      aciertoTipo: AciertoTipo.EXACTO,
    };
  }

  const resultadoPronosticado = getResultadoClave(
    prediccionLocal,
    prediccionVisitante
  );
  const resultadoReal = getResultadoClave(resultadoLocal, resultadoVisitante);

  if (resultadoPronosticado === resultadoReal) {
    return {
      puntosOtorgados: puntosParcial,
      aciertoTipo: AciertoTipo.TENDENCIA,
    };
  }

  return {
    puntosOtorgados: puntosSinAcierto,
    aciertoTipo: AciertoTipo.NINGUNO,
  };
}

async function recomputarRankingUsuarios(
  tx: Prisma.TransactionClient,
  usuarioIds: string[]
) {
  const uniqueUserIds = Array.from(new Set(usuarioIds.filter(Boolean)));

  for (const usuarioId of uniqueUserIds) {
    const [predicciones, exactos, tendencias, puntos] = await Promise.all([
      tx.prediccionPartido.count({
        where: { usuarioId },
      }),
      tx.prediccionPartido.count({
        where: {
          usuarioId,
          aciertoTipo: AciertoTipo.EXACTO,
        },
      }),
      tx.prediccionPartido.count({
        where: {
          usuarioId,
          aciertoTipo: AciertoTipo.TENDENCIA,
        },
      }),
      tx.prediccionPartido.aggregate({
        where: { usuarioId },
        _sum: {
          puntosOtorgados: true,
        },
      }),
    ]);

    const calificadas = await tx.prediccionPartido.count({
      where: {
        usuarioId,
        calculadoAt: {
          not: null,
        },
      },
    });

    await tx.rankingUsuario.upsert({
      where: { usuarioId },
      create: {
        usuarioId,
        puntosTotales: puntos._sum.puntosOtorgados ?? 0,
        aciertosExactos: exactos,
        aciertosTendencia: tendencias,
        partidosPronosticados: predicciones,
        partidosCalificados: calificadas,
      },
      update: {
        puntosTotales: puntos._sum.puntosOtorgados ?? 0,
        aciertosExactos: exactos,
        aciertosTendencia: tendencias,
        partidosPronosticados: predicciones,
        partidosCalificados: calificadas,
      },
    });
  }
}

export async function recomputarRankingUsuariosPorIds(
  tx: Prisma.TransactionClient,
  usuarioIds: string[]
) {
  await recomputarRankingUsuarios(tx, usuarioIds);
}

export async function recalcularPronosticosDePartido(
  tx: Prisma.TransactionClient,
  partidoId: string
) {
  const partido = await tx.partido.findUnique({
    where: { id: partidoId },
    include: {
      fase: {
        include: {
          reglasPuntaje: true,
        },
      },
      resultado: true,
      predicciones: true,
    },
  });

  if (!partido?.resultado || partido.resultado.estado !== "FINALIZADO") {
    return {
      partidoId,
      procesadas: 0,
      usuariosActualizados: 0,
    };
  }

  const usuarioIds: string[] = [];

  for (const prediccion of partido.predicciones) {
    const score = calcularPuntajePronostico({
      prediccionLocal: prediccion.golesLocal,
      prediccionVisitante: prediccion.golesVisitante,
      resultadoLocal: partido.resultado.golesLocal,
      resultadoVisitante: partido.resultado.golesVisitante,
      regla: partido.fase?.reglasPuntaje?.[0]
        ? {
            puntosExacto: partido.fase.reglasPuntaje[0].puntosExacto,
            puntosParcial: partido.fase.reglasPuntaje[0].puntosParcial,
            puntosSinAcierto: partido.fase.reglasPuntaje[0].puntosSinAcierto,
          }
        : undefined,
    });

    await tx.prediccionPartido.update({
      where: { id: prediccion.id },
      data: {
        puntosOtorgados: score.puntosOtorgados,
        aciertoTipo: score.aciertoTipo,
        calculadoAt: new Date(),
      },
    });

    usuarioIds.push(prediccion.usuarioId);
  }

  await recomputarRankingUsuarios(tx, usuarioIds);

  return {
    partidoId,
    procesadas: partido.predicciones.length,
    usuariosActualizados: Array.from(new Set(usuarioIds)).length,
  };
}

export async function recalcularPronosticosFinalizadosEnRango(
  tx: Prisma.TransactionClient,
  input?: {
    fechaDesde?: Date;
    fechaHasta?: Date;
    soloNoCalculados?: boolean;
  }
) {
  const partidos = await tx.partido.findMany({
    where: {
      activo: true,
      ...(input?.fechaDesde || input?.fechaHasta
        ? {
            fecha: {
              ...(input?.fechaDesde ? { gte: input.fechaDesde } : {}),
              ...(input?.fechaHasta ? { lte: input.fechaHasta } : {}),
            },
          }
        : {}),
      resultado: {
        is: {
          estado: "FINALIZADO",
        },
      },
      ...(input?.soloNoCalculados
        ? {
            predicciones: {
              some: {
                calculadoAt: null,
              },
            },
          }
        : {}),
    },
    include: {
      fase: {
        include: {
          reglasPuntaje: true,
        },
      },
      resultado: true,
      predicciones: true,
    },
    orderBy: {
      fecha: "asc",
    },
  });

  const usuarioIds = new Set<string>();
  let partidosProcesados = 0;
  let prediccionesProcesadas = 0;

  for (const partido of partidos) {
    if (!partido.resultado) {
      continue;
    }

    partidosProcesados += 1;

    for (const prediccion of partido.predicciones) {
      const regla = partido.fase?.reglasPuntaje?.[0]
        ? {
            puntosExacto: partido.fase.reglasPuntaje[0].puntosExacto,
            puntosParcial: partido.fase.reglasPuntaje[0].puntosParcial,
            puntosSinAcierto: partido.fase.reglasPuntaje[0].puntosSinAcierto,
          }
        : undefined;

      const score = calcularPuntajePronostico({
        prediccionLocal: prediccion.golesLocal,
        prediccionVisitante: prediccion.golesVisitante,
        resultadoLocal: partido.resultado.golesLocal,
        resultadoVisitante: partido.resultado.golesVisitante,
        regla,
      });

      await tx.prediccionPartido.update({
        where: { id: prediccion.id },
        data: {
          puntosOtorgados: score.puntosOtorgados,
          aciertoTipo: score.aciertoTipo,
          calculadoAt: new Date(),
        },
      });

      usuarioIds.add(prediccion.usuarioId);
      prediccionesProcesadas += 1;
    }
  }

  await recomputarRankingUsuarios(tx, Array.from(usuarioIds));

  return {
    partidosProcesados,
    prediccionesProcesadas,
    usuariosActualizados: usuarioIds.size,
  };
}
