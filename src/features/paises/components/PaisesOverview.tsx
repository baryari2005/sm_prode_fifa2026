"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Globe2,
  Languages,
  Medal,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { BrandEmptyState } from "@/components/brand/BrandEmptyState";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brandImages } from "@/config/brand-images";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";

import { buildPaisesOverviewSummary, groupPaisesByGrupo } from "../lib/paises-overview.helpers";
import { usePaisesOverview } from "../hooks/usePaisesOverview";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

type Props = {
  canEdit: boolean;
  refreshToken: number;
  updatingConfederations: boolean;
  updatingLanguage: boolean;
  onUpdateConfederations?: () => void;
  onUpdateLanguage?: () => void;
};

export function PaisesOverview({
  canEdit,
  refreshToken,
  updatingConfederations,
  updatingLanguage,
  onUpdateConfederations,
  onUpdateLanguage,
}: Props) {
  const { error, filteredPaises, loading, paises, search, setSearch } =
    usePaisesOverview(refreshToken);

  const groupedPaises = groupPaisesByGrupo(filteredPaises);
  const summary = buildPaisesOverviewSummary(paises);
  const [activeGroup, setActiveGroup] = useState<string>("");

  const firstGroupKey = groupedPaises[0]?.groupKey ?? "";

  useEffect(() => {
    if (!groupedPaises.length) {
      if (activeGroup) setActiveGroup("");
      return;
    }

    const activeGroupExists = groupedPaises.some(
      (group) => group.groupKey === activeGroup,
    );

    if (!activeGroup || !activeGroupExists) {
      setActiveGroup(firstGroupKey);
    }
  }, [activeGroup, firstGroupKey, groupedPaises]);

  if (loading && paises.length === 0) {
    return (
      <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
        <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
          <DashboardLoading badgeLabel="Loading paises" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

          <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
            <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:min-h-[392px] xl:px-7 xl:py-6 2xl:min-h-[420px] 2xl:px-8 2xl:py-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
                <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
                <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
              </div>

              <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                  Selecciones 2026
                </div>

                <div className="mt-6 space-y-2.5 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Selecciones del <span className="text-[#5993B6]">Mundial</span>
                  </h1>

                  <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Administra grupos, identidades y planteles
                  </p>

                  <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                    Revisa las selecciones agrupadas por zona y entra rápido al detalle o al plantel de cada país.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-8 xl:pt-12 2xl:pt-14">
                  {canEdit && onUpdateConfederations ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onUpdateConfederations}
                      disabled={updatingConfederations}
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <Globe2 className="mr-2 h-4 w-4" />
                      {updatingConfederations
                        ? "Completando..."
                        : "Modificar confederaciones"}
                    </Button>
                  ) : null}

                  {canEdit && onUpdateLanguage ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onUpdateLanguage}
                      disabled={updatingLanguage}
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      {updatingLanguage ? "Modificando..." : "Modificar idioma"}
                    </Button>
                  ) : null}

                  {/* {canCreate ? (
                  <Link href="/admin/paises/nuevo">
                    <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
                      Nueva seleccion
                    </Button>
                  </Link>
                ) : null} */}
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-[4px] right-[-28px] z-20 hidden h-[420px] w-[360px] xl:block 2xl:bottom-[-2px] 2xl:right-[-18px] 2xl:h-[510px] 2xl:w-[430px]">
                <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
                <HeroVisualImage
                  src={brandImages.mascots.selecciones}
                  alt=""
                  sizes="(min-width: 1536px) 430px, 360px"
                  baseClassName="relative object-contain object-[center_bottom] drop-shadow-[0_28px_64px_rgba(0,0,0,0.34)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
                  loadedClassName="scale-100 opacity-72"
                  loadingClassName="scale-[0.97] opacity-0"
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
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <LateralSummaryHeader
                title="Resumen lateral"
                description="Métricas rápidas para administrar las selecciones."
              />

              <div className="space-y-2.5">
                <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                    <Globe2 className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                      Confederaciones
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                      Diversidad de asociaciones presentes
                    </span>
                  </span>
                  <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                    {summary.confederaciones}
                  </span>
                </div>

                <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FAB438]/14 text-[#FFE4A3]">
                    <Users className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                      Con grupo asignado
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                      Selecciones ya ubicadas por zona
                    </span>
                  </span>
                  <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                    {summary.conGrupo}
                  </span>
                </div>

                <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-400/14 text-emerald-200">
                    <Star className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                      Activas
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                      Selecciones disponibles en el sistema
                    </span>
                  </span>
                  <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                    {summary.activas}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                    Selecciones por grupo
                  </p>
                  <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                    Explorador de selecciones
                  </h2>
                  <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                    Busca una seleccion puntual o recorre cada grupo para entrar al
                    detalle y administrar su plantel.
                  </p>
                </div>

                <div className="relative min-w-[220px] max-w-[320px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por seleccion, codigo o grupo"
                    className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-[24px] border border-rose-300/20 bg-rose-300/10 px-4 py-4 text-sm font-semibold text-rose-100">
                  {error}
                </div>
              ) : null}

              {!loading && groupedPaises.length === 0 ? (
                <BrandEmptyState
                  title="No encontramos selecciones"
                  description="Prueba con otro termino de busqueda o revisa si hay grupos cargados."
                />
              ) : null}

              {groupedPaises.length > 0 ? (
                <Tabs value={activeGroup} onValueChange={setActiveGroup} className="space-y-5">
                  <div className="overflow-x-auto pb-1">
                    <TabsList className="min-w-max justify-start">
                      {groupedPaises.map((group) => (
                        <TabsTrigger
                          key={group.groupKey}
                          value={group.groupKey}
                          className="min-w-[110px]"
                        >
                          {group.groupLabel}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {groupedPaises.map((group) => (
                    <TabsContent key={group.groupKey} value={group.groupKey} className="mt-0 space-y-3">
                      {/* <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-brand text-[1.5rem] leading-none tracking-[0.04em] text-white">
                          {group.groupLabel}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white/58">
                          {group.items.length} selecciones
                        </p>
                      </div>
                    </div> */}

                      <div className="grid gap-4 md:grid-cols-2">
                        {group.items.map((pais) => (
                          <article
                            key={pais.id}
                            className={`${DASHBOARD_PANEL} rounded-[28px] p-5`}
                          >
                            <div className={DASHBOARD_TOP_LINE}>
                              <div className={DASHBOARD_TOP_LINE_INNER} />
                              <div className={DASHBOARD_TOP_LINE_SWEEP} />
                              <div className={DASHBOARD_TOP_LINE_GLOW} />
                              <div className={DASHBOARD_TOP_LINE_HAIR} />
                            </div>
                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-[#FAB438]/10 blur-3xl" />
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                                    <FlagImage
                                      bandera={pais.bandera}
                                      codigo={pais.codigo}
                                      nombre={pais.nombre}
                                      widthClassName="w-11"
                                      heightClassName="h-8"
                                      fallbackMode="emoji"
                                      fallbackTextClassName="text-xl"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF] inline-flex">
                                      {pais.grupo ? `Grupo ${pais.grupo}` : "Sin grupo"}
                                    </p>
                                    <h3 className="font-brand mt-2 truncate text-[1.9rem] leading-none tracking-[0.04em] text-white">
                                      {pais.nombre}
                                    </h3>
                                    <p className="mt-2 text-sm font-semibold text-white/68">
                                      {pais.confederacion ?? "Confederacion pendiente"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-[#AEEBFF] shadow-sm transition group-hover:bg-white/14">
                                  <ShieldCheck className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <div
                                  className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}
                                >
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Codigo
                                  </p>
                                  <p className="mt-2 text-sm font-semibold uppercase text-white">
                                    {pais.codigo}
                                  </p>
                                </div>

                                <div
                                  className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}
                                >
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Estado
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-white">
                                    {pais.activo ? "Activa" : "Inactiva"}
                                  </p>
                                </div>

                                <div
                                  className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}
                                >
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Confederacion
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-white">
                                    {pais.confederacion ?? "Pendiente"}
                                  </p>
                                </div>

                                <div
                                  className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}
                                >
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Puntos
                                  </p>
                                  <div className="mt-2 flex items-center gap-2 text-white">
                                    <Medal className="h-4 w-4 text-[#FAB438]" />
                                    <p className="text-sm font-semibold">
                                      {pais.puntos ?? 0} pts
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-white ${DASHBOARD_SUBCARD}`}
                              >
                                <div className="flex items-center gap-2 text-sm font-semibold text-white/76">
                                  <Users className="h-4 w-4 text-[#FAB438]" />
                                  {pais.footballDataTeamId
                                    ? `TeamId API: ${pais.footballDataTeamId}`
                                    : "Sin TeamId API"}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Link href={`/admin/paises/${pais.id}/plantel`}>
                                    <Button
                                      variant="outline"
                                      className="rounded-full border-white/12 bg-white/8 px-4 text-white hover:bg-white/14"
                                    >
                                      Plantel
                                    </Button>
                                  </Link>

                                  <Link href={`/admin/paises/${pais.id}`}>
                                    <Button className="rounded-full bg-[#5993B6] px-4 text-white hover:bg-[#4B84A6]">
                                      Ver seleccion
                                      <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
