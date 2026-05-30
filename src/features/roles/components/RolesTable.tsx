"use client";

import { useMemo } from "react";

import { GenericListWithTable } from "@/components/data-display/table/GenericListWithTable";
import { useCan } from "@/hooks/useCan";
import { getRoleColumns } from "@/features/roles/components/columns";
import { Role, RolesListProps } from "../types/types";
import { RolesAdminDataTable } from "./RolesAdminDataTable";

type RoleResponse = {
  data?: Role[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

type RolesListResolvedPayload = {
  items: Role[];
  total: number;
  pageCount: number;
};

type RolesListComponentProps = RolesListProps & {
  onDataResolved?: (payload: RolesListResolvedPayload) => void;
};

export function RolesList({
  search = "",
  refresh,
  onDataResolved,
}: RolesListComponentProps) {
  const canEdit = useCan("roles", "editar");

  const columns = useMemo(() => getRoleColumns(canEdit), [canEdit]);

  return (
    <GenericListWithTable<Role>
      endpoint="/roles"
      columns={columns}
      externalSearch={search}
      refreshToken={`${refresh ?? ""}`}
      pageSize={10}
      paramNames={{
        search: "q",
        page: "page",
        limit: "pageSize",
        sortBy: "sortBy",
        sortDir: "sortDir",
      }}
      responseAdapter={(raw) => {
        const typed = raw as RoleResponse;

        return {
          items: typed.data ?? [],
          total: typed.meta?.total ?? 0,
          pageCount: typed.meta?.pageCount,
        };
      }}
      onDataResolved={onDataResolved}
      DataTableComponent={(props) => (
        <RolesAdminDataTable
          {...props}
          searchPlaceholder="Buscar por nombre o descripcion"
        />
      )}
    />
  );
}
