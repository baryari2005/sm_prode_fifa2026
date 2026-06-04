import { prisma } from "@/lib/db";
import { sendPushNotificationToManyUsers } from "@/features/push/services/push-notification.service";

type TargetableNotificationInput = {
  partidoId: string;
  userIds?: string[];
};

async function getUsersWithActiveSubscriptions(userIds?: string[]) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      isActive: true,
      ...(userIds && userIds.length > 0
        ? {
            userId: {
              in: userIds,
            },
          }
        : {}),
    },
    select: {
      userId: true,
    },
  });

  return Array.from(new Set(subscriptions.map((item) => item.userId)));
}

export async function notifyPredictionClosed(input: TargetableNotificationInput) {
  const partido = await prisma.partido.findUnique({
    where: {
      id: input.partidoId,
    },
    include: {
      seleccionLocal: true,
      seleccionVisitante: true,
    },
  });

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  const targetUserIds = await getUsersWithActiveSubscriptions(input.userIds);

  return sendPushNotificationToManyUsers(targetUserIds, {
    title: "Cerro el pronostico",
    body: `${partido.seleccionLocal.nombre} vs ${partido.seleccionVisitante.nombre} ya no acepta cambios.`,
    url: `/pronosticos?partido=${partido.id}`,
    tag: `pronostico-cerrado:${partido.id}`,
    data: {
      partidoId: partido.id,
      tipo: "PRONOSTICO_CERRADO",
    },
  });
}

export async function notifyMatchFinished(input: TargetableNotificationInput) {
  const partido = await prisma.partido.findUnique({
    where: {
      id: input.partidoId,
    },
    include: {
      seleccionLocal: true,
      seleccionVisitante: true,
      resultado: true,
      predicciones: {
        select: {
          usuarioId: true,
        },
      },
    },
  });

  if (!partido) {
    throw new Error("PARTIDO_NOT_FOUND");
  }

  const predictedUserIds =
    input.userIds && input.userIds.length > 0
      ? input.userIds
      : Array.from(new Set(partido.predicciones.map((item) => item.usuarioId)));

  const targetUserIds = await getUsersWithActiveSubscriptions(predictedUserIds);
  const marcador = partido.resultado
    ? `${partido.resultado.golesLocal} - ${partido.resultado.golesVisitante}`
    : "Resultado disponible";

  return sendPushNotificationToManyUsers(targetUserIds, {
    title: "Partido finalizado",
    body: `${partido.seleccionLocal.nombre} ${marcador} ${partido.seleccionVisitante.nombre}`,
    url: `/pronosticos/partidos/${partido.id}/detalle`,
    tag: `partido-finalizado:${partido.id}`,
    data: {
      partidoId: partido.id,
      tipo: "PARTIDO_FINALIZADO",
    },
  });
}
