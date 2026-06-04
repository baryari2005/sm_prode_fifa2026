import { prisma } from "@/lib/db";
import type {
  RemovePushSubscriptionInput,
  SavePushSubscriptionInput,
} from "@/features/push/types/push.types";

export async function savePushSubscription(input: SavePushSubscriptionInput) {
  return prisma.pushSubscription.upsert({
    where: {
      endpoint: input.endpoint,
    },
    update: {
      userId: input.userId,
      p256dh: input.subscription.keys.p256dh,
      auth: input.subscription.keys.auth,
      userAgent: input.userAgent ?? null,
      scope: input.scope ?? null,
      isActive: true,
    },
    create: {
      userId: input.userId,
      endpoint: input.endpoint,
      p256dh: input.subscription.keys.p256dh,
      auth: input.subscription.keys.auth,
      userAgent: input.userAgent ?? null,
      scope: input.scope ?? null,
      isActive: true,
    },
  });
}

export async function deactivatePushSubscription(
  input: RemovePushSubscriptionInput,
) {
  await prisma.pushSubscription.updateMany({
    where: {
      userId: input.userId,
      endpoint: input.endpoint,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

export async function deactivatePushSubscriptionsByEndpoints(
  endpoints: string[],
) {
  const uniqueEndpoints = Array.from(
    new Set(endpoints.map((endpoint) => endpoint.trim()).filter(Boolean)),
  );

  if (uniqueEndpoints.length === 0) {
    return;
  }

  await prisma.pushSubscription.updateMany({
    where: {
      endpoint: {
        in: uniqueEndpoints,
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}
