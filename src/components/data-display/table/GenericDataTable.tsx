"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  ArrowBigLeft,
  ArrowBigRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type DataTableProps<T> = {
  data: T[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onSearchChange: (q: string) => void;
  columns: ColumnDef<T, unknown>[];
  sorting: SortingState;
  onSortingChange: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  searchPlaceholder?: string;
};

export function GenericDataTable<T>({
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
    <div className="space-y-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 
                              h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#008C93]/30"
            aria-busy={loading}
          />

          {loading && (
            <RefreshCw
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-label="Buscando..."
            />
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  return (
                    <th key={h.id} className="select-none p-3 text-left">
                      {h.isPlaceholder ? null : (
                        <div className="inline-flex items-center gap-1">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  className="flex items-center p-3 text-muted-foreground"
                  colSpan={columns.length}
                >
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={columns.length}>
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-1 flex items-center justify-between text-sm">
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Badge className="rounded-full bg-blue-50 px-6 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
            Página {safePage} de {safeTotalPages}
          </Badge>

          <div className="grid w-full grid-cols-2 gap-2 lg:w-auto lg:min-w-[320px]">
            <Button
              className="h-11 w-full rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28] disabled:opacity-60"
              size="sm"
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              disabled={safePage <= 1 || loading || !hasResults}
            >
              <ArrowBigLeft className="h-4 w-4" />
              Anterior
            </Button>

            <Button
              className="h-11 w-full rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28] disabled:opacity-60"
              size="sm"
              onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
              disabled={safePage >= safeTotalPages || loading || !hasResults}
            >
              Siguiente
              <ArrowBigRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
