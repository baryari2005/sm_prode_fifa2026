"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PermisosGrupo, RoleUpdate } from "../types/types";
import { RoleBasicFields } from "./RoleBasicFields";
import { RolePermissionsSection } from "./RolePermissionsSection";
import { RoleFormActions } from "./RoleFormActions";
import { ShieldUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <ShieldUser className="h-6 w-6" />
              Editar rol
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Ajustá la información del rol y sus permisos manteniendo una configuración consistente.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-5 md:p-6">
          <RoleBasicFields
            nombre={nombre}
            descripcion={descripcion}
            onNombreChange={setNombre}
            onDescripcionChange={setDescripcion}
            activo={activo}
            setActivo={setActivo}
          />        

          <Separator />

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
