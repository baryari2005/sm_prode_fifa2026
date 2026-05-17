"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  activo: boolean;
  onActivoChange: (value: boolean) => void;
};

export function RoleStatusField({ activo, onActivoChange }: Props) {
  return (
    <div className="flex max-w-xl items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div>
        <Label className="text-sm font-semibold text-slate-800">Rol activo</Label>
        <p className="mt-1 text-xs text-slate-500">
          Si está inactivo no podrá asignarse a usuarios.
        </p>
      </div>

      <Switch
        checked={activo}
        onCheckedChange={onActivoChange}
      />
    </div>
  );
}
