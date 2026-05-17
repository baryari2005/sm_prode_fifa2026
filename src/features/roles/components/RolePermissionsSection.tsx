"use client";

import { Label } from "@/components/ui/label";
import type { PermisosGrupo } from "../types/types";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Wrench } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PermissionIcon } from "./PermissionIcon";

type Props = {
  permisos: PermisosGrupo[];
  selectedPermisos: number[];
  onTogglePermiso: (permisoId: number) => void;
};

export function RolePermissionsSection({
  permisos,
  selectedPermisos,
  onTogglePermiso,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-950">
          <Wrench className="h-6 w-6" />
          Permisos
        </h2>
        <p className="text-sm text-slate-500">
          Activá o desactivá los permisos que van a componer este rol.
        </p>
      </div>

      <div className="space-y-4">
        {permisos.map((grupo) => (
          <div
            key={grupo.modulo}
            className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="relative border-b border-slate-100 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93] transition-transform duration-200 group-hover:scale-105">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <Label className="text-base font-semibold capitalize text-slate-900">
                        {grupo.modulo}
                      </Label>
                      <p className="text-sm text-slate-500">
                        Configurá los accesos disponibles para este módulo.
                      </p>
                    </div>
                  </div>
                </div>

                <Badge className="rounded-full bg-[#008C93]/10 px-3 py-1 text-sm font-semibold text-[#008C93] hover:bg-[#008C93]/10">
                  {grupo.permisos.length} permisos
                </Badge>
              </div>
            </div>

            <div className="relative grid gap-3 bg-transparent px-5 py-4">
              {grupo.permisos.map((permiso) => {
                const checked = selectedPermisos.includes(permiso.id);

                return (
                  <div
                    key={permiso.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition hover:border-slate-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                        <PermissionIcon
                          name={permiso.icono}
                          className="h-4 w-4 text-slate-600"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Label
                          htmlFor={`permiso-${permiso.id}`}
                          className="cursor-pointer text-sm font-semibold text-slate-800"
                        >
                          {permiso.accion}
                        </Label>

                        {permiso.descripcion ? (
                          <span className="text-sm text-slate-500">
                            {permiso.descripcion}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <Switch
                      id={`permiso-${permiso.id}`}
                      checked={checked}
                      onCheckedChange={() => onTogglePermiso(permiso.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
