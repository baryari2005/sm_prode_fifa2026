"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowBigLeft,
  ArrowBigRight,
  CheckCircle,
  Pencil,
  RefreshCw,
  ShieldX,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  GenericListWithTable,
  type DataTableProps,
} from "@/components/data-display/table/GenericListWithTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableActions, type TableAction } from "@/components/ui/table-actions";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import { formatApiMessage } from "@/utils/formatters";
import { DASHBOARD_SUBCARD } from "@/features/dashboard/components/home/dashboard-home.styles";
import { UserRow } from "../types/types";

type UsersAdminCardsProps = {
  refresh?: string | number | boolean | null | undefined;
  onDataResolved?: (payload: {
    items: UserRow[];
    total: number;
    pageCount: number;
  }) => void;
  onMutate?: () => void;
};

type PaginatedResponse<T> = {
  data?: T[];
  meta?: {
    total?: number;
    pageCount?: number;
  };
};

type UsersAdminCardsRendererProps = DataTableProps<UserRow> & {
  onRefresh: () => void;
};

const EMPTY_USER_COLUMNS: ColumnDef<UserRow, unknown>[] = [];

function UsersAdminCardsRenderer({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onSearchChange,
  onRefresh,
}: UsersAdminCardsRendererProps) {
  const canDelete = useCan("usuarios", "eliminar");
  const canEdit = useCan("usuarios", "editar");

  function buildDisplayName(user: UserRow) {
    return [user.nombre, user.apellido].filter(Boolean).join(" ") || user.userId;
  }

  function buildInitials(user: UserRow) {
    return buildDisplayName(user).slice(0, 2).toUpperCase();
  }

  function buildActions(user: UserRow) {
    const actions: TableAction[] = [];

    if (canEdit) {
      actions.push({
        label: "Editar",
        icon: <Pencil className="h-4 w-4" />,
        href: `/users/${user.id}`,
      });
    }

    if ((user.aprobado ?? true) === false && canEdit) {
      actions.push({
        label: "Aprobar",
        icon: <CheckCircle className="h-4 w-4" />,
        confirmTitle: "Aprobar usuario",
        confirmDescription:
          "El usuario podra acceder al sistema una vez aprobado.",
        confirmActionLabel: "Aprobar",
        onConfirm: async () => {
          await axiosInstance.patch(`/users/${user.id}`, {
            aprobado: true,
          });

          toast.success("Usuario aprobado correctamente");
          onRefresh();
        },
      });
    }

    if (canDelete) {
      actions.push({
        label: "Eliminar",
        icon: <Trash2 className="h-4 w-4" />,
        confirmTitle: "Eliminar usuario",
        confirmDescription:
          "Vas a quitar este usuario de la gestión activa del sistema.",
        confirmActionLabel: "Confirmar eliminacion",
        confirmTone: "danger",
        confirmIcon: <ShieldX className="h-4 w-4" />,
        confirmNote:
          "Esta accion afecta solo al usuario seleccionado. Si necesitas recuperarlo, requerira una gestión posterior.",
        onConfirm: async () => {
          await axiosInstance.delete(`/users/${user.id}`);
          toast.success(formatApiMessage("success.userDeleted"));
          onRefresh();
        },
      });
    }

    return actions;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const hasResults = data.length > 0;

  return (
    <div className="space-y-5">
      <div className="relative">
        <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#AEEBFF]" />
        <Input
          placeholder="Buscar por nombre, usuario o email"
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 rounded-2xl border-white/10 bg-white/8 pl-12 text-white placeholder:text-white/38"
          aria-busy={loading}
        />

        {loading ? (
          <RefreshCw className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/58" />
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`user-card-skeleton-${index}`}
              className={`animate-pulse rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
            >
              <div className="h-28 rounded-2xl bg-white/8" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className={`rounded-[24px] p-6 xl:col-span-2 ${DASHBOARD_SUBCARD}`}>
            <p className="font-brand text-[1.6rem] leading-none tracking-[0.04em] text-white">
              Sin usuarios para mostrar
            </p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Ajusta la busqueda o carga un nuevo usuario desde la accion principal.
            </p>
          </div>
        ) : (
          data.map((user) => {
            const displayName = buildDisplayName(user);
            const isApproved = user.aprobado ?? true;
            const actions = buildActions(user);

            return (
              <article
                key={user.id}
                className={`rounded-[24px] border border-white/10 p-4 ${DASHBOARD_SUBCARD}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 rounded-[20px] border border-white/10">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt={displayName} />
                        <AvatarFallback className="rounded-[20px] bg-[#5993B6]/18 font-brand text-[1.2rem] tracking-[0.04em] text-[#AEEBFF]">
                          {buildInitials(user)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-brand text-[1.7rem] leading-none tracking-[0.04em] text-white">
                            {displayName}
                          </h3>
                          <Badge className="rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10">
                            {user.rol?.nombre ?? "Sin rol"}
                          </Badge>
                          <Badge
                            className={
                              isApproved
                                ? "rounded-full border-emerald-300/18 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10"
                                : "rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10"
                            }
                          >
                            {isApproved ? "Aprobado" : "Pendiente"}
                          </Badge>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-white/68">
                          @{user.userId}
                        </p>
                        <p className="truncate text-sm font-semibold text-white/68">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-[#425675]/55 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Estado
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {isApproved ? "Puede ingresar al sistema" : "Espera aprobación"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#425675]/55 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Rol actual
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {user.rol?.nombre ?? "Sin rol asignado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    {actions.length > 0 ? (
                      <TableActions
                        id={String(user.id)}
                        actions={actions}
                        theme="users-brand"
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })
        )}
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

export function UsersAdminCards({
  refresh,
  onDataResolved,
  onMutate,
}: UsersAdminCardsProps) {
  const [localRefreshToken, setLocalRefreshToken] = useState(0);

  function handleRefresh() {
    setLocalRefreshToken((current) => current + 1);
    onMutate?.();
  }

  return (
    <GenericListWithTable<UserRow>
      endpoint="/users"
      columns={EMPTY_USER_COLUMNS}
      refreshToken={`${String(refresh ?? "")}-${localRefreshToken}`}
      pageSize={8}
      paramNames={{
        search: "q",
        page: "page",
        limit: "pageSize",
        sortBy: "sortBy",
        sortDir: "sortDir",
      }}
      responseAdapter={(raw: unknown) => {
        const typed = raw as PaginatedResponse<UserRow>;

        return {
          items: typed.data ?? [],
          total: typed.meta?.total ?? 0,
          pageCount: typed.meta?.pageCount,
        };
      }}
      onDataResolved={onDataResolved}
      DataTableComponent={(props) => (
        <UsersAdminCardsRenderer {...props} onRefresh={handleRefresh} />
      )}
    />
  );
}
