"use client";

import { useAuth } from "@/stores/auth";
import {
  hasPermission,
} from "@/features/auth/libs/permissions";

export function useCan(modulo: string, accion: string): boolean {
  const rawPermissions = useAuth((state) => state.user?.permisos ?? []);

  return hasPermission(rawPermissions, modulo, accion);
}
