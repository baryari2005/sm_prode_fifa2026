const DEV_SUP_ROLE_NAME = "dev-sup";

function normalizeRoleName(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function isDevSupRoleName(value: string | null | undefined) {
  return normalizeRoleName(value) === DEV_SUP_ROLE_NAME;
}

export function isProtectedDevSupUser(user: {
  rol?: { nombre?: string | null } | null;
}) {
  return isDevSupRoleName(user.rol?.nombre);
}

export function canManageProtectedDevSup(actor: {
  rol?: { nombre?: string | null } | null;
}) {
  return isDevSupRoleName(actor.rol?.nombre);
}

export function shouldBlockProtectedDevSupMutation(params: {
  actor: { rol?: { nombre?: string | null } | null };
  target: { rol?: { nombre?: string | null } | null };
}) {
  return (
    isProtectedDevSupUser(params.target) && !canManageProtectedDevSup(params.actor)
  );
}
