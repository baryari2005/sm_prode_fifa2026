"use client";

import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const fechas = [
  {
    titulo: "Viernes 29 mayo 2026",
    detalle:
      "Carga todos los cruces del dia en una sola pasada y detecta rapido cierres o partidos ya iniciados.",
    partidos: [
      {
        hora: "19:00",
        fase: "Fase de Grupos",
        grupo: "Grupo A",
        estadio: "A confirmar",
        ciudad: "A confirmar",
        local: "Nueva Zelanda",
        visitante: "Egipto",
        estado: "Pendiente",
        cierre: "5 h 4 min",
      },
    ],
  },
  {
    titulo: "Miercoles 3 junio 2026",
    detalle:
      "Carga todos los cruces del dia en una sola pasada y detecta rapido cierres o partidos ya iniciados.",
    partidos: [
      {
        hora: "21:00",
        fase: "Fase de Grupos",
        grupo: "Grupo B",
        estadio: "A confirmar",
        ciudad: "A confirmar",
        local: "Nueva Zelanda",
        visitante: "Belgica",
        estado: "Configurado",
        cierre: "Cierra en 5 d 7 h",
      },
      {
        hora: "21:00",
        fase: "Fase de Grupos",
        grupo: "Grupo B",
        estadio: "A confirmar",
        ciudad: "A confirmar",
        local: "Egipto",
        visitante: "Iran",
        estado: "Configurado",
        cierre: "Cierra en 5 d 7 h",
      },
    ],
  },
];

const metricas = [
  {
    icon: CalendarClock,
    title: "Partidos visibles",
    detail: "Vista filtrada actual",
    value: "7",
    accent: "text-[#AEEBFF]",
    ring: "bg-[#AEEBFF]/12",
  },
  {
    icon: Trophy,
    title: "Fase activa",
    detail: "Lectura del calendario",
    value: "GR",
    accent: "text-[#FFE4A3]",
    ring: "bg-[#FAB438]/12",
  },
  {
    icon: CheckCircle2,
    title: "Estado general",
    detail: "Sin conflictos de carga",
    value: "OK",
    accent: "text-[#84F0C8]",
    ring: "bg-emerald-400/12",
  },
];

export function BrandFixtureMock() {
  return (
    <BrandPageShell
      backgroundVariant="dashboard"
      contentClassName="space-y-8 pb-16"
    >
      <section className="rounded-[32px] border border-[#5993B6]/16 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Mock visual temporal
            </p>
            <p className="mt-1 text-sm text-[#1E2C46]/72">
              Preview aislada para validar la experiencia de gestionar fixture.
            </p>
          </div>

          <Link
            href="/brand-preview"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver al indice
          </Link>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                <CalendarClock className="h-3.5 w-3.5" />
                Gestion de fixture
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Ordena el
                  <span className="text-[#5993B6]"> calendario</span>
                </h1>
                <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  fases, grupos y resultados
                </p>
                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Una vista pensada para revisar fechas, detectar huecos del fixture
                  y entrar rapido al detalle o al resultado oficial de cada partido.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">
                <Button className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15" variant="outline">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Revisar cruces
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-28px] right-[-20px] z-20 hidden h-[470px] w-[458px] xl:block 2xl:bottom-[-34px] 2xl:right-[-14px] 2xl:h-[546px] 2xl:w-[534px]">
              <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
              <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
              <HeroVisualImage
                src={brandImages.mascots.importar}
                alt="Hero visual de fixture"
                sizes="(min-width: 1536px) 534px, 458px"
                priority
                baseClassName="object-contain object-[center_bottom] opacity-[0.88] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
              />
            </div>
          </section>

          <aside className={`${DASHBOARD_PANEL} rounded-[30px] p-5 md:p-6`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="space-y-6">
              <div className="space-y-2 text-center text-white">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Resumen lateral
                </p>
                <div className="mx-auto flex max-w-[22rem] items-start justify-center gap-2 text-[0.95rem] leading-relaxed text-white/76">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/58" />
                  <p>
                    Lectura rapida del bloque visible y del estado general del calendario.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {metricas.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`${DASHBOARD_SUBCARD} flex items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-white`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.ring}`}
                        >
                          <Icon className={`h-5 w-5 ${item.accent}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[1.03rem] font-bold text-white">
                            {item.title}
                          </p>
                          <p className="text-sm text-white/68">{item.detail}</p>
                        </div>
                      </div>
                      <div className="brand-heading shrink-0 text-[2.1rem] text-white">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  filtros aplicables
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Explorador de partidos
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Busca un partido puntual o recorre cada grupo para revisar rapido
                  sede, fase y accesos operativos del fixture.
                </p>
              </div>

              <div className="flex flex-col gap-3 xl:min-w-[360px] xl:items-end">
                <div className="flex w-full flex-col gap-3 sm:flex-row xl:justify-end">
                  <label className="flex items-center gap-3 text-sm font-semibold text-white/72">
                    <Switch checked />
                    <span>Solo pendientes</span>
                  </label>
                  <div className="relative min-w-[220px] flex-1 xl:max-w-[280px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                    <Input
                      placeholder="Buscar por seleccion o estadio"
                      className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {[
                  "Fase de Grupos",
                  "Dieciseisavos de Final",
                  "Octavos de Final",
                  "Cuartos de Final",
                  "Semifinales",
                  "3° y 4° puesto",
                  "Final",
                ].map((fase, index) => (
                  <Button
                    key={fase}
                    type="button"
                    variant={index === 0 ? "default" : "outline"}
                    className={
                      index === 0
                        ? "rounded-full bg-[#5993B6] text-white hover:bg-[#4B84A6]"
                        : "rounded-full border-white/12 bg-white/8 text-white hover:bg-white/12"
                    }
                  >
                    {fase}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Filtro activo
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Fase de grupos - Grupo A
              </p>
              <p className="mt-1 text-sm font-semibold text-white/62">
                Mostrando solo los partidos de esta fase.
              </p>
            </div>

            <Tabs defaultValue="grupo-a" className="space-y-0">
              <div className="overflow-x-auto pb-1">
                <TabsList className="min-w-max justify-start">
                  {[
                    "Grupo A",
                    "Grupo B",
                    "Grupo C",
                    "Grupo D",
                    "Grupo E",
                    "Grupo F",
                    "Grupo G",
                    "Grupo H",
                  ].map((grupo) => (
                    <TabsTrigger
                      key={grupo}
                      value={grupo.toLowerCase().replace(/\s+/g, "-")}
                      className="min-w-[110px]"
                    >
                      {grupo}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </section>

        <div className="space-y-5">
          {fechas.map((fecha) => (
            <section
              key={fecha.titulo}
              className={`${DASHBOARD_PANEL} space-y-4 rounded-[30px] p-4`}
            >
              <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />

                <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                      Fecha agrupada
                    </p>
                    <h3 className="font-brand mt-2 text-[1.85rem] leading-[0.94] tracking-[0.04em] text-white">
                      {fecha.titulo}
                    </h3>
                    <p className="mt-2 max-w-[820px] text-sm leading-6 text-white/72">
                      {fecha.detalle}
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-[#AEEBFF]">
                    <Clock3 className="h-3.5 w-3.5" />
                    {fecha.partidos.length}{" "}
                    {fecha.partidos.length === 1 ? "partido" : "partidos"}
                  </span>
                </div>
              </section>

              <div
                className={`grid gap-4 ${fecha.partidos.length > 1 ? "xl:grid-cols-2" : ""}`}
              >
                {fecha.partidos.map((partido) => (
                  <article
                    key={`${fecha.titulo}-${partido.hora}-${partido.local}`}
                    className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}
                  >
                    <div className={DASHBOARD_TOP_LINE}>
                      <div className={DASHBOARD_TOP_LINE_INNER} />
                      <div className={DASHBOARD_TOP_LINE_SWEEP} />
                      <div className={DASHBOARD_TOP_LINE_GLOW} />
                      <div className={DASHBOARD_TOP_LINE_HAIR} />
                    </div>

                    <div className="space-y-4">
                      <div className={`${DASHBOARD_SUBCARD} rounded-[20px] px-4 py-3`}>
                        <div className="flex flex-wrap items-center gap-3 text-[15px] font-semibold text-white/74">
                          <span className="inline-flex items-center gap-1.5 text-base font-black text-[#AEEBFF]">
                            <Clock3 className="h-4.5 w-4.5" />
                            {partido.hora}
                          </span>
                          <span className="text-white/34">|</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
                            {partido.cierre}
                          </span>
                          <span className="text-white/34">|</span>
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <MapPin className="h-4 w-4 shrink-0 text-[#AEEBFF]" />
                            <span className="truncate">
                              {partido.estadio} ({partido.ciudad})
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] md:items-center">
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
                              Local
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-xs font-black uppercase text-[#AEEBFF]">
                                {partido.local.slice(0, 2)}
                              </div>
                              <p className="truncate text-lg font-black text-white xl:text-xl">
                                {partido.local}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <div className="h-12 rounded-2xl border border-white/10 bg-white/10" />
                            <span className="font-brand text-[1.8rem] leading-none text-white/68">
                              vs
                            </span>
                            <div className="h-12 rounded-2xl border border-white/10 bg-white/10" />
                          </div>

                          <div className="min-w-0 text-right">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
                              Visitante
                            </p>
                            <div className="mt-2 flex items-center justify-end gap-3">
                              <p className="truncate text-lg font-black text-white xl:text-xl">
                                {partido.visitante}
                              </p>
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-xs font-black uppercase text-[#AEEBFF]">
                                {partido.visitante.slice(0, 2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          asChild
                          className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
                        >
                          <Link href="/brand-preview/fixture/ver-detalle">
                            Ver detalle
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
                        >
                          <Link href="/brand-preview/fixture/gestionar-resultado">
                            Gestionar resultado
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
                        >
                          <Link href="/brand-preview/fixture/gestionar-formaciones">
                            Gestionar formaciones
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
                        >
                          <Link href="/brand-preview/fixture/incidencias">
                            Incidencias
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </BrandPageShell>
  );
}
