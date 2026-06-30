import { AciertoTipo, Prisma } from "@prisma/client";

type ScoreResult = {
  puntosOtorgados: number;
  aciertoTipo: AciertoTipo;
};

type PuntajeRegla = {
  puntosExacto: number;
  puntosParcial: number;
  puntosSinAcierto: number;
  puntosClasificadoPenales?: number;
};

function getResultadoClave(golesLocal: number, golesVisitante: number) {
  if (golesLocal > golesVisitante) return "LOCAL";
  if (golesLocal < golesVisitante) return "VISITANTE";
  return "EMPATE";
}

export function calcularPuntajePronostico(input: {
  prediccionLocal: number;
  prediccionVisitante: number;
  prediccionEquipoClasificadoId?: string | null;
  resultadoLocal: number;
  resultadoVisitante: number;
  resultadoPenalesLocal?: number | null;
  resultadoPenalesVisitante?: number | null;
  seleccionLocalId?: string | null;
  seleccionVisitanteId?: string | null;
  regla?: PuntajeRegla;
}): ScoreResult {
  const {
    prediccionLocal,
    prediccionVisitante,
    prediccionEquipoClasificadoId,
    resultadoLocal,
    resultadoVisitante,
    resultadoPenalesLocal,
    resultadoPenalesVisitante,
    seleccionLocalId,
    seleccionVisitanteId,
    regla,
  } = input;

  const puntosExacto = regla?.puntosExacto ?? 3;
  const puntosParcial = regla?.puntosParcial ?? 1;
  const puntosSinAcierto = regla?.puntosSinAcierto ?? 0;
  const puntosClasificadoPenales = regla?.puntosClasificadoPenales ?? 1;

  const esExacto =
    prediccionLocal === resultadoLocal &&
    prediccionVisitante === resultadoVisitante;
  const equipoClasificadoRealId =
    resultadoLocal === resultadoVisitante &&
    resultadoPenalesLocal !== null &&
    resultadoPenalesLocal !== undefined &&
    resultadoPenalesVisitante !== null &&
    resultadoPenalesVisitante !== undefined
      ? resultadoPenalesLocal > resultadoPenalesVisitante
        ? seleccionLocalId
        : resultadoPenalesVisitante > resultadoPenalesLocal
          ? seleccionVisitanteId
          : null
      : null;
  const puntoExtraClasificado =
    prediccionEquipoClasificadoId &&
    equipoClasificadoRealId &&
    prediccionLocal === prediccionVisitante &&
    prediccionEquipoClasificadoId === equipoClasificadoRealId
      ? puntosClasificadoPenales
      : 0;

  if (esExacto) {
    return {
      puntosOtorgados: puntosExacto + puntoExtraClasificado,
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
      puntosOtorgados: puntosParcial + puntoExtraClasificado,
      aciertoTipo: AciertoTipo.TENDENCIA,
    };
  }

  return {
    puntosOtorgados: puntosSinAcierto + puntoExtraClasificado,
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

async function recomputarRankingUsuariosPorFase(
  tx: Prisma.TransactionClient,
  usuarioIds: string[]
) {
  const uniqueUserIds = Array.from(new Set(usuarioIds.filter(Boolean)));

  for (const usuarioId of uniqueUserIds) {
    const groupedPredictions = await tx.prediccionPartido.groupBy({
      by: ["usuarioId", "aciertoTipo", "calculadoAt", "partidoId"],
      where: {
        usuarioId,
      },
    });

    const partidoIds = Array.from(
      new Set(groupedPredictions.map((item) => item.partidoId))
    );

    if (partidoIds.length === 0) {
      await tx.rankingUsuarioFase.deleteMany({
        where: { usuarioId },
      });
      continue;
    }

    const predictions = await tx.prediccionPartido.findMany({
      where: {
        usuarioId,
        partidoId: {
          in: partidoIds,
        },
      },
      include: {
        partido: {
          select: {
            faseId: true,
          },
        },
      },
    });

    const summaryByPhase = new Map<
      number,
      {
        puntosTotales: number;
        aciertosExactos: number;
        aciertosTendencia: number;
        partidosPronosticados: number;
        partidosCalificados: number;
      }
    >();

    for (const prediction of predictions) {
      const faseId = prediction.partido.faseId;
      const current = summaryByPhase.get(faseId) ?? {
        puntosTotales: 0,
        aciertosExactos: 0,
        aciertosTendencia: 0,
        partidosPronosticados: 0,
        partidosCalificados: 0,
      };

      current.puntosTotales += prediction.puntosOtorgados ?? 0;
      current.partidosPronosticados += 1;

      if (prediction.calculadoAt) {
        current.partidosCalificados += 1;
      }

      if (prediction.aciertoTipo === AciertoTipo.EXACTO) {
        current.aciertosExactos += 1;
      }

      if (prediction.aciertoTipo === AciertoTipo.TENDENCIA) {
        current.aciertosTendencia += 1;
      }

      summaryByPhase.set(faseId, current);
    }

    const activePhaseIds = Array.from(summaryByPhase.keys());

    await tx.rankingUsuarioFase.deleteMany({
      where: {
        usuarioId,
        faseId: {
          notIn: activePhaseIds,
        },
      },
    });

    for (const [faseId, summary] of summaryByPhase.entries()) {
      await tx.rankingUsuarioFase.upsert({
        where: {
          usuarioId_faseId: {
            usuarioId,
            faseId,
          },
        },
        create: {
          usuarioId,
          faseId,
          ...summary,
        },
        update: summary,
      });
    }
  }
}

export async function recomputarRankingUsuariosPorIds(
  tx: Prisma.TransactionClient,
  usuarioIds: string[]
) {
  await recomputarRankingUsuarios(tx, usuarioIds);
  await recomputarRankingUsuariosPorFase(tx, usuarioIds);
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
      prediccionEquipoClasificadoId: prediccion.equipoClasificadoId,
      resultadoLocal: partido.resultado.golesLocal,
      resultadoVisitante: partido.resultado.golesVisitante,
      resultadoPenalesLocal: partido.resultado.penalesLocal,
      resultadoPenalesVisitante: partido.resultado.penalesVisitante,
      seleccionLocalId: partido.seleccionLocalId,
      seleccionVisitanteId: partido.seleccionVisitanteId,
      regla: partido.fase?.reglasPuntaje?.[0]
        ? {
            puntosExacto: partido.fase.reglasPuntaje[0].puntosExacto,
            puntosParcial: partido.fase.reglasPuntaje[0].puntosParcial,
            puntosSinAcierto: partido.fase.reglasPuntaje[0].puntosSinAcierto,
            puntosClasificadoPenales:
              partido.fase.reglasPuntaje[0].puntosClasificadoPenales,
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
  await recomputarRankingUsuariosPorFase(tx, usuarioIds);

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
            puntosClasificadoPenales:
              partido.fase.reglasPuntaje[0].puntosClasificadoPenales,
          }
        : undefined;

      const score = calcularPuntajePronostico({
        prediccionLocal: prediccion.golesLocal,
        prediccionVisitante: prediccion.golesVisitante,
        prediccionEquipoClasificadoId: prediccion.equipoClasificadoId,
        resultadoLocal: partido.resultado.golesLocal,
        resultadoVisitante: partido.resultado.golesVisitante,
        resultadoPenalesLocal: partido.resultado.penalesLocal,
        resultadoPenalesVisitante: partido.resultado.penalesVisitante,
        seleccionLocalId: partido.seleccionLocalId,
        seleccionVisitanteId: partido.seleccionVisitanteId,
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

  const usuarioIdsList = Array.from(usuarioIds);
  await recomputarRankingUsuarios(tx, usuarioIdsList);
  await recomputarRankingUsuariosPorFase(tx, usuarioIdsList);

  return {
    partidosProcesados,
    prediccionesProcesadas,
    usuariosActualizados: usuarioIds.size,
  };
}

export async function recalcularPronosticosFinalizadosDeFase(
  tx: Prisma.TransactionClient,
  faseId: number,
) {
  const partidos = await tx.partido.findMany({
    where: {
      activo: true,
      faseId,
      resultado: {
        is: {
          estado: "FINALIZADO",
        },
      },
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
            puntosClasificadoPenales:
              partido.fase.reglasPuntaje[0].puntosClasificadoPenales,
          }
        : undefined;

      const score = calcularPuntajePronostico({
        prediccionLocal: prediccion.golesLocal,
        prediccionVisitante: prediccion.golesVisitante,
        prediccionEquipoClasificadoId: prediccion.equipoClasificadoId,
        resultadoLocal: partido.resultado.golesLocal,
        resultadoVisitante: partido.resultado.golesVisitante,
        resultadoPenalesLocal: partido.resultado.penalesLocal,
        resultadoPenalesVisitante: partido.resultado.penalesVisitante,
        seleccionLocalId: partido.seleccionLocalId,
        seleccionVisitanteId: partido.seleccionVisitanteId,
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

  const usuarioIdsList = Array.from(usuarioIds);
  await recomputarRankingUsuarios(tx, usuarioIdsList);
  await recomputarRankingUsuariosPorFase(tx, usuarioIdsList);

  return {
    partidosProcesados,
    prediccionesProcesadas,
    usuariosActualizados: usuarioIds.size,
  };
}
