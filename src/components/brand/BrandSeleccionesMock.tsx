"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Search,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { PageHeaderWithBrand } from "@/components/brand/PageHeaderWithBrand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const selecciones = [
  {
    nombre: "Argentina",
    grupo: "Grupo A",
    confederacion: "CONMEBOL",
    estado: "Plantel completo",
    estadio: "Monumental",
    puntosMock: 9,
    color: "from-sky-300/18 via-sky-200/8 to-white/[0.03]",
  },
  {
    nombre: "Brasil",
    grupo: "Grupo B",
    confederacion: "CONMEBOL",
    estado: "2 convocados pendientes",
    estadio: "Maracana",
    puntosMock: 7,
    color: "from-emerald-300/16 via-yellow-300/8 to-white/[0.03]",
  },
  {
    nombre: "Francia",
    grupo: "Grupo C",
    confederacion: "UEFA",
    estado: "Bandera y escudo OK",
    estadio: "Stade de France",
    puntosMock: 6,
    color: "from-blue-300/16 via-white/6 to-red-300/6",
  },
  {
    nombre: "Japon",
    grupo: "Grupo D",
    confederacion: "AFC",
    estado: "Revisar nombres localizados",
    estadio: "Saitama",
    puntosMock: 4,
    color: "from-white/10 via-rose-300/8 to-white/[0.03]",
  },
];

export function BrandSeleccionesMock() {
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
              Preview aislada para validar una posible pantalla de selecciones.
            </p>
          </div>

          <Link
            href="/brand-preview"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver a brand preview
          </Link>
        </div>
      </section>

      <PageHeaderWithBrand
        badge="Selecciones preview"
        metricLabel="selecciones"
        metricValue="48"
        title="Control visual para selecciones del Mundial 2026"
        description="Mock de una pantalla más editorial y clara para revisar banderas, grupos, confederaciones y estado de carga de cada selección sin perder el tono del dashboard."
        imageSrc={brandImages.prode.loginHeroAlt}
        imageAlt="Arte visual de selecciones"
        watermarkSrc={brandImages.institucional.solArgentino}
        actions={
          <>
            <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
              Nueva seleccion
            </Button>
            <Link href="/brand-preview/selecciones/editar">
              <Button
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
              >
                Ver mock editar
              </Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
            >
              Importar desde API
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="border-sky-100/18 bg-sky-200/10 text-sky-100 hover:bg-sky-200/10">
            Banderas validadas
          </Badge>
          <Badge className="border-yellow-300/25 bg-yellow-300/12 text-yellow-200 hover:bg-yellow-300/12">
            Localizacion ES
          </Badge>
          <Badge className="border-emerald-300/25 bg-emerald-300/12 text-emerald-100 hover:bg-emerald-300/12">
            Planteles vinculables
          </Badge>
        </div>
      </PageHeaderWithBrand>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
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
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#AEEBFF]">
                  Explorador de selecciones
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Selecciones listas para competir
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Busqueda rapida, filtros de grupo y un estado visual mas cercano al
                  dashboard aprobado para revisar contenido, identidad y planteles.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-[220px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                  <Input
                    placeholder="Buscar por seleccion o codigo"
                    className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                  />
                </div>

                <Button
                  variant="outline"
                  className="rounded-2xl border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-[#AEEBFF]"
                >
                  Filtrar grupos
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {selecciones.map((seleccion) => (
                <article
                  key={seleccion.nombre}
                  className={`group relative overflow-hidden rounded-[28px] bg-gradient-to-br p-5 ${seleccion.color} ${DASHBOARD_SUBCARD}`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-[#355373] via-[#5993B6] to-[#FAB438]" />
                    <div className="absolute inset-y-0 left-[-24%] w-[26%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.88)_50%,transparent_100%)] opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[78%] group-hover:opacity-100" />
                  </div>
                  <div className="pointer-events-none absolute right-[-8%] top-[-16%] h-28 w-28 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Badge className="rounded-full border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF] hover:bg-white/10">
                          {seleccion.grupo}
                        </Badge>
                        <div>
                          <h3 className="font-brand text-[1.9rem] leading-none tracking-[0.04em] text-white">
                            {seleccion.nombre}
                          </h3>
                          <p className="mt-2 text-sm font-semibold text-white/68">
                            {seleccion.confederacion}
                          </p>
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-[#AEEBFF] shadow-sm transition group-hover:bg-white/14">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Estado
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {seleccion.estado}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          Estadio base
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {seleccion.estadio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1E2C46] px-4 py-3 text-white">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/76">
                        <Trophy className="h-4 w-4 text-[#FAB438]" />
                        Puntaje mock: {seleccion.puntosMock}
                      </div>

                      <Button className="rounded-full bg-[#5993B6] px-4 text-white hover:bg-[#4B84A6]">
                        Ver seleccion
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_35%),radial-gradient(circle_at_20%_16%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Vista rápida
              </p>

              <div className="space-y-3">
                <div className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/72">
                        Confederaciones
                      </p>
                      <p className="font-brand text-[1.8rem] leading-none tracking-[0.03em] text-white">
                        6
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAB438]/14 text-[#FFE4A3]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/72">
                        Con plantel vinculado
                      </p>
                      <p className="font-brand text-[1.8rem] leading-none tracking-[0.03em] text-white">
                        34
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/14 text-emerald-200">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/72">
                        Listas para publicar
                      </p>
                      <p className="font-brand text-[1.8rem] leading-none tracking-[0.03em] text-white">
                        29
                      </p>
                    </div>
                  </div>
                </div>
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Ideas del mock
              </p>
              <div className="space-y-3">
                {[
                  "Cards mas editoriales para cada seleccion.",
                  "Jerarquia fuerte con Cheddar en nombre del pais.",
                  "Filtros arriba y Vista rápida persistente.",
                  "Top line y hover alineados al dashboard aprobado.",
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
