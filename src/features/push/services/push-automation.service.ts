import { EstadoPartido, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  notifyMatchFinished,
  notifyPredictionClosingSoon,
} from "@/features/push/services/push-notification-examples.service";

const AUTO_NOTIFY_REMINDER_ACTION = "auto_notify_prediction_closing_soon";
const AUTO_NOTIFY_FINISHED_ACTION = "auto_notify_match_finished";
const PREDICTION_REMINDER_MINUTES_BEFORE = 90;

type DispatchAutomaticPushOptions = {
  finalLookbackMinutes?: number;
  reminderToleranceMinutes?: number;
};

type AutomaticPushDispatchSummary = {
  reminder: {
    scannedMatches: number;
    notifiedMatches: number;
    totalSubscriptionsTargeted: number;
  };
  finished: {
    scannedMatches: number;
    notifiedMatches: number;
    totalSubscriptionsTargeted: number;
  };
  warnings: string[];
  executedAt: string;
};

function getAutomationAuditUserId() {
  const raw = process.env.PUSH_AUTOMATION_USER_ID ?? process.env.PUSH_SYSTEM_USER_ID;
  return raw?.trim() || null;
}

async function listAlreadyAuditedMatchIds(action: string, matchIds: string[]) {
  if (matchIds.length === 0) {
    return new Set<string>();
  }

  const logs = await prisma.partidoLiveAudit.findMany({
    where: {
      accion: action,
      partidoId: {
        in: matchIds,
      },
    },
    select: {
      partidoId: true,
    },
  });

  return new Set(logs.map((item) => item.partidoId));
}

async function createAutomationAuditLog(params: {
  action: string;
  partidoId: string;
  userId: string;
  result: { total: number; sent: number; failed: number; deactivated: number };
}) {
  await prisma.partidoLiveAudit.create({
    data: {
      partidoId: params.partidoId,
      userId: params.userId,
      accion: params.action,
      valorNuevo: {
        source: "push-automation",
        total: params.result.total,
        sent: params.result.sent,
        failed: params.result.failed,
        deactivated: params.result.deactivated,
        sentAt: new Date().toISOString(),
      } as Prisma.InputJsonValue,
    },
  });
}

export async function dispatchAutomaticPushNotifications(
  options: DispatchAutomaticPushOptions = {},
): Promise<AutomaticPushDispatchSummary> {
  const now = new Date();
  const reminderToleranceMinutes = Math.max(1, options.reminderToleranceMinutes ?? 5);
  const finalLookbackMinutes = Math.max(1, options.finalLookbackMinutes ?? 15);
  const auditUserId = getAutomationAuditUserId();
  const warnings: string[] = [];

  if (!auditUserId) {
    warnings.push(
      "PUSH_AUTOMATION_USER_ID no esta configurado. El cron funciona, pero no registra auditoria para evitar duplicados ante reintentos manuales.",
    );
  }

  const reminderStart = new Date(
    now.getTime() + (PREDICTION_REMINDER_MINUTES_BEFORE - reminderToleranceMinutes) * 60_000,
  );
  const reminderEnd = new Date(
    now.getTime() + (PREDICTION_REMINDER_MINUTES_BEFORE + reminderToleranceMinutes) * 60_000,
  );
  const finishedStart = new Date(now.getTime() - finalLookbackMinutes * 60_000);

  const [closingSoonMatches, recentlyFinishedMatches] = await Promise.all([
    prisma.partido.findMany({
      where: {
        activo: true,
        fecha: {
          gte: reminderStart,
          lte: reminderEnd,
        },
        OR: [
          {
            resultado: {
              is: null,
            },
          },
          {
            resultado: {
              is: {
                estado: EstadoPartido.PENDIENTE,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    }),
    prisma.partido.findMany({
      where: {
        activo: true,
        resultado: {
          is: {
            estado: EstadoPartido.FINALIZADO,
            updatedAt: {
              gte: finishedStart,
            },
          },
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  const reminderMatchIds = closingSoonMatches.map((match) => match.id);
  const finishedMatchIds = recentlyFinishedMatches.map((match) => match.id);

  const [reminderAlreadySent, finishedAlreadySent] = await Promise.all([
    listAlreadyAuditedMatchIds(AUTO_NOTIFY_REMINDER_ACTION, reminderMatchIds),
    listAlreadyAuditedMatchIds(AUTO_NOTIFY_FINISHED_ACTION, finishedMatchIds),
  ]);

  const summary: AutomaticPushDispatchSummary = {
    reminder: {
      scannedMatches: reminderMatchIds.length,
      notifiedMatches: 0,
      totalSubscriptionsTargeted: 0,
    },
    finished: {
      scannedMatches: finishedMatchIds.length,
      notifiedMatches: 0,
      totalSubscriptionsTargeted: 0,
    },
    warnings,
    executedAt: new Date().toISOString(),
  };

  for (const matchId of reminderMatchIds) {
    if (reminderAlreadySent.has(matchId)) {
      continue;
    }

    const result = await notifyPredictionClosingSoon({
      partidoId: matchId,
    });

    if (result.total > 0) {
      summary.reminder.notifiedMatches += 1;
      summary.reminder.totalSubscriptionsTargeted += result.total;
    }

    if (auditUserId) {
      await createAutomationAuditLog({
        action: AUTO_NOTIFY_REMINDER_ACTION,
        partidoId: matchId,
        userId: auditUserId,
        result,
      });
    }
  }

  for (const matchId of finishedMatchIds) {
    if (finishedAlreadySent.has(matchId)) {
      continue;
    }

    const result = await notifyMatchFinished({
      partidoId: matchId,
    });

    if (result.total > 0) {
      summary.finished.notifiedMatches += 1;
      summary.finished.totalSubscriptionsTargeted += result.total;
    }

    if (auditUserId) {
      await createAutomationAuditLog({
        action: AUTO_NOTIFY_FINISHED_ACTION,
        partidoId: matchId,
        userId: auditUserId,
        result,
      });
    }
  }

  return summary;
}
