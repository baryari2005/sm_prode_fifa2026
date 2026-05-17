"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleStatusField } from "./RoleStatusField";

type Props = {
  nombre: string;
  descripcion: string;
  activo: boolean;
  onNombreChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  setActivo: (value: boolean) => void;
};

export function RoleBasicFields({
  nombre,
  descripcion,
  activo,
  onNombreChange,
  onDescripcionChange,
  setActivo,
}: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
      <div className="flex h-full flex-col">
        <div className="min-h-[48px] space-y-1">
          <Label className="text-sm font-semibold text-slate-700">
            Nombre
          </Label>

          <p className="text-xs text-slate-500">
            ID único del rol dentro del sistema.
          </p>
        </div>

        <Input
          value={nombre}
          className="h-11 rounded-2xl border-slate-200 pr-10"
          onChange={(e) => onNombreChange(e.target.value)}
        />
      </div>

      <div className="flex h-full flex-col">
        <div className="min-h-[48px] space-y-1">
          <Label className="text-sm font-semibold text-slate-700">
            Descripción
          </Label>

          <p className="text-xs text-slate-500">
            Detalle opcional para identificar el rol.
          </p>
        </div>

        <Input
          value={descripcion}
          className="h-11 rounded-2xl border-slate-200 pr-10"
          onChange={(e) => onDescripcionChange(e.target.value)}
          placeholder="Descripción opcional del rol"
        />
      </div>

      <div className="flex h-full flex-col justify-end">
        <RoleStatusField
          activo={activo}
          onActivoChange={setActivo}
        />
      </div>
    </div>
  );
}
