"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Wrench } from "lucide-react";

import type { PermisosGrupo } from "../types/types";
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
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <Wrench className="h-6 w-6 text-[#AEEBFF]" />
          Permisos
        </h2>
        <p className="text-sm text-white/68">
          Activa o desactiva los permisos que van a componer este rol.
        </p>
      </div>

      <div className="space-y-4">
        {permisos.map((grupo) => (
          <div
            key={grupo.modulo}
            className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(66,86,117,0.72),rgba(36,55,84,0.72))] shadow-[0_20px_55px_rgba(2,6,23,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5993B6]/35 hover:shadow-[0_26px_60px_rgba(2,6,23,0.28)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5993B6] via-[#AEEBFF] to-[#FAB438]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(174,235,255,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="relative border-b border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF] transition-transform duration-200 group-hover:scale-105">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <Label className="text-base font-semibold capitalize text-white">
                        {grupo.modulo}
                      </Label>
                      <p className="text-sm text-white/58">
                        Configura los accesos disponibles para este modulo.
                      </p>
                    </div>
                  </div>
                </div>

                <Badge className="rounded-full border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-[#AEEBFF] hover:bg-white/10">
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
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1E2C46]/70 px-4 py-3 shadow-sm shadow-black/20 transition hover:border-[#5993B6]/35"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#425675]/65 text-[#AEEBFF]">
                        <PermissionIcon
                          name={permiso.icono}
                          modulo={grupo.modulo}
                          accion={permiso.accion}
                          className="h-4 w-4 text-[#AEEBFF]"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Label
                          htmlFor={`permiso-${permiso.id}`}
                          className="cursor-pointer text-sm font-semibold text-white"
                        >
                          {permiso.accion}
                        </Label>

                        {permiso.descripcion ? (
                          <span className="text-sm text-white/58">
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
