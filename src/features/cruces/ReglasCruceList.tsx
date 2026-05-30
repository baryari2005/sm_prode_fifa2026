"use client";

import { useMemo, useState } from "react";

import { useCan } from "@/hooks/useCan";
import { GenericListWithTable } from "@/components/data-display/table/GenericListWithTable";

import {
  getReglasCruceColumns,
  type ReglaCruceRow,
} from "./columns";
import { ReglasCrucesDataTable } from "./ReglasCrucesDataTable";

interface Props {
  search?: string;
  refresh?: string | number | boolean | null | undefined;
  onDataResolved?: (payload: {
    items: ReglaCruceRow[];
    total: number;
    pageCount: number;
  }) => void;
}

type PaginatedResponse<T> = {
  data?: T[];
  reglas?: T[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

export function ReglasCruceList({ search = "", refresh, onDataResolved }: Props) {
  const [refreshVersion, setRefreshVersion] = useState(0);

  const endpoint = "/reglas-cruces";

  const canDelete = useCan("partidos", "eliminar");
  const canEdit = useCan("partidos", "editar");

  const columns = useMemo(
    () =>
      getReglasCruceColumns({
        onDeleted: () => setRefreshVersion((value) => value + 1),
        canDelete,
        canEdit,
      }),
    [canDelete, canEdit]
  );

  return (
    <GenericListWithTable<ReglaCruceRow>
      endpoint={endpoint}
      columns={columns}
      externalSearch={search}
      refreshToken={`${String(refresh ?? "")}-${refreshVersion}`}
      pageSize={10}
      paramNames={{
        search: "q",
        page: "page",
        limit: "pageSize",
        sortBy: "sortBy",
        sortDir: "sortDir",
      }}
      responseAdapter={(raw: unknown) => {
        if (Array.isArray(raw)) {
          return {
            items: raw as ReglaCruceRow[],
            total: raw.length,
            pageCount: 1,
          };
        }

        const typed = raw as PaginatedResponse<ReglaCruceRow>;

        const items = typed.data ?? typed.reglas ?? [];

        return {
          items,
          total: typed.meta?.total ?? items.length,
          pageCount: typed.meta?.pageCount,
        };
      }}
      onDataResolved={onDataResolved}
      DataTableComponent={(props) => (
        <ReglasCrucesDataTable
          {...props}
          searchPlaceholder="Buscar por partido, fase o estadio"
        />
      )}
    />
  );
}
