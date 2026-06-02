"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileSpreadsheet,
  Globe2,
  Languages,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandImages } from "@/config/brand-images";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { PaisesImportacionApi, type PaisesImportResponse } from "@/features/paises/components/PaisesImportacionApi";
import { ImportacionActionCard } from "@/features/importaciones/components/ImportacionActionCard";
import { ImportacionMetricCard } from "@/features/importaciones/components/ImportacionMetricCard";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

export default function PaisesImportarPage() {
  const router = useRouter();
  const canVerPaises = useCan("paises", "ver");
  const canImport = useCan("paises", "importar");

  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<PaisesImportResponse | null>(null);

  if (!canVerPaises) {
    return <AccessDenied403Page />;
  }

  async function handleImport() {
    try {
      setImporting(true);
      const response =
        await axiosInstance.post<PaisesImportResponse>("/paises/import-api");

      setResult(response.data);
      toast.success(
        response.data.message ??
          "Selecciones sincronizadas correctamente desde la API",
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron importar las selecciones desde la API");
    } finally {
      setImporting(false);
    }
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
            <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
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
                  Importacion de selecciones
                </div>

                <div className="mt-6 space-y-2.5 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Carga masiva de <span className="text-[#5993B6]">selecciones</span>
                  </h1>

                  <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Estructura, grupos e identidad inicial
                  </p>

                  <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                    Sincroniza paises desde la API, revisá los cambios y valida
                    rapidamente grupos, confederaciones y teamId sin salir del flujo.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1 xl:pt-3 2xl:pt-5">
                  <Link href="/admin/paises">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Volver a planteles
                    </Button>
                  </Link>
                  
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-[4px] right-[-28px] z-20 hidden h-[420px] w-[360px] xl:block 2xl:bottom-[-2px] 2xl:right-[-18px] 2xl:h-[510px] 2xl:w-[430px]">
                <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
                <div className="absolute inset-x-[-8%] top-[18%] h-[52%] rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.16)_36%,rgba(30,44,70,0.08)_64%,transparent_92%)] blur-[34px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
                <HeroVisualImage
                  src={brandImages.mascots.importar}
                  alt=""
                  sizes="(min-width: 1536px) 430px, 360px"
                  baseClassName="relative object-contain object-[center_bottom] drop-shadow-[0_28px_64px_rgba(0,0,0,0.34)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
                  loadedClassName="scale-100 opacity-[0.78]"
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
              
              <LateralSummaryHeader
                title="Vista rápida"
                description="Estado rapido del flujo y de los campos que se van a actualizar."
              />

              <div className="space-y-2.5">
                <ImportacionMetricCard
                  icon={<Globe2 className="h-4.5 w-4.5" />}
                  toneClassName="bg-[#5993B6]/18 text-[#AEEBFF]"
                  title="Fuente principal"
                  detail="Football-data.org"
                  value="API"
                />
                <ImportacionMetricCard
                  icon={<Languages className="h-4.5 w-4.5" />}
                  toneClassName="bg-[#FAB438]/14 text-[#FFE4A3]"
                  title="Campos sensibles"
                  detail="Nombre, grupo y confederacion"
                  value="3"
                />
                <ImportacionMetricCard
                  icon={<ShieldCheck className="h-4.5 w-4.5" />}
                  toneClassName="bg-emerald-400/14 text-emerald-200"
                  title="Resultado esperado"
                  detail="Preview antes de seguir al detalle"
                  value="OK"
                />
              </div>
            </aside>
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
                  Importar selecciones
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Identidad y estructura inicial
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Ejecuta la sincronizacion principal y luego revisá abajo el
                  resultado por seleccion con el detalle completo.
                </p>
              </div>

              <div className="relative min-w-[220px] max-w-[320px]">
                <Input
                  placeholder="Fuente activa: API oficial"
                  className="h-11 rounded-2xl border-white/10 bg-white/8 text-white placeholder:text-white/38"
                />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <ImportacionActionCard
                icon={FileSpreadsheet}
                title="Importar desde API oficial"
                description="Trae nombre, codigo, grupo, confederacion y teamId para completar o actualizar selecciones."
                ctaLabel="Sincronizar selecciones"
                statusLabel="48 disponibles"
                busy={importing}
                busyLabel="Importando..."
                disabled={!canImport}
                onClick={() => void handleImport()}
              />

              <ImportacionActionCard
                icon={Users}
                tone="gold"
                title="Paso siguiente"
                description="Cuando termines con las selecciones, puedes continuar a la importacion de planteles usando el flujo dedicado."
                ctaLabel="Ir a importar planteles"
                statusLabel="Flujo relacionado"
                onClick={() => router.push("/admin/planteles/importar")}
              />
            </div>

            <PaisesImportacionApi result={result} />
          </div>
        </section>
      </div>
    </main>
  );
}
