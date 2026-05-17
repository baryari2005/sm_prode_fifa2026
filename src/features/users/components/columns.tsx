// src/features/users/components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildActionsColumn } from "@/components/data-display/table/BuildActionsColumn";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { UserRow } from "../types/types";
import { TableAction } from "@/components/ui/table-actions";

export const getUserColumns = (
  onDeleted?: () => void,
  canDelete?: boolean,
  canEdit?: boolean
): ColumnDef<UserRow>[] => [
  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const display =
        [row.original.nombre, row.original.apellido].filter(Boolean).join(" ") ||
        row.original.userId;

      const initials = display.slice(0, 2).toUpperCase();
      const imageUrl = row.original.avatarUrl ?? undefined;

      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={imageUrl} alt={display} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "userId",
    header: "Usuario",
    enableSorting: true,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.nombre ?? (
        <span className="italic text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.apellido ?? (
        <span className="italic text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const isApproved = row.original.aprobado ?? true;

      return (
        <Badge variant={isApproved ? "default" : "destructive"}>
          {isApproved ? "Aprobado" : "Pendiente"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "rol",
    header: "Rol",
    cell: ({ row }) =>
      row.original.rol?.nombre ?? (
        <span className="italic text-muted-foreground">Sin rol</span>
      ),
    enableSorting: false,
  },
  buildActionsColumn({
    component: "users",
    label: "usuario",
    onDeleted,
    canDelete,
    canEdit,
    getExtraActions: (row: UserRow) => {
      const extraActions: TableAction[] = [];
      const isApproved = row.aprobado ?? true;

      if (!isApproved) {
        extraActions.push({
          label: "Aprobar",
          icon: <CheckCircle className="h-4 w-4" />,
          confirmTitle: "¿Aprobar usuario?",
          confirmDescription:
            "El usuario podrá acceder al sistema una vez aprobado.",
          confirmActionLabel: "Aprobar",
          onConfirm: async () => {
            await axiosInstance.patch(`/users/${row.id}`, {
              aprobado: true,
            });

            toast.success("Usuario aprobado correctamente");
            onDeleted?.();
          },
        });
      }

      return extraActions;
    },
  }),
];