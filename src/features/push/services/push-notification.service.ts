import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

import { prisma } from "@/lib/db";
import { deactivatePushSubscriptionsByEndpoints } from "@/features/push/services/push-subscription.service";
import type {
  PushNotificationDeliveryResult,
  PushNotificationPayload,
} from "@/features/push/types/push.types";

const DEFAULT_PUSH_URL = "/inicio";
const GONE_STATUSES = new Set([404, 410]);

let vapidConfigured = false;

function ensureWebPushConfigured() {
  if (vapidConfigured) {
    return;
  }

  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY?.trim();
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY?.trim();
  const subject = process.env.WEB_PUSH_SUBJECT?.trim();

  if (!publicKey || !privateKey || !subject) {
    throw new Error("WEB_PUSH_NOT_CONFIGURED");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
}

function buildWebPushPayload(payload: PushNotificationPayload) {
  return JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    image: payload.image,
    tag: payload.tag,
    requireInteraction: payload.requireInteraction,
    url: payload.url ?? DEFAULT_PUSH_URL,
    data: {
      ...(payload.data ?? {}),
      url: payload.url ?? DEFAULT_PUSH_URL,
    },
  });
}

function mapToWebPushSubscription(item: {
  endpoint: string;
  p256dh: string;
  auth: string;
}): WebPushSubscription {
  return {
    endpoint: item.endpoint,
    keys: {
      p256dh: item.p256dh,
      auth: item.auth,
    },
  };
}

async function sendToSubscriptions(
  subscriptions: Array<{
    endpoint: string;
    p256dh: string;
    auth: string;
  }>,
  payload: PushNotificationPayload,
): Promise<PushNotificationDeliveryResult> {
  if (subscriptions.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      deactivated: 0,
    };
  }

  ensureWebPushConfigured();

  const serializedPayload = buildWebPushPayload(payload);
  const staleEndpoints = new Set<string>();
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          mapToWebPushSubscription(subscription),
          serializedPayload,
        );
        sent += 1;
      } catch (error) {
        failed += 1;

        if (
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          GONE_STATUSES.has(Number(error.statusCode))
        ) {
          staleEndpoints.add(subscription.endpoint);
          return;
        }

        console.error("[PUSH_NOTIFICATION_SEND]", error);
      }
    }),
  );

  if (staleEndpoints.size > 0) {
    await deactivatePushSubscriptionsByEndpoints(Array.from(staleEndpoints));
  }

  return {
    total: subscriptions.length,
    sent,
    failed,
    deactivated: staleEndpoints.size,
  };
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: PushNotificationPayload,
) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  return sendToSubscriptions(subscriptions, payload);
}

export async function sendPushNotificationToManyUsers(
  userIds: string[],
  payload: PushNotificationPayload,
) {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      deactivated: 0,
    };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      userId: {
        in: uniqueUserIds,
      },
      isActive: true,
    },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  return sendToSubscriptions(subscriptions, payload);
}
