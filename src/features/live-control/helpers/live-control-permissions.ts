import type { NextRequest } from "next/server";

import { requireAuth, requirePermission } from "@/lib/server-auth";

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function isAllowedLiveControlRole(roleName: string | null | undefined) {
  const normalized = normalize(roleName);
  return normalized === "dev-sup" || normalized === "dev sup";
}

function getAllowedValues(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => normalize(item))
    .filter(Boolean);
}

export async function requireLiveControlAccess(req: NextRequest) {
  const user = await requireAuth(req);

  try {
    requirePermission(user, "resultados", "editar");
  } catch {
    requirePermission(user, "resultados", "crear");
  }

  const liveControlEmails = getAllowedValues(
    process.env.LIVE_CONTROL_ALLOWED_EMAILS,
  );
  const liveControlUserIds = getAllowedValues(
    process.env.LIVE_CONTROL_ALLOWED_USER_IDS,
  );

  const hasLiveControlRole = isAllowedLiveControlRole(user.rol?.nombre);
  const matchesEmail =
    liveControlEmails.length === 0
      ? true
      : liveControlEmails.includes(normalize(user.email));
  const matchesUserId =
    liveControlUserIds.length === 0
      ? true
      : liveControlUserIds.includes(normalize(user.userId));

  if (!hasLiveControlRole || !matchesEmail || !matchesUserId) {
    throw new Error("LIVE_CONTROL_FORBIDDEN");
  }

  return user;
}
