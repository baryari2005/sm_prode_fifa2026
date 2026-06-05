"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCheck,
  Clock3,
  FileSpreadsheet,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_HERO_PATTERN,
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { usePendingUsers } from "@/features/dashboard/hooks/usePendingUsers";
import { ApproveAllUsersDialog } from "@/features/users/components/ApproveAllUsersDialog";
import { useRoles } from "@/features/users/hooks/useRoles";
import { approveAllUsers } from "@/features/users/services/user-client.service";
import { useExportUsers } from "@/features/users/export/hooks/useExportUsers";
import { UsersAdminCards } from "./UsersAdminCards";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";
import { brandImages } from "@/config/brand-images";

type UsersAdminOverviewProps = {
  canCreate: boolean;
  canApproveAll: boolean;
  canExport: boolean;
};

export function UsersAdminOverview({
  canCreate,
  canApproveAll,
  canExport,
}: UsersAdminOverviewProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [approvingAll, setApprovingAll] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const { loading: exporting, handleExport } = useExportUsers();

  const { count: pendingCount, loading: pendingLoading } = usePendingUsers(
    true,
    30000,
    refreshKey,
  );
  const { roles, loading: rolesLoading } = useRoles();

  const roleNames = useMemo(() => roles.map((role) => role.nombre), [roles]);

  const stats = [
    {
      label: "Usuarios visibles",
      detail: "Total actual del listado",
      value: String(usersTotal),
      icon: Users,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      label: "Pendientes",
      detail: pendingLoading ? "Actualizando..." : "Esperan aprobación",
      value: pendingLoading ? "..." : String(pendingCount),
      icon: Clock3,
      toneClass: "bg-[#FAB438]/14 text-[#FFE4A3]",
    },
    {
      label: "Roles cargados",
      detail: rolesLoading ? "Leyendo configuración..." : "Disponibles para asignar",
      value: rolesLoading ? "..." : String(roleNames.length),
      icon: ShieldCheck,
      toneClass: "bg-emerald-400/14 text-emerald-200",
    },
  ];

  async function handleApproveAllUsers() {
    if (approvingAll) return;

    setApprovingAll(true);

    try {
      const result = await approveAllUsers();

      if (result.count === 0) {
        toast.info(result.message);
      } else {
        toast.success(result.message);
      }

      setApproveDialogOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Error al aprobar todos los usuarios",
      );
    } finally {
      setApprovingAll(false);
    }
  }

  return (
    <>
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-6 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className={DASHBOARD_HERO_PATTERN} />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col xl:max-w-[56%] 2xl:max-w-[58%]">
              <div className="flex h-full flex-col">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                  Administración de usuarios
                </div>

                <div className="mt-6 space-y-3 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Gestión de <span className="text-[#5993B6]">usuarios</span>
                  </h1>

                  <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Accesos y aprobaciones
                  </p>

                  <p className="max-w-[560px] pt-1 text-[0.95rem] leading-6 text-white/78 xl:text-[1rem]">
                    Revisá el listado real, aproba pendientes y trabaja con los roles actuales
                    del sistema sin salir del flujo administrativo.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {roleNames.map((roleName) => (
                    <Badge
                      key={roleName}
                      className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10"
                    >
                      {roleName}
                    </Badge>
                  ))}
                  {!rolesLoading && roleNames.length === 0 ? (
                    <Badge className="rounded-full border-white/10 bg-white/10 text-white/70 hover:bg-white/10">
                      Sin roles configurados
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3 pt-8 xl:pt-10">
                  {canApproveAll ? (
                    <Button
                      type="button"
                      onClick={() => setApproveDialogOpen(true)}
                      disabled={approvingAll}
                      className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      {approvingAll ? "Aprobando..." : "Aprobar todos"}
                    </Button>
                  ) : null}

                  {canCreate ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <Link href="/users/new">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Nuevo usuario
                      </Link>
                    </Button>
                  ) : null}

                  {canExport ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleExport}
                      disabled={exporting}
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {exporting ? "Exportando..." : "Exportar Excel"}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-42px] right-[-22px] z-20 hidden h-[470px] w-[420px] xl:block 2xl:bottom-[-58px] 2xl:right-[-14px] 2xl:h-[560px] 2xl:w-[500px]">
              <div className="absolute inset-[12%] rounded-full bg-[#5993B6]/28 blur-[132px]" />
              <div className="absolute bottom-[18%] right-[14%] h-44 w-44 rounded-full bg-[#0EA5E9]/16 blur-[88px]" />
              <div className="absolute right-[18%] top-[14%] h-28 w-28 rounded-full bg-[#FAB438]/12 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(255,255,255,0.06),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(8,26,48,0.2),transparent_52%)]" />
              <Image
                src={brandImages.mascots.usuarios}
                alt="Ilustracion de administracion de usuarios"
                fill
                priority
                sizes="(min-width: 1536px) 500px, 420px"
                className="relative translate-y-9 scale-[1] object-contain object-bottom opacity-[0.92] drop-shadow-[0_42px_88px_rgba(0,0,0,0.48)] 
                [mask-image:radial-gradient(circle_at_50%_62%,black_56%,rgba(0,0,0,0.8)_76%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_50%_62%,black_56%,rgba(0,0,0,0.8)_76%,transparent_100%)]"
              />
            </div>
          </section>

          <aside className={DASHBOARD_PANEL}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            
            <LateralSummaryHeader
              title="Vista rápida"
              description="Estado del listado real, solicitudes pendientes y roles habilitados."
            />

            <div className="space-y-2.5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${stat.toneClass}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                        {stat.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                        {stat.detail}
                      </span>
                    </span>
                    <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)] xl:items-start">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Grilla principal
              </p>
              <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                Usuarios registrados
              </h2>
              <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                Acá podés visualizar y controlar los datos de todos los usuarios registrados hasta el momento.
              </p>
            </div>

            <div className="min-w-0">
              <UsersAdminCards
                refresh={refreshKey}
                onDataResolved={({ total }) => setUsersTotal(total)}
                onMutate={() => setRefreshKey((prev) => prev + 1)}
              />
            </div>
          </div>
        </section>

        <aside className="grid gap-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Aprobaciones
              </p>
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <p className="font-brand text-[1.7rem] leading-none tracking-[0.04em] text-white">
                  {pendingLoading ? "Actualizando..." : `${pendingCount} pendientes`}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/74">
                  Las aprobaciones pendientes se pueden realizar de forma individual desde cada tarjeta, o bien de manera masiva utilizando este bloque para procesar el lote completo.
                </p>

                {canApproveAll ? (
                  <Button
                    type="button"
                    onClick={() => setApproveDialogOpen(true)}
                    disabled={approvingAll}
                    className="mt-4 w-full rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    {approvingAll ? "Aprobando..." : "Aprobar todos"}
                  </Button>
                ) : (
                  <p className="mt-4 text-sm font-semibold text-white/58">
                    No tenés permiso para aprobar usuarios en lote.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Roles actuales
              </p>
              <div className="space-y-3">
                {roleNames.map((roleName) => (
                  <div
                    key={roleName}
                    className={`rounded-[22px] px-4 py-3 ${DASHBOARD_SUBCARD}`}
                  >
                    <p className="text-sm font-semibold text-white">{roleName}</p>
                  </div>
                ))}
                {!rolesLoading && roleNames.length === 0 ? (
                  <div className={`rounded-[22px] px-4 py-3 ${DASHBOARD_SUBCARD}`}>
                    <p className="text-sm font-semibold text-white/70">
                      No hay roles disponibles para asignar.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </aside>
      </section>

      <ApproveAllUsersDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        isLoading={approvingAll}
        onConfirm={handleApproveAllUsers}
      />
    </>
  );
}
