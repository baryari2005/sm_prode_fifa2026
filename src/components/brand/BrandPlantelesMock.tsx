"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Info,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const jugadoresPorPosicion = [
  {
    posicion: "Arqueros",
    total: 3,
    items: [
      {
        nombre: "Emiliano Martinez",
        posicion: "Arquero",
        dorsal: 23,
        club: "Aston Villa",
        estado: "Confirmado",
      },
      {
        nombre: "Geronimo Rulli",
        posicion: "Arquero",
        dorsal: 12,
        club: "Ajax",
        estado: "Confirmado",
      },
      {
        nombre: "Walter Benitez",
        posicion: "Arquero",
        dorsal: 1,
        club: "PSV",
        estado: "Revisar datos",
      },
    ],
  },
  {
    posicion: "Defensores",
    total: 8,
    items: [
      {
        nombre: "Cristian Romero",
        posicion: "Defensor",
        dorsal: 13,
        club: "Tottenham",
        estado: "Confirmado",
      },
      {
        nombre: "Nicolas Otamendi",
        posicion: "Defensor",
        dorsal: 19,
        club: "Benfica",
        estado: "Confirmado",
      },
      {
        nombre: "Nahuel Molina",
        posicion: "Defensor",
        dorsal: 16,
        club: "Atletico Madrid",
        estado: "Confirmado",
      },
      {
        nombre: "Nicolas Tagliafico",
        posicion: "Defensor",
        dorsal: 3,
        club: "Lyon",
        estado: "Revisar datos",
      },
    ],
  },
  {
    posicion: "Mediocampo",
    total: 8,
    items: [
      {
        nombre: "Enzo Fernandez",
        posicion: "Mediocampo",
        dorsal: 8,
        club: "Chelsea",
        estado: "Confirmado",
      },
      {
        nombre: "Rodrigo De Paul",
        posicion: "Mediocampo",
        dorsal: 7,
        club: "Atletico Madrid",
        estado: "Confirmado",
      },
      {
        nombre: "Alexis Mac Allister",
        posicion: "Mediocampo",
        dorsal: 20,
        club: "Liverpool",
        estado: "Confirmado",
      },
      {
        nombre: "Giovani Lo Celso",
        posicion: "Mediocampo",
        dorsal: 18,
        club: "Tottenham",
        estado: "Revisar datos",
      },
    ],
  },
  {
    posicion: "Delanteros",
    total: 7,
    items: [
      {
        nombre: "Julian Alvarez",
        posicion: "Delantero",
        dorsal: 9,
        club: "Manchester City",
        estado: "Revisar datos",
      },
      {
        nombre: "Lautaro Martinez",
        posicion: "Delantero",
        dorsal: 22,
        club: "Inter",
        estado: "Confirmado",
      },
      {
        nombre: "Lionel Messi",
        posicion: "Delantero",
        dorsal: 10,
        club: "Inter Miami",
        estado: "Confirmado",
      },
      {
        nombre: "Nicolas Gonzalez",
        posicion: "Delantero",
        dorsal: 15,
        club: "Juventus",
        estado: "Revisar datos",
      },
    ],
  },
];

const heroVisual = {
  src: brandImages.mascots.yaguarete,
  alt: "Visual del plantel",
  containerClassName:
    "pointer-events-none absolute bottom-[-10px] right-[-4px] z-20 hidden h-[390px] w-[325px] xl:block 2xl:bottom-[-18px] 2xl:right-0 2xl:h-[470px] 2xl:w-[380px]",
  imageClassName:
    "relative object-contain object-[center_bottom] opacity-[0.82] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]",
};

export function BrandPlantelesMock() {
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
              Preview aislada para validar la pantalla de planteles.
            </p>
          </div>

          <Link
            href="/brand-preview/selecciones/editar"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver a editar selección
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
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
                Plantel de selección
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Gestión de <span className="text-[#5993B6]">convocados</span>
                </h1>

                <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  Argentina
                </p>

                <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Un mock para revisar altas, importación, referencias y control visual
                  del plantel con el mismo lenguaje del dashboard.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-8 xl:pt-10 2xl:pt-14">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a selección
                </Button>

                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Importar archivo
                </Button>

                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Importar API
                </Button>

                <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nuevo jugador
                </Button>
              </div>
            </div>

            <div className={heroVisual.containerClassName}>
              <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
              <Image
                src={heroVisual.src}
                alt={heroVisual.alt}
                fill
                sizes="(min-width: 1536px) 380px, 325px"
                className={heroVisual.imageClassName}
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

            <div className="mb-3">
              <p className="mt-4 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Vista rápida
              </p>
              <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-[260px]">
                  Estado del plantel y accesos rápidos para la gestión.
                </span>
              </p>
            </div>

            <div className="space-y-2.5">
              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                  <Users className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Jugadores cargados
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    Plantel activo visible
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  26
                </span>
              </div>

              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FAB438]/14 text-[#FFE4A3]">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Importables
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    Archivo o API v4
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  2
                </span>
              </div>

              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-400/14 text-emerald-200">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Estado general
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    Listo para competir
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  OK
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
                  Lista del plantel
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Convocados por posición
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  En vez de una lista sábana, el mock agrupa el plantel por rol para escanear mejor.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-[220px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                  <Input
                    placeholder="Buscar por nombre o club"
                    className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                  />
                </div>

                <Button
                  variant="outline"
                  className="rounded-2xl border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-[#AEEBFF]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </div>
            </div>

            <Tabs defaultValue={jugadoresPorPosicion[0]?.posicion} className="space-y-5">
              <div className="overflow-x-auto pb-1">
                <TabsList className="min-w-max justify-start">
                  {jugadoresPorPosicion.map((bloque) => (
                    <TabsTrigger
                      key={bloque.posicion}
                      value={bloque.posicion}
                      className="min-w-[140px]"
                    >
                      {bloque.posicion} ({bloque.total})
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {jugadoresPorPosicion.map((bloque) => (
                <TabsContent key={bloque.posicion} value={bloque.posicion} className="mt-0">
                  <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
                    <div className={DASHBOARD_TOP_LINE}>
                      <div className={DASHBOARD_TOP_LINE_INNER} />
                      <div className={DASHBOARD_TOP_LINE_SWEEP} />
                      <div className={DASHBOARD_TOP_LINE_GLOW} />
                      <div className={DASHBOARD_TOP_LINE_HAIR} />
                    </div>
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-brand text-[1.5rem] leading-none tracking-[0.04em] text-white">
                            {bloque.posicion}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white/58">
                            {bloque.total} convocados
                          </p>
                        </div>

                        <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                          Vista activa
                        </Badge>
                      </div>

                      <div className="grid gap-3 xl:grid-cols-2">
                        {bloque.items.map((jugador) => (
                          <article
                            key={jugador.nombre}
                            className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                                    #{jugador.dorsal}
                                  </Badge>
                                  <Badge className="rounded-full border-white/10 bg-white/10 text-white/76 hover:bg-white/10">
                                    {jugador.posicion}
                                  </Badge>
                                </div>
                                <h3 className="font-brand mt-3 text-[1.7rem] leading-none tracking-[0.04em] text-white">
                                  {jugador.nombre}
                                </h3>
                                <p className="mt-2 text-sm font-semibold text-white/68">
                                  {jugador.club}
                                </p>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[300px]">
                                <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Estado
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-white">
                                    {jugador.estado}
                                  </p>
                                </div>

                                <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                    Acción rápida
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-white">
                                    Editar jugador
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <div className="space-y-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Ideas del mock
              </p>
              <div className="space-y-3">
                {[
                  "Hero consistente con selección y edición.",
                  "Bloques por posición para evitar lista interminable.",
                  "Lateral de importación y estado general siempre visible.",
                  "Preparado para migrar luego al PlantelManager real.",
                ].map((idea) => (
                  <div key={idea} className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                    <p className="text-sm leading-6 text-white/76">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </BrandPageShell>
  );
}
