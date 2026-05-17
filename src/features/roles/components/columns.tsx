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
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.descripcion ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.activo ? "default" : "destructive"}>
          {row.original.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "permisos",
      header: "Permisos",
      cell: ({ row }) => row.original._count?.permisos ?? 0,
    },
    {
      id: "usuarios",
      header: "Usuarios",
      cell: ({ row }) => row.original._count?.usuarios ?? 0,
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
