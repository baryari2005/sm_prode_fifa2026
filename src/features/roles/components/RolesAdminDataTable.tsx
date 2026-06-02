"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowBigLeft, ArrowBigRight, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DataTableProps } from "@/components/data-display/table/GenericDataTable";
import { Badge } from "@/components/ui/badge";

export function RolesAdminDataTable<T>({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onSearchChange,
  columns,
  sorting,
  onSortingChange,
  searchPlaceholder = "Buscar...",
}: DataTableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const hasResults = data.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#AEEBFF]" />
          <Input
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 rounded-2xl border-white/10 bg-[#425675]/55 pl-12 text-sm text-white placeholder:text-white/38 focus-visible:ring-[#5993B6]/35"
            aria-busy={loading}
          />

          {loading ? (
            <RefreshCw
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/58"
              aria-label="Buscando..."
            />
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#243754]/55">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-[#314565]/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-4 py-4 text-sm font-medium text-white/68"
                  colSpan={columns.length}
                >
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Cargando roles...
                  </span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-5 text-sm font-medium text-white/68"
                  colSpan={columns.length}
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-white/10 transition-colors hover:bg-white/[0.03]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Badge className="rounded-full border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-[#AEEBFF] hover:bg-white/10">
          Página {safePage} de {safeTotalPages}
        </Badge>

        <div className="grid w-full grid-cols-2 gap-2 lg:w-auto lg:min-w-[320px]">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-2xl border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-[#AEEBFF]"
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage <= 1 || loading || !hasResults}
          >
            <ArrowBigLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-2xl border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-[#AEEBFF]"
            onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
            disabled={safePage >= safeTotalPages || loading || !hasResults}
          >
            Siguiente
            <ArrowBigRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
