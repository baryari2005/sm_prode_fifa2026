"use client";

import { ColumnDef } from "@tanstack/react-table";

import { buildActionsColumn } from "@/components/data-display/table/BuildActionsColumn";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/features/roles/types/types";

export function getRoleColumns(canEdit: boolean): ColumnDef<Role>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-semibold text-white">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripcion",
      cell: ({ row }) => (
        <span className="text-white/72">{row.original.descripcion ?? "-"}</span>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.activo
              ? "rounded-full border-emerald-300/18 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10"
              : "rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10"
          }
        >
          {row.original.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "permisos",
      header: "Permisos",
      cell: ({ row }) => (
        <span className="font-semibold text-white">
          {row.original._count?.permisos ?? 0}
        </span>
      ),
    },
    {
      id: "usuarios",
      header: "Usuarios",
      cell: ({ row }) => (
        <span className="font-semibold text-white">
          {row.original._count?.usuarios ?? 0}
        </span>
      ),
    },
    buildActionsColumn<Role>({
      component: "roles",
      label: "rol",
      canEdit,
      canDelete: false,
      showLegajo: false,
    }),
  ];
}
