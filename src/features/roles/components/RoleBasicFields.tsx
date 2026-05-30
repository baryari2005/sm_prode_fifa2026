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
          <Label className="text-sm font-semibold text-white">Nombre</Label>

          <p className="text-xs text-white/58">
            ID unico del rol dentro del sistema.
          </p>
        </div>

        <Input
          value={nombre}
          className="h-11 rounded-2xl border-white/10 bg-[#425675]/55 pr-10 text-white placeholder:text-white/35"
          onChange={(e) => onNombreChange(e.target.value)}
        />
      </div>

      <div className="flex h-full flex-col">
        <div className="min-h-[48px] space-y-1">
          <Label className="text-sm font-semibold text-white">Descripcion</Label>

          <p className="text-xs text-white/58">
            Detalle opcional para identificar el rol.
          </p>
        </div>

        <Input
          value={descripcion}
          className="h-11 rounded-2xl border-white/10 bg-[#425675]/55 pr-10 text-white placeholder:text-white/35"
          onChange={(e) => onDescripcionChange(e.target.value)}
          placeholder="Descripcion opcional del rol"
        />
      </div>

      <div className="flex h-full flex-col justify-end">
        <RoleStatusField activo={activo} onActivoChange={setActivo} />
      </div>
    </div>
  );
}
