"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildActionsColumn } from "@/components/data-display/table/BuildActionsColumn";
import { PlayerJerseyAvatar } from "@/features/partidos/components/detalle/lineups/PlayerJerseyAvatar";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

export type PlantelRow = JugadorSeleccion;

const POSITION_LABELS: Record<string, string> = {
  A: "Arquero",
  D: "Defensor",
  M: "Mediocampo",
  MO: "Mediocampista Ofensivo",
  MC: "Mediocampista Central",
  MD: "Mediocampista Defensivo",
  ED: "Extremo Derecho",
  EI: "Extremo Izquierdo",
  LI: "Lateral Izquierdo",
  LD: "Lateral Derecho",
  DC: "Central",
  FC: "Delantero Central",
  F: "Delantero",
};

function SortHeader({
  label,
  column,
}: {
  label: string;
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto rounded-none p-0 font-semibold hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function getPlantelColumns({
  teamCode,
  teamName,
  onEdit,
  onDelete,
}: {
  teamCode?: string | null;
  teamName: string;
  onEdit: (player: PlantelRow) => void;
  onDelete: (playerId: string) => void;
}): ColumnDef<PlantelRow>[] {
  return [
    {
      accessorKey: "nombre",
      header: ({ column }) => <SortHeader label="Jugador" column={column} />,
      enableSorting: true,
      cell: ({ row }) => {
        const player = row.original;

        return (
          <div className="flex min-w-[260px] items-center gap-3">
            <PlayerJerseyAvatar
              imageUrl={player.fotoUrl}
              teamCode={teamCode}
              teamName={teamName || player.nombre}
              number={player.numero}
              className="h-11 w-11 rounded-2xl"
            />

            <div className="min-w-0">
              <div className="font-semibold text-slate-950">{player.nombre}</div>
              <div className="text-sm text-slate-500">
                #{player.numero ?? "-"}
                {player.nacionalidad ? ` - ${player.nacionalidad}` : ""}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "posicion",
      header: ({ column }) => <SortHeader label="Posición" column={column} />,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            {row.original.posicion}
          </span>
          <p className="text-xs text-slate-500">
            {POSITION_LABELS[row.original.posicion] ?? "Sin definir"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "edad",
      header: ({ column }) => <SortHeader label="Edad" column={column} />,
      enableSorting: true,
      cell: ({ row }) => row.original.edad ?? "-",
    },
    {
      accessorKey: "estatura",
      header: ({ column }) => <SortHeader label="Est" column={column} />,
      enableSorting: true,
      cell: ({ row }) => row.original.estatura ?? "-",
    },
    {
      accessorKey: "peso",
      header: ({ column }) => <SortHeader label="Peso" column={column} />,
      enableSorting: true,
      cell: ({ row }) => row.original.peso ?? "-",
    },
    {
      accessorKey: "goles",
      header: ({ column }) => <SortHeader label="Goles" column={column} />,
      enableSorting: true,
    },
    {
      accessorKey: "apariciones",
      header: ({ column }) => <SortHeader label="AP" column={column} />,
      enableSorting: true,
    },
    {
      accessorKey: "amarillas",
      header: ({ column }) => <SortHeader label="TA" column={column} />,
      enableSorting: true,
    },
    {
      accessorKey: "rojas",
      header: ({ column }) => <SortHeader label="TR" column={column} />,
      enableSorting: true,
    },
    {
      accessorKey: "golesConcedidos",
      header: ({ column }) => <SortHeader label="GA" column={column} />,
      enableSorting: true,
      cell: ({ row }) =>
        row.original.posicion === "A"
          ? row.original.golesConcedidos ?? 0
          : "-",
    },
    buildActionsColumn<PlantelRow>({
      component: "admin/planteles",
      label: "jugador",
      canDelete: false,
      canEdit: false,
      showLegajo: false,
      getExtraActions: (row) => [
        {
          label: "Editar",
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => onEdit(row),
        },
        {
          label: "Eliminar",
          icon: <Trash2 className="h-4 w-4" />,
          confirmTitle: "Eliminar este jugador?",
          confirmDescription:
            "Esta accion eliminara permanentemente el jugador. Continuar?",
          confirmActionLabel: "Eliminar",
          onConfirm: async () => {
            onDelete(row.id);
          },
        },
      ],
    }),
  ];
}
