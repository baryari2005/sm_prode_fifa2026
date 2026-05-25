"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { buildActionsColumn } from "@/components/data-display/table/BuildActionsColumn";

export type PaisRow = {
  id: string | number;
  nombre: string;
  codigo: string;
  footballDataTeamId?: number | null;
  grupo?: string | null;
  confederacion?: string | null;
  bandera?: string | null;
  activo: boolean;
};

export const getPaisesColumns = (
  onDeleted?: () => void,
  canDelete?: boolean,
  canEdit?: boolean
): ColumnDef<PaisRow>[] => [
  {
    accessorKey: "bandera",
    header: "Bandera",
    cell: ({ row }) => {
      return (
        <FlagImage
          bandera={row.original.bandera}
          codigo={row.original.codigo}
          nombre={row.original.nombre}
          widthClassName="w-12"
          heightClassName="h-8"
          fallbackMode="emoji"
          fallbackTextClassName="text-xl"
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto rounded-none p-0 font-semibold hover:bg-transparent"
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => <span className="font-medium">{row.original.nombre}</span>,
  },
  {
    accessorKey: "codigo",
    header: "Codigo",
    enableSorting: true,
    cell: ({ row }) => <span className="uppercase">{row.original.codigo}</span>,
  },
  {
    accessorKey: "footballDataTeamId",
    header: "TeamId API",
    enableSorting: true,
    cell: ({ row }) => (
      <span>{row.original.footballDataTeamId ?? "-"}</span>
    ),
  },
  {
    accessorKey: "grupo",
    header: "Grupo",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.grupo ? (
        <Badge variant="secondary">{`Grupo ${row.original.grupo}`}</Badge>
      ) : (
        <span className="italic text-muted-foreground">-</span>
      ),
  },
  {
    accessorKey: "confederacion",
    header: "Confederacion",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.confederacion ? (
        <span>{row.original.confederacion}</span>
      ) : (
        <span className="italic text-muted-foreground">-</span>
      ),
  },
  {
    accessorKey: "activo",
    header: "Estado",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge variant={row.original.activo ? "default" : "destructive"}>
        {row.original.activo ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  buildActionsColumn<PaisRow>({
    component: "admin/paises",
    label: "seleccion",
    onDeleted,
    canDelete,
    canEdit,
    showLegajo: false,
    getExtraActions: (row) => [
      {
        label: "Plantel",
        icon: <Users className="h-4 w-4" />,
        href: `/admin/paises/${row.id}/plantel`,
      },
    ],
  }),
];
