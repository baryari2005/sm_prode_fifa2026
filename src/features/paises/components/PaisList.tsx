"use client";

import { useMemo, useState } from "react";

import { useCan } from "@/hooks/useCan";
import { GenericListWithTable } from "@/components/data-display/table/GenericListWithTable";
import { GenericDataTable } from "@/components/data-display/table/GenericDataTable";
import { getPaisesColumns, PaisRow } from "./columns";



interface Props {
  search?: string;
  refresh?: string | number | boolean | null | undefined;
}

type PaginatedResponse<T> = {
  data?: T[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

export function PaisList({ search = "", refresh }: Props) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const endpoint = "/paises";

  const canDelete = useCan("paises", "eliminar");
  const canEdit = useCan("paises", "editar");

  const columns = useMemo(
    () =>
      getPaisesColumns(
        () => setRefreshVersion((v) => v + 1),
        canDelete,
        canEdit
      ),
    [canDelete, canEdit]
  );

  if (process.env.NODE_ENV !== "production") {
    console.log("[PaisList] endpoint →", endpoint);
  }

  return (
    <GenericListWithTable<PaisRow>
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
        const typed = raw as PaginatedResponse<PaisRow>;

        return {
          items: typed.data ?? [],
          total: typed.meta?.total ?? 0,
          pageCount: typed.meta?.pageCount,
        };
      }}
      DataTableComponent={(props) => (
        <GenericDataTable
          {...props}
          searchPlaceholder="Buscar por nombre o código"
        />
      )}
    />
  );
}