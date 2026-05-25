"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { FileUser, Pencil, ShieldX, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";
import { formatApiMessage } from "@/utils/formatters";
import { TableAction, TableActions } from "../../ui/table-actions";

type RowWithId = {
  id: string | number;
};

interface BuildActionsColumnOptions<T extends RowWithId> {
  component: string;
  label: string;
  onDeleted?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  showLegajo?: boolean;
  getExtraActions?: (row: T) => TableAction[];
}

export const buildActionsColumn = <T extends RowWithId>({
  component,
  label,
  onDeleted,
  canEdit = true,
  canDelete = true,
  showLegajo = false,
  getExtraActions,
}: BuildActionsColumnOptions<T>): ColumnDef<T> => ({
  id: "actions",
  header: "Acciones",
  cell: ({ row }: { row: Row<T> }) => {
    const original = row.original;
    const id = original.id;

    const actions: TableAction[] = [];

    if (canEdit) {
      actions.push({
        label: "Editar",
        icon: <Pencil className="h-4 w-4" />,
        href: `/${component}/${id}`,
      });
    }

    if (canDelete) {
      actions.push({
        label: "Eliminar",
        icon: <Trash2 className="h-4 w-4" />,
        confirmTitle: `¿Eliminar ${label}?`,
        confirmDescription: `Vas a quitar este ${label} de la gestión activa del sistema.`,
        confirmActionLabel: "Confirmar eliminación",
        confirmTone: "danger",
        confirmIcon: <ShieldX className="h-4 w-4" />,
        confirmNote:
          label === "usuario"
            ? "Esta acción afecta solo al usuario seleccionado. Si necesitás recuperarlo, requerirá una gestión posterior."
            : `Esta acción afecta solo a la ${label} seleccionada. Revisá antes de confirmar porque puede impactar datos relacionados.`,
        onConfirm: async () => {
          await axiosInstance.delete(`/${component}/${id}`);
          toast.success(
            formatApiMessage(`success.${component.slice(0, -1)}Deleted`)
          );
          onDeleted?.();
        },
      });
    }

    if (showLegajo) {
      actions.push({
        label: "Legajo",
        icon: <FileUser className="h-4 w-4" />,
        href: `/${component}/${id}/legajo`,
      });
    }

    if (getExtraActions) {
      actions.push(...getExtraActions(original));
    }

    if (actions.length === 0) {
      return null;
    }

    return <TableActions id={String(id)} actions={actions} />;
  },
});
