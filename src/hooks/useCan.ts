"use client";

import { EMPTY_PERMISSIONS } from "@/features/auth/constants/empty-permissions";
import { useAuth } from "@/stores/auth";
import {
  hasPermission,
} from "@/features/auth/libs/permissions";

export function useCan(modulo: string, accion: string): boolean {
  const rawPermissions = useAuth(
    (state) => state.user?.permisos ?? EMPTY_PERMISSIONS
  );

  return hasPermission(rawPermissions, modulo, accion);
}
