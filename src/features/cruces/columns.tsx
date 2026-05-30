"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { TableAction, TableActions } from "@/components/ui/table-actions";
import { axiosInstance } from "@/lib/axios";

export type ReglaCruceRow = {
  id: string;
  nombre: string;
  partidoNumero?: number | null;
  localOrigen: string;
  visitanteOrigen: string;
  fecha?: string | Date | null;
  hora?: string | null;
  estadio?: string | null;
  fase?: {
    id?: string | number;
    nombre?: string | null;
    orden?: number | null;
  } | null;
};

type GetReglasCruceColumnsParams = {
  onDeleted?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
};

function formatFecha(fecha?: string | Date | null) {
  if (!fecha) return "-";

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-AR");
}

function formatHora(hora?: string | null) {
  const value = hora?.trim();
  return value ? value : "-";
}

export function getReglasCruceColumns({
  onDeleted,
  canEdit = true,
  canDelete = true,
}: GetReglasCruceColumnsParams): ColumnDef<ReglaCruceRow>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Partido",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-white">{row.original.nombre}</p>

          {row.original.partidoNumero ? (
            <p className="text-xs font-medium text-white/58">
              Partido Nro {row.original.partidoNumero}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "fase",
      header: "Fase",
      accessorFn: (row) => row.fase?.nombre ?? "Sin fase",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className="rounded-full border-white/10 bg-white/10 px-3 py-1 font-semibold text-[#AEEBFF]"
        >
          {row.original.fase?.nombre || "Sin fase"}
        </Badge>
      ),
    },
    {
      accessorKey: "localOrigen",
      header: "Local",
      cell: ({ row }) => (
        <span className="font-medium text-white/78">
          {row.original.localOrigen}
        </span>
      ),
    },
    {
      accessorKey: "visitanteOrigen",
      header: "Visitante",
      cell: ({ row }) => (
        <span className="font-medium text-white/78">
          {row.original.visitanteOrigen}
        </span>
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-white/72">{formatFecha(row.original.fecha)}</span>
      ),
    },
    {
      accessorKey: "hora",
      header: "Hora",
      cell: ({ row }) => (
        <span className="text-white/72">{formatHora(row.original.hora)}</span>
      ),
    },
    {
      accessorKey: "estadio",
      header: "Estadio",
      cell: ({ row }) => (
        <span className="text-white/72">{row.original.estadio || "-"}</span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => {
        const regla = row.original;
        const actions: TableAction[] = [];

        if (canEdit) {
          actions.push({
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            href: `/admin/reglas-cruces/${regla.id}/editar`,
          });
        }

        if (canDelete) {
          actions.push({
            label: "Eliminar",
            icon: <Trash2 className="h-4 w-4" />,
            confirmTitle: "Eliminar esta regla?",
            confirmDescription:
              "Esta accion eliminara permanentemente la regla de cruce. Continuar?",
            confirmActionLabel: "Eliminar",
            onConfirm: async () => {
              await axiosInstance.delete(`/reglas-cruces/${regla.id}`);
              toast.success("Regla eliminada correctamente");
              onDeleted?.();
            },
          });
        }

        if (actions.length === 0) {
          return null;
        }

        return <TableActions id={regla.id} actions={actions} />;
      },
    },
  ];
}
