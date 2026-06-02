"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Info,
  RefreshCw,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type ImportRow = {
  title: string;
  icon: typeof FileSpreadsheet;
  tone: "sky" | "gold";
  description: string;
  cta: string;
  status: string;
};

const importSelectionRows: ImportRow[] = [
  {
    title: "Importar desde API oficial",
    icon: FileSpreadsheet,
    tone: "sky",
    description:
      "Trae nombre, codigo, grupo, confederacion y teamId para completar o actualizar selecciones.",
    cta: "Sincronizar selecciones",
    status: "48 disponibles",
  },
  {
    title: "Importar desde archivo",
    icon: Upload,
    tone: "gold",
    description:
      "Carga un CSV o Excel con banderas, nombres en espanol y configuraciones de grupos.",
    cta: "Seleccionar archivo",
    status: "Plantilla .xlsx",
  },
];

const importPlantelRows: ImportRow[] = [
  {
    title: "Importar plantel por API",
    icon: RefreshCw,
    tone: "sky",
    description:
      "Reemplaza o fusiona convocados de la seleccion activa con la respuesta mas reciente de la API.",
    cta: "Importar convocados",
    status: "26 jugadores esperados",
  },
  {
    title: "Importar plantilla manual",
    icon: Download,
    tone: "gold",
    description:
      "Sube una base de jugadores por dorsal, posicion y club para completar datos faltantes.",
    cta: "Cargar plantilla",
    status: "CSV / XLSX",
  },
];

const previewResults = [
  {
    title: "Selecciones actualizadas",
    detail: "48 sincronizadas, 6 con cambios de grupo y 3 con confederacion completada.",
    badge: "API completada",
  },
  {
    title: "Plantel importado",
    detail: "26 convocados listos, 4 en revision manual y 1 pendiente de foto.",
    badge: "Listo para revisar",
  },
];

export function BrandImportacionesMock() {
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
              Preview aislada para validar la experiencia de importacion.
            </p>
          </div>

          <Link
            href="/brand-preview/planteles"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver a planteles
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
          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:min-h-[392px] xl:px-7 xl:py-6 2xl:min-h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[70%] min-w-0 flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Centro de importacion
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Carga masiva de <span className="text-[#5993B6]">selecciones</span>
                </h1>

                <p className="font-brand max-w-[620px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  Y planteles en una sola experiencia
                </p>

                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Este mock junta importaciones de selecciones y convocados en la misma
                  pantalla, con feedback rapido, Vista rápida y resultado visible
                  antes de entrar al detalle.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 xl:pt-8 2xl:pt-10">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al admin
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Ver plantilla
                </Button>
                <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Ejecutar importacion
                </Button>
              </div>
            </div>
          </section>

          <aside className={DASHBOARD_PANEL}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="mb-3">
              <p className="mt-4 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Vista rápida
              </p>
              <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-[260px]">
                  Estado rapido del flujo y de los bloques que se van a actualizar.
                </span>
              </p>
            </div>

            <div className="space-y-2.5">
              <SummaryMetric
                icon={<ShieldCheck className="h-4.5 w-4.5" />}
                tone="sky"
                title="Selecciones"
                detail="48 listas para validar"
                value="48"
              />
              <SummaryMetric
                icon={<Users className="h-4.5 w-4.5" />}
                tone="gold"
                title="Planteles"
                detail="26 convocados por seleccion"
                value="26"
              />
              <SummaryMetric
                icon={<CheckCircle2 className="h-4.5 w-4.5" />}
                tone="emerald"
                title="Resultado esperado"
                detail="Preview de cambios antes de guardar"
                value="OK"
              />
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

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Importar selecciones
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Identidad y estructura inicial
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Define de donde vendran los paises, como se agruparan y que
                  campos de identidad se van a completar o reemplazar.
                </p>
              </div>

              <div className="relative min-w-[220px] max-w-[320px]">
                <Input
                  placeholder="Filtrar por fuente o tipo"
                  className="h-11 rounded-2xl border-white/10 bg-white/8 text-white placeholder:text-white/38"
                />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {importSelectionRows.map((item) => (
                <ImportCard key={item.title} {...item} />
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Importar planteles
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Convocados y datos complementarios
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  En la misma página, la parte de planteles se siente como segundo
                  paso natural: eliges fuente, revisas duplicados y disparas la carga.
                </p>
              </div>

              <div className="relative min-w-[220px] max-w-[320px]">
                <Input
                  placeholder="Seleccion activa: Argentina"
                  className="h-11 rounded-2xl border-white/10 bg-white/8 text-white placeholder:text-white/38"
                />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {importPlantelRows.map((item) => (
                <ImportCard key={item.title} {...item} />
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Resultado esperado
              </p>
              <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                Preview de la importacion en la misma page
              </h2>
              <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                Este bloque simula como se veria el feedback luego de importar, sin
                mandarte a otra pantalla ni abrir un flujo aparte.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {previewResults.map((item) => (
                <article
                  key={item.title}
                  className={`rounded-[24px] p-5 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        {item.detail}
                      </p>
                    </div>
                    <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                      {item.badge}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </BrandPageShell>
  );
}

function ImportCard({
  title,
  description,
  cta,
  status,
  icon,
  tone,
}: {
  title: string;
  description: string;
  cta: string;
  status: string;
  icon: typeof FileSpreadsheet;
  tone: "sky" | "gold";
}) {
  const Icon = icon;
  const toneClassName =
    tone === "gold"
      ? "bg-[#FAB438]/14 text-[#FFE4A3]"
      : "bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <article className={`rounded-[24px] p-5 ${DASHBOARD_SUBCARD}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-black text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-white/68">{description}</p>
          </div>
        </div>

        <Badge className="rounded-full border-white/10 bg-white/10 text-white/76 hover:bg-white/10">
          {status}
        </Badge>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button className="rounded-2xl bg-[#5993B6] text-white hover:bg-[#4B84A6]">
          {cta}
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl border-white/12 bg-white/8 text-white hover:bg-white/12"
        >
          Ver campos
        </Button>
      </div>
    </article>
  );
}

function SummaryMetric({
  icon,
  tone,
  title,
  detail,
  value,
}: {
  icon: ReactNode;
  tone: "sky" | "gold" | "emerald";
  title: string;
  detail: string;
  value: string;
}) {
  const toneClassName =
    tone === "gold"
      ? "bg-[#FAB438]/14 text-[#FFE4A3]"
      : tone === "emerald"
        ? "bg-emerald-400/14 text-emerald-200"
        : "bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <div
      className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
          {detail}
        </span>
      </span>
      <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
        {value}
      </span>
    </div>
  );
}
