"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  CalendarDays,
  Goal,
} from "lucide-react";

import { BrandActionButton } from "@/components/brand/BrandActionButton";
import { BrandEmptyState } from "@/components/brand/BrandEmptyState";
import { BrandFixtureCard } from "@/components/brand/BrandFixtureCard";
import { BrandLoadingState } from "@/components/brand/BrandLoadingState";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { BrandRankingCard } from "@/components/brand/BrandRankingCard";
import { BrandStatsCard } from "@/components/brand/BrandStatsCard";
import { BrandTitle } from "@/components/brand/BrandTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brandImages } from "@/config/brand-images";

export default function BrandPreviewPage() {
  return (
    <BrandPageShell contentClassName="space-y-8 pb-16">
      <section className="brand-hero px-6 py-8 md:px-8 md:py-10">
        <BrandPatternBackground className="opacity-100" overlayClassName="opacity-100" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_420px] xl:items-center">
          <div className="space-y-5">
            <Badge className="brand-badge px-4 py-1.5 text-[11px] uppercase tracking-[0.24em]">
              Mas Mundial / Mas San Miguel
            </Badge>
            <h1 className="brand-hero-title max-w-3xl text-5xl text-white md:text-7xl">
              Orgullo de barrio.
              <br />
              Pasión mundial.
            </h1>
            <p className="max-w-2xl text-base text-white/76 md:text-lg">
              Preview de identidad para validar paleta, tipografías, componentes
              base y el lenguaje visual de la experiencia antes de tocar pantallas reales.
            </p>
            <div className="flex flex-wrap gap-3">
              <BrandActionButton>
                Validar base visual
                <ChevronRight className="h-4 w-4" />
              </BrandActionButton>
              <BrandActionButton tone="secondary">
                Ver mock de login
              </BrandActionButton>
              <Link href="/brand-preview/selecciones">
                <BrandActionButton tone="secondary">
                  Ver mock de selecciones
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/importaciones">
                <BrandActionButton tone="secondary">
                  Ver mock de importaciones
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/pronosticos/fase-grupos">
                <BrandActionButton tone="secondary">
                  Ver mock de pronosticos
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/fixture">
                <BrandActionButton tone="secondary">
                  Ver mock de fixture
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/fixture/ver-detalle">
                <BrandActionButton tone="secondary">
                  Ver mock detalle de partido
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/fixture/gestionar-resultado">
                <BrandActionButton tone="secondary">
                  Ver mock resultado
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/fixture/incidencias">
                <BrandActionButton tone="secondary">
                  Ver mock incidencias
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/fixture/gestionar-formaciones">
                <BrandActionButton tone="secondary">
                  Ver mock formaciones
                </BrandActionButton>
              </Link>
              <Link href="/brand-preview/tabla-posiciones">
                <BrandActionButton tone="secondary">
                  Ver mock de tabla
                </BrandActionButton>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center xl:justify-end">
            <div className="brand-glass-card relative w-full max-w-[380px] overflow-hidden rounded-[32px] p-5">
              <div className="pointer-events-none absolute right-[-8%] top-[-8%] h-44 w-44 opacity-20">
                <Image
                  src={brandImages.institucional.solArgentino}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-contain"
                />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#AEEBFF]">
                  Hero destacado
                </p>
                <Image
                  src={brandImages.prode.loginHeroAlt}
                  alt="Arte principal del Prode"
                  width={320}
                  height={420}
                  className="mx-auto h-auto w-full max-w-[250px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.28)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="brand-card">
          <CardContent className="space-y-6 p-6">
            <BrandTitle
              eyebrow="Paleta"
              description="Colores centrales para la identidad de Mas Mundial / Mas San Miguel."
            >
              Tokens de color
            </BrandTitle>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Brand Navy", "#1E2C46"],
                ["Brand Blue", "#5993B6"],
                ["Brand Gold", "#FAB438"],
                ["Brand White", "#FFFFFF"],
              ].map(([label, value]) => (
                <div key={label} className="space-y-2 rounded-3xl border border-[#5993B6]/12 bg-white/70 p-4">
                  <div
                    className="h-16 rounded-2xl border border-black/5"
                    style={{ backgroundColor: value }}
                  />
                  <p className="text-sm font-semibold text-[var(--brand-text)]">{label}</p>
                  <p className="text-xs text-[var(--brand-text-soft)]">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="brand-card-dark">
          <CardContent className="space-y-6 p-6">
            <BrandTitle
              eyebrow="Tipografías"
              description="Poppins como base y Cheddar Gothic Sans como fuente de impacto."
            >
              Sistema tipográfico
            </BrandTitle>
            <div className="space-y-4">
              <p className="brand-heading text-4xl text-white">Titular de marca</p>
              <p className="text-base text-white/80">
                Poppins regular y semibold para formularios, tablas, badges, cards y
                textos de lectura.
              </p>
              <p className="font-brand text-5xl text-[#FAB438]">
                Tu barrio, tu prode
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="brand-card">
          <CardContent className="space-y-5 p-6">
            <BrandTitle
              eyebrow="Acciones"
              description="Botones, badges, inputs y selects con el nuevo lenguaje visual."
            >
              Componentes base
            </BrandTitle>
            <div className="flex flex-wrap gap-3">
              <BrandActionButton>Jugar ahora</BrandActionButton>
              <BrandActionButton tone="secondary">Ver detalle</BrandActionButton>
              <Button variant="destructive" className="rounded-2xl">
                Eliminar
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="brand-badge px-3 py-1">Orgullo de barrio</Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Pasión mundial
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Abierto a pronosticar
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Ingresá tu usuario" className="h-11" />
              <Select>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Elegí una fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grupos">Fase de grupos</SelectItem>
                  <SelectItem value="octavos">Octavos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <BrandStatsCard
            icon={CalendarDays}
            title="Pronósticos cargados"
            value="12 / 32"
            detail="fecha 1 completada"
          />
          <BrandStatsCard
            icon={Goal}
            title="Partidos en juego"
            value="3"
            detail="seguimiento en tiempo real"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <BrandTitle
            eyebrow="Fixture"
            description="Ejemplo de card compacta para partidos y estados."
          >
            Preview de fixture
          </BrandTitle>
          <div className="grid gap-4">
            <BrandFixtureCard
              match="Argentina vs Mexico"
              phase="Fase de grupos · Fecha 2"
              kickoff="27 May · 21:00"
              status="Cierra pronto"
            />
            <BrandFixtureCard
              match="Estados Unidos vs Australia"
              phase="Fase de grupos · Fecha 2"
              kickoff="28 May · 18:30"
              status="Abierto a pronosticar"
            />
          </div>
        </div>

        <div className="space-y-4">
          <BrandTitle
            eyebrow="Ranking"
            description="Ejemplo visual para resumen competitivo y top destacados."
          >
            Preview de ranking
          </BrandTitle>
          <div className="grid gap-4">
            <BrandRankingCard
              position="Posición #1"
              name="Sergio Ariel Manzoni"
              points="18"
              detail="Liderando el torneo"
            />
            <BrandRankingCard
              position="Posición #2"
              name="Maria Gomez"
              points="14"
              detail="Muy cerca de la cima"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <BrandEmptyState
          title="Todavía no hay partidos para pronosticar"
          description="El Mundial se está preparando. Volvé pronto para jugar por el orgullo del barrio."
          actionLabel="Ver próximos partidos"
        />
        <BrandLoadingState label="Preparando el fixture y cargando tu ranking..." />
      </section>

      <section className="space-y-4">
        <BrandTitle
          eyebrow="Login visual"
          description="Mock aislado para validar pattern completo, jerarquia y card protagonista sin tocar el login real."
        >
          Preview de login
        </BrandTitle>
        <div className="brand-hero overflow-hidden rounded-[36px]">
          <BrandPatternBackground />
          <div className="relative z-10 grid min-h-[680px] gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr_0.72fr] lg:items-center lg:p-10">
            <div className="space-y-5">
              <Badge className="brand-badge px-4 py-1.5 text-[11px] uppercase tracking-[0.24em]">
                Mas San Miguel
              </Badge>
              <h3 className="brand-hero-title max-w-[420px] text-5xl text-white">
                Jugá por la gloria.
                <br />
                Representá al barrio.
              </h3>
              <p className="max-w-[420px] text-base text-white/76">
                Viví el Mundial 2026 con tu grupo, seguí el ranking y demostrá quién manda en la tabla.
              </p>
            </div>

            <div className="relative flex justify-center">
              <Image
                src={brandImages.prode.loginHeroAlt}
                alt="Arte login preview"
                width={700}
                height={860}
                className="h-auto w-full max-w-[420px] object-contain drop-shadow-[0_40px_90px_rgba(0,0,0,0.34)]"
              />
            </div>

            <div className="brand-glass-card rounded-[32px] p-6">
              <div className="space-y-4">
                <Badge className="brand-badge px-3 py-1 text-[10px] uppercase tracking-[0.24em]">
                  Orgullo de barrio
                </Badge>
                <div>
                  <p className="brand-heading text-3xl text-white">Ingresá a Mas San Miguel</p>
                  <p className="mt-2 text-sm text-white/72">
                    Accedé para pronosticar, competir y vivir el Mundial con identidad local.
                  </p>
                </div>
                <Input placeholder="Usuario" className="h-11" />
                <Input placeholder="Contraseña" className="h-11" />
                <BrandActionButton className="w-full justify-center">
                  Entrar a la cancha
                </BrandActionButton>
                <button className="text-sm font-semibold text-[#AEEBFF]">
                  Solicitá tu acceso
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="brand-card p-0">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Assets actuales
            </p>
            <ul className="space-y-2 text-sm text-[var(--brand-text-soft)]">
              <li>Logo MAS actual en PNG</li>
              <li>Sol institucional en PNG</li>
              <li>Pattern actual en PNG</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="brand-card p-0">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Fuentes
            </p>
            <ul className="space-y-2 text-sm text-[var(--brand-text-soft)]">
              <li>Poppins como base del sistema</li>
              <li>Cheddar cargada como fuente de marca</li>
              <li>Falta version woff2 final de Cheddar</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="brand-card p-0">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Proxima etapa
            </p>
            <ul className="space-y-2 text-sm text-[var(--brand-text-soft)]">
              <li>Mock de login real</li>
              <li>Mock de dashboard real</li>
              <li>Aprobacion antes de tocar pantallas</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </BrandPageShell>
  );
}
