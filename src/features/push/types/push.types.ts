export type PushSubscriptionKeys = {
  p256dh: string;
  auth: string;
};

export type PushSubscriptionInput = {
  endpoint: string;
  expirationTime?: number | null;
  keys: PushSubscriptionKeys;
};

export type SavePushSubscriptionInput = {
  userId: string;
  endpoint: string;
  scope?: string | null;
  userAgent?: string | null;
  subscription: PushSubscriptionInput;
};

export type RemovePushSubscriptionInput = {
  userId: string;
  endpoint: string;
};

export type PushNotificationPayload = {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, unknown>;
};

export type PushNotificationDeliveryResult = {
  total: number;
  sent: number;
  failed: number;
  deactivated: number;
};
