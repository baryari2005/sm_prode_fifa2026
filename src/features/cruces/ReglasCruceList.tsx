"use client";

import { useMemo, useState } from "react";

import { useCan } from "@/hooks/useCan";
import { GenericListWithTable } from "@/components/data-display/table/GenericListWithTable";
import { GenericDataTable } from "@/components/data-display/table/GenericDataTable";

import {
  getReglasCruceColumns,
  type ReglaCruceRow,
} from "./columns";

interface Props {
  search?: string;
  refresh?: string | number | boolean | null | undefined;
}

type PaginatedResponse<T> = {
  data?: T[];
  reglas?: T[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

export function ReglasCruceList({ search = "", refresh }: Props) {
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
      DataTableComponent={(props) => (
        <GenericDataTable
          {...props}
          searchPlaceholder="Buscar por partido, fase o estadio"
        />
      )}
    />
  );
}
