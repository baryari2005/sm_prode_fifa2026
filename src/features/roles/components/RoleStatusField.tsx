"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  activo: boolean;
  onActivoChange: (value: boolean) => void;
};

export function RoleStatusField({ activo, onActivoChange }: Props) {
  return (
    <div className="flex max-w-xl items-center justify-between rounded-2xl border border-white/10 bg-[#425675]/55 p-4">
      <div>
        <Label className="text-sm font-semibold text-white">Rol activo</Label>
        <p className="mt-1 text-xs text-white/58">
          Si esta inactivo no podra asignarse a usuarios.
        </p>
      </div>

      <Switch checked={activo} onCheckedChange={onActivoChange} />
    </div>
  );
}
