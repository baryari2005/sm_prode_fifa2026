import { prisma } from "@/lib/db";
import { sendPushNotificationToManyUsers } from "@/features/push/services/push-notification.service";

type TargetableNotificationInput = {
  partidoId: string;
  userIds?: string[];
  body?: string;
};

type TodayMatchesNotificationInput = {
  userIds?: string[];
  body?: string;
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

function getArgentinaTodayBounds(baseDate = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(baseDate)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  const year = parts.year;
  const month = parts.month;
  const day = parts.day;

  return {
    start: new Date(`${year}-${month}-${day}T00:00:00-03:00`),
    end: new Date(`${year}-${month}-${day}T23:59:59.999-03:00`),
  };
}

function formatArgentinaMatchHour(fecha: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(fecha));
}

function buildTodayMatchesBody(
  matches: Array<{
    fecha: Date;
    seleccionLocal: { nombre: string };
    seleccionVisitante: { nombre: string };
  }>,
) {
  if (matches.length === 0) {
    return "Hoy no hay partidos programados.";
  }

  const preview = matches.slice(0, 3).map((match) => {
    const hora = formatArgentinaMatchHour(match.fecha);
    return `${match.seleccionLocal.nombre} vs ${match.seleccionVisitante.nombre} ${hora} hs`;
  });

  if (matches.length <= 3) {
    return `Partidos de hoy: ${preview.join(" | ")}`;
  }

  return `Partidos de hoy: ${preview.join(" | ")} | y ${matches.length - 3} mas.`;
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

export async function notifyPredictionClosingSoon(input: TargetableNotificationInput) {
  const partido = await prisma.partido.findUnique({
    where: {
      id: input.partidoId,
    },
    include: {
      seleccionLocal: true,
      seleccionVisitante: true,
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

  const predictedUserIds = new Set(partido.predicciones.map((item) => item.usuarioId));
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      isActive: true,
      ...(input.userIds && input.userIds.length > 0
        ? {
            userId: {
              in: input.userIds,
            },
          }
        : {}),
      user: {
        aprobado: true,
        deletedAt: null,
      },
    },
    select: {
      userId: true,
    },
  });

  const targetUserIds = Array.from(
    new Set(
      subscriptions
        .map((item) => item.userId)
        .filter((userId) => !predictedUserIds.has(userId)),
    ),
  );

  return sendPushNotificationToManyUsers(targetUserIds, {
    title: "Faltan 30 minutos para cerrar el pronostico",
    body:
      input.body?.trim() ||
      `Tenes 30 minutos para que cierre el pronostico del partido ${partido.seleccionLocal.nombre} vs ${partido.seleccionVisitante.nombre}.`,
    url: `/pronosticos?partido=${partido.id}`,
    tag: `pronostico-cierra-pronto:${partido.id}`,
    data: {
      partidoId: partido.id,
      tipo: "PRONOSTICO_RECORDA_90M",
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
    body:
      input.body?.trim() ||
      `${partido.seleccionLocal.nombre} ${marcador} ${partido.seleccionVisitante.nombre}`,
    url: `/pronosticos/partidos/${partido.id}/detalle`,
    tag: `partido-finalizado:${partido.id}`,
    data: {
      partidoId: partido.id,
      tipo: "PARTIDO_FINALIZADO",
    },
  });
}

export async function notifyTodayMatches(input: TodayMatchesNotificationInput = {}) {
  const { start, end } = getArgentinaTodayBounds();
  const matches = await prisma.partido.findMany({
    where: {
      activo: true,
      fecha: {
        gte: start,
        lte: end,
      },
    },
    include: {
      seleccionLocal: true,
      seleccionVisitante: true,
    },
    orderBy: {
      fecha: "asc",
    },
  });

  const targetUserIds = await getUsersWithActiveSubscriptions(input.userIds);
  const result = await sendPushNotificationToManyUsers(targetUserIds, {
    title: "Partidos de hoy",
    body: input.body?.trim() || buildTodayMatchesBody(matches),
    url: "/pronosticos",
    tag: `partidos-de-hoy:${start.toISOString().slice(0, 10)}`,
    data: {
      tipo: "PARTIDOS_DE_HOY",
      date: start.toISOString().slice(0, 10),
      totalMatches: matches.length,
    },
  });

  return {
    ...result,
    matches: matches.map((match) => ({
      id: match.id,
      fecha: match.fecha,
      local: match.seleccionLocal.nombre,
      visitante: match.seleccionVisitante.nombre,
    })),
  };
}
