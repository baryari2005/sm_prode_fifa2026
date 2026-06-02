"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { BrandActionButton } from "@/components/brand/BrandActionButton";
import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brandImages } from "@/config/brand-images";

export function BrandAccessRequestMock() {
  const [personalTab, setPersonalTab] = useState<"basicos" | "identificacion">(
    "basicos",
  );

  return (
    <section className="brand-hero overflow-hidden rounded-[36px]">
      <BrandPatternBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(250,180,56,0.14),transparent_18%),radial-gradient(circle_at_48%_60%,rgba(89,147,182,0.16),transparent_30%)]" />

      <div className="relative z-10 grid min-h-[760px] gap-8 p-6 lg:grid-cols-[0.88fr_1.04fr] lg:items-center lg:p-10 xl:grid-cols-[0.84fr_1.08fr] xl:p-12">
        <div className="space-y-7">
          <div className="space-y-4">
            <Badge className="brand-badge px-4 py-1.5 text-[11px] uppercase tracking-[0.24em]">
              Orgullo de barrio
            </Badge>

            <h1 className="brand-hero-title max-w-[560px] text-5xl text-white md:text-6xl xl:text-7xl">
              Tu barrio también
              <br />
              juega el Mundial.
            </h1>

            <p className="max-w-[470px] text-base leading-7 text-white/78 md:text-lg">
              Solicitá tu acceso al Prode Mundial 2026, sumate a tu grupo y esperá
              la aprobación para empezar a competir con identidad local.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              icon={ShieldCheck}
              title="Solicitud pendiente"
              description="Tu cuenta quedará en revisión hasta que un administrador la apruebe."
            />
            <FeatureItem
              icon={Sparkles}
              title="Misma identidad del login"
              description="Un flujo claro, premium y alineado a Mas Mundial / Mas San Miguel."
            />
            <FeatureItem
              icon={UserRound}
              title="Pensado para tu grupo"
              description="Entra al prode, representa a tu barrio y vive el Mundial con tu comunidad."
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href="/brand-preview/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#AEEBFF] transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/72">
              Pasión mundial
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.18),transparent_42%)] blur-[72px]" />
          <div className="pointer-events-none absolute right-[8%] top-[2%] h-40 w-40 opacity-[0.1]">
            <Image
              src={brandImages.institucional.solArgentino}
              alt=""
              fill
              aria-hidden="true"
              className="object-contain"
            />
          </div>

          <div className="relative w-full max-w-[700px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(89,147,182,0.15)] blur-[100px]" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.12] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-[14px] lg:p-7">
              <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-56 w-56 opacity-[0.08]">
                <Image
                  src={brandImages.prode.loginHeroAlt}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-contain object-bottom"
                />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex justify-center lg:justify-start">
                  <Image
                    src={brandImages.prode.masSanMiguelLogo}
                    alt="Mas San Miguel"
                    width={176}
                    height={72}
                    className="h-auto w-[142px] object-contain"
                  />
                </div>

                <Badge className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/78">
                  Tu barrio también juega
                </Badge>

                <div>
                  <h2 className="brand-heading text-3xl text-white">
                    Solicitá tu acceso
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Completá tus datos y esperá la aprobación de un
                    administrador. Tu cuenta quedará pendiente hasta que sea
                    aprobada.
                  </p>
                </div>

                <Tabs defaultValue="acceso" className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <TabsList className="h-auto w-full flex-nowrap justify-start gap-6 rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-0">
                      <TabsTrigger
                        value="acceso"
                        className="rounded-none border-0 bg-transparent px-0 py-2 text-sm font-semibold text-white/56 shadow-none data-[state=active]:border-0 data-[state=active]:bg-transparent data-[state=active]:text-[#AEEBFF] data-[state=active]:shadow-none"
                      >
                        Acceso
                      </TabsTrigger>
                      <TabsTrigger
                        value="personales"
                        className="rounded-none border-0 bg-transparent px-0 py-2 text-sm font-semibold text-white/56 shadow-none data-[state=active]:border-0 data-[state=active]:bg-transparent data-[state=active]:text-[#AEEBFF] data-[state=active]:shadow-none"
                      >
                        Datos personales
                      </TabsTrigger>
                      <TabsTrigger
                        value="domicilio"
                        className="rounded-none border-0 bg-transparent px-0 py-2 text-sm font-semibold text-white/56 shadow-none data-[state=active]:border-0 data-[state=active]:bg-transparent data-[state=active]:text-[#AEEBFF] data-[state=active]:shadow-none"
                      >
                        Domicilio
                      </TabsTrigger>
                      <TabsTrigger
                        value="bases"
                        className="rounded-none border-0 bg-transparent px-0 py-2 text-sm font-semibold text-white/56 shadow-none data-[state=active]:border-0 data-[state=active]:bg-transparent data-[state=active]:text-[#AEEBFF] data-[state=active]:shadow-none"
                      >
                        Bases y condiciones
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="acceso" className="space-y-4">
                    <FormSectionTitle title="Acceso" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <MockField label="Usuario" placeholder="Tu usuario" />
                      <MockField
                        label="Email"
                        placeholder="tu@email.com"
                        className="sm:col-span-2"
                      />
                      <MockField
                        label="Contraseña"
                        placeholder="Minimo 6 caracteres"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="personales" className="space-y-4">
                    <FormSectionTitle title="Datos personales" />
                    <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">
                            Organiza mejor tus datos personales
                          </p>
                          <p className="text-xs text-white/60">
                            Primero los datos básicos y después la identificación.
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] p-1">
                          <button
                            type="button"
                            onClick={() => setPersonalTab("basicos")}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              personalTab === "basicos"
                                ? "bg-[#5993B6]/12 text-[#AEEBFF]"
                                : "text-white/56"
                            }`}
                          >
                            Datos básicos
                          </button>
                          <button
                            type="button"
                            onClick={() => setPersonalTab("identificacion")}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              personalTab === "identificacion"
                                ? "bg-[#5993B6]/12 text-[#AEEBFF]"
                                : "text-white/56"
                            }`}
                          >
                            Identificación
                          </button>
                        </div>
                      </div>

                      {personalTab === "basicos" ? (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <MockField label="Nombre" placeholder="Tu nombre" />
                            <MockField label="Apellido" placeholder="Tu apellido" />
                            <MockField label="Celular" placeholder="Tu celular" />
                            <MockField
                              label="Fecha de nacimiento"
                              placeholder="AAAA-MM-DD"
                              icon={<CalendarDays className="h-4 w-4" />}
                            />
                            <MockSelect label="Genero" value="Prefiere no decir" />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setPersonalTab("identificacion")}
                              className="inline-flex items-center gap-2 rounded-full border border-[#5993B6]/30 bg-[#5993B6]/10 px-4 py-2 text-sm font-semibold text-[#AEEBFF] transition hover:bg-[#5993B6]/16"
                            >
                              Siguiente
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <MockSelect label="Tipo de documento" value="DNI" />
                            <MockField
                              label="Documento"
                              placeholder="Numero de documento"
                            />
                            <MockField label="CUIL" placeholder="Tu CUIL" />
                            <MockSelect label="Nacionalidad" value="Argentina" />
                            <MockSelect label="Estado civil" value="Soltero" />
                          </div>

                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => setPersonalTab("basicos")}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/76 transition hover:bg-white/[0.1] hover:text-white"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Volver
                            </button>
                            <button
                              type="button"
                              onClick={() => setPersonalTab("basicos")}
                              className="inline-flex items-center gap-2 rounded-full border border-[#5993B6]/30 bg-[#5993B6]/10 px-4 py-2 text-sm font-semibold text-[#AEEBFF] transition hover:bg-[#5993B6]/16"
                            >
                              Revisar básicos
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="domicilio" className="space-y-4">
                    <FormSectionTitle title="Domicilio" />
                    <div className="grid gap-4 md:grid-cols-3">
                      <MockField
                        label="Domicilio"
                        placeholder="Tu direccion"
                        className="md:col-span-1"
                        icon={<MapPin className="h-4 w-4" />}
                      />
                      <MockSelect label="Partido" value="No Aplica" />
                      <MockField
                        label="Codigo postal"
                        placeholder="Codigo postal"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="bases" className="space-y-4">
                    <FormSectionTitle title="Bases y condiciones" />
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-sm leading-6 text-white/72">
                        Al enviar esta solicitud declaras que los datos
                        ingresados son reales y aceptas las bases y condiciones
                        del acceso al Prode Mundial 2026.
                      </p>
                      <label className="flex items-start gap-3 text-sm text-white/82">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent"
                        />
                        <span>
                          Leí y acepto las bases y condiciones para solicitar
                          acceso.
                        </span>
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white/72">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-[#FAB438]">
                      <LockKeyhole className="h-4 w-4" />
                    </div>
                    <p>
                      La solicitud se envia para revision. Cuando tu cuenta sea
                      aprobada, vas a poder entrar y jugar por el orgullo del
                      barrio.
                    </p>
                  </div>
                </div>

                <BrandActionButton className="h-12 w-full justify-center text-base">
                  Enviar solicitud
                  <ArrowRight className="h-4 w-4" />
                </BrandActionButton>

                <div className="space-y-1 text-center lg:text-left">
                  <p className="text-sm text-white/58">
                    ¿Ya tenés acceso al Prode?
                  </p>
                  <Link
                    href="/brand-preview/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#AEEBFF] transition hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    Volver al login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormSectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-1">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#AEEBFF]">
        {title}
      </p>
    </div>
  );
}

function MockField({
  label,
  placeholder,
  className,
  icon,
}: {
  label: string;
  placeholder: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-white/76">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center text-white/42">
            {icon}
          </span>
        ) : null}
        <Input
          placeholder={placeholder}
          className={`h-12 border-white/14 bg-white/[0.1] text-white placeholder:text-white/42 ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}

function MockSelect({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-white/76">
        {label}
      </label>
      <div className="flex h-12 items-center rounded-2xl border border-white/14 bg-white/[0.1] px-4 text-sm text-white/76">
        {value}
      </div>
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-[#FAB438]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
      </div>
    </div>
  );
}
