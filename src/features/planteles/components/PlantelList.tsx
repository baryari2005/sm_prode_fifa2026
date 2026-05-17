"use client";

import { useCallback, useMemo } from "react";

import { GenericListWithTable } from "@/components/data-display/table/GenericListWithTable";
import { GenericDataTable } from "@/components/data-display/table/GenericDataTable";
import { getPlantelColumns, PlantelRow } from "./plantel-columns";


type PaginatedResponse<T> = {
  data?: T[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

export function PlantelList({
  seleccionId,
  seleccionCodigo,
  seleccionNombre,
  refresh,
  onEdit,
  onDelete,
  onTotalChange,
}: {
  seleccionId: string;
  seleccionCodigo?: string | null;
  seleccionNombre: string;
  refresh?: string | number | boolean | null | undefined;
  onEdit: (player: PlantelRow) => void;
  onDelete: (playerId: string) => void;
  onTotalChange?: (total: number) => void;
}) {
  const columns = useMemo(
    () =>
      getPlantelColumns({
        teamCode: seleccionCodigo,
        teamName: seleccionNombre,
        onEdit,
        onDelete,
      }),
    [onDelete, onEdit, seleccionCodigo, seleccionNombre]
  );

  const handleDataResolved = useCallback(
    ({ total }: { total: number }) => {
      onTotalChange?.(total);
    },
    [onTotalChange]
  );

  return (
    <GenericListWithTable<PlantelRow>
      endpoint={`/paises/${seleccionId}/plantel`}
      columns={columns}
      refreshToken={refresh}
      pageSize={10}
      paramNames={{
        search: "q",
        page: "page",
        limit: "pageSize",
        sortBy: "sortBy",
        sortDir: "sortDir",
      }}
      responseAdapter={(raw: unknown) => {
        const typed = raw as PaginatedResponse<PlantelRow>;

        return {
          items: typed.data ?? [],
          total: typed.meta?.total ?? 0,
          pageCount: typed.meta?.pageCount,
        };
      }}
      onDataResolved={handleDataResolved}
      DataTableComponent={(props) => (
        <GenericDataTable
          {...props}
          searchPlaceholder="Buscar por nombre o apellido"
        />
      )}
    />
  );
}
