"use client";

import { ShieldUser } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PermisosGrupo, RoleUpdate } from "../types/types";
import { RoleBasicFields } from "./RoleBasicFields";
import { RoleFormActions } from "./RoleFormActions";
import { RolePermissionsSection } from "./RolePermissionsSection";

type Props = {
  id: string;
  role: RoleUpdate | null;
  permisos: PermisosGrupo[];
  selectedPermisos: number[];
  loading: boolean;
  saving: boolean;
  nombre: string;
  descripcion: string;
  activo: boolean;
  setNombre: (value: string) => void;
  setDescripcion: (value: string) => void;
  setActivo: (value: boolean) => void;
  togglePermiso: (permisoId: number) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
};

export function EditRoleForm({
  permisos,
  selectedPermisos,
  saving,
  nombre,
  descripcion,
  activo,
  setNombre,
  setDescripcion,
  setActivo,
  togglePermiso,
  handleSave,
  handleCancel,
}: Props) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
        <CardHeader className="px-5 pb-0 pt-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <ShieldUser className="h-6 w-6 text-[#AEEBFF]" />
              Editar rol
            </CardTitle>
            <CardDescription className="text-sm text-white/68">
              Ajusta la informacion del rol y sus permisos manteniendo una configuración
              consistente dentro de la misma tematica visual del panel.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-[#1E2C46] p-5 pt-5 md:p-6 md:pt-5">
          <RoleBasicFields
            nombre={nombre}
            descripcion={descripcion}
            onNombreChange={setNombre}
            onDescripcionChange={setDescripcion}
            activo={activo}
            setActivo={setActivo}
          />

          <Separator className="bg-white/10" />

          <RolePermissionsSection
            permisos={permisos}
            selectedPermisos={selectedPermisos}
            onTogglePermiso={togglePermiso}
          />

          <RoleFormActions
            saving={saving}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
}
