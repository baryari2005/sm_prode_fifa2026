"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { KeyRound, ShieldCheck, ShieldPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { usePermissionGroups } from "@/features/roles/hooks/usePermissionGroups";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { RolesList } from "./RolesTable";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

type RolesAdminOverviewProps = {
  canCreate: boolean;
};

export function RolesAdminOverview({ canCreate }: RolesAdminOverviewProps) {
  const [rolesTotal, setRolesTotal] = useState(0);
  const { roles, loading } = useRoles(true);
  const {
    groups,
    loading: loadingPermissions,
    totalModules,
    totalPermissions,
  } = usePermissionGroups(true);

  const activeRoles = useMemo(
    () => roles.filter((role) => role.activo).length,
    [roles],
  );

  const totalUsersAssigned = useMemo(
    () => roles.reduce((acc, role) => acc + (role._count?.usuarios ?? 0), 0),
    [roles],
  );

  const stats = [
    {
      label: "Roles visibles",
      detail: "Total real cargado",
      value: String(rolesTotal || roles.length),
      icon: ShieldCheck,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      label: "Roles activos",
      detail: loading ? "Actualizando..." : "Con acceso habilitado",
      value: loading ? "..." : String(activeRoles),
      icon: ShieldPlus,
      toneClass: "bg-[#FAB438]/14 text-[#FFE4A3]",
    },
    {
      label: "Permisos",
      detail: loadingPermissions ? "Leyendo modulos..." : "Configuraciones activas",
      value: loadingPermissions ? "..." : String(totalPermissions),
      icon: KeyRound,
      toneClass: "bg-emerald-400/14 text-emerald-200",
    },
  ];

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
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col xl:max-w-[56%] 2xl:max-w-[58%]">
              <div className="flex h-full flex-col">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                  Roles y permisos
                </div>

                <div className="mt-6 space-y-3 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Gestion de <span className="text-[#5993B6]">roles y permisos</span>
                  </h1>

                  <p className="max-w-[540px] font-brand text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Cobertura real
                  </p>

                  <p className="max-w-[560px] pt-1 text-[0.95rem] leading-6 text-white/78 xl:text-[1rem]">
                    Aca tenes todos los roles actuales con su nombre real, cantidad de
                    usuarios asignados y el mapa de permisos agrupado por modulo.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Badge
                      key={role.id}
                      className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10"
                    >
                      {role.nombre}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-8 xl:pt-10">
                  {canCreate ? (
                    <Button
                      asChild
                      className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                    >
                      <Link href="/roles/new">
                        <ShieldPlus className="mr-2 h-4 w-4" />
                        Nuevo rol
                      </Link>
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
                src="/brand/roles_permisos.png"
                alt="Ilustracion de roles y permisos"
                fill
                priority
                sizes="(min-width: 1536px) 500px, 420px"
                className="relative object-contain object-bottom opacity-[0.92] drop-shadow-[0_42px_88px_rgba(0,0,0,0.48)] [mask-image:radial-gradient(circle_at_50%_58%,black_64%,transparent_96%)] [-webkit-mask-image:radial-gradient(circle_at_50%_58%,black_64%,transparent_96%)]"
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
              title="Resumen lateral"
              description="Conteo real de roles, usuarios asignados y permisos actualmente activos."
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-start">
        <section className="grid gap-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Catalogo actual
                </p>
                <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Todos los roles
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Cada tarjeta toma nombre, descripcion, estado y cantidad de usuarios
                  desde la data real que ya usa la pagina.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {roles.map((role) => (
                  <article
                    key={role.id}
                    className={`rounded-[24px] border border-white/10 p-4 ${DASHBOARD_SUBCARD}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge
                          className={
                            role.activo
                              ? "rounded-full border-emerald-300/18 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10"
                              : "rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10"
                          }
                        >
                          {role.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        <h3 className="mt-3 font-brand text-[1.7rem] leading-none tracking-[0.04em] text-white">
                          {role.nombre}
                        </h3>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-[#5D7497]/35 text-[#FFE4A3]">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/72">
                      {role.descripcion?.trim() || "Sin descripcion cargada para este rol."}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-[#425675]/55 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Usuarios
                        </p>
                        <p className="mt-2 font-brand text-[1.4rem] leading-none tracking-[0.03em] text-white">
                          {role._count?.usuarios ?? 0}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#425675]/55 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Permisos
                        </p>
                        <p className="mt-2 font-brand text-[1.4rem] leading-none tracking-[0.03em] text-white">
                          {role._count?.permisos ?? 0}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
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

            <div className="relative z-10 space-y-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Tabla operativa
                </p>
                <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Gestion detallada
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Debajo del catalogo arranca directo la gestion real con busqueda,
                  paginado y acceso al detalle de cada rol.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#1E2C46]/72 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.18)]">
                <RolesList onDataResolved={({ total }) => setRolesTotal(total)} />
              </div>
            </div>
          </section>
        </section>

        <aside className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Modulos y acciones
              </p>
              <h3 className="mt-2 font-brand text-[1.75rem] leading-none tracking-[0.04em] text-white">
                Todos los permisos
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {loadingPermissions
                  ? "Leyendo la configuracion actual..."
                  : `${totalModules} modulos y ${totalPermissions} permisos activos en total.`}
              </p>
            </div>

            <div className="space-y-3">
              {groups.map((group) => (
                <article
                  key={group.modulo}
                  className={`rounded-[22px] border border-white/10 p-4 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-brand text-[1.35rem] leading-none tracking-[0.04em] text-white">
                        {group.modulo}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/72">
                        {group.permisos.length} permiso
                        {group.permisos.length === 1 ? "" : "s"} activo
                        {group.permisos.length === 1 ? "" : "s"}.
                      </p>
                    </div>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#5D7497]/35 text-[#FFE4A3]">
                      <KeyRound className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.permisos.map((permission) => (
                      <Badge
                        key={permission.id}
                        className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10"
                      >
                        {permission.accion}
                      </Badge>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {!loadingPermissions && groups.length === 0 ? (
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <p className="text-sm font-semibold text-white/72">
                  No hay permisos activos para mostrar.
                </p>
              </div>
            ) : null}

            <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
              <p className="text-sm font-semibold text-white">Usuarios asignados a roles</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Total actual: {totalUsersAssigned} usuario
                {totalUsersAssigned === 1 ? "" : "s"} distribuidos entre los roles visibles.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
