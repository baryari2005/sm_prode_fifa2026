"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileSpreadsheet,
  FileUp,
  Globe2,
  RefreshCw,
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
import { ImportacionActionCard } from "@/features/importaciones/components/ImportacionActionCard";
import { ImportacionMetricCard } from "@/features/importaciones/components/ImportacionMetricCard";
import { ImportResponse, PlantelesImportacionMasiva } from "@/features/planteles/components/PlantelesImportacionMasiva";
import {
  mapRowsToPlantelesBySeleccion,
  parseImportFile,
} from "@/features/partidos/services/fixture-import.service";
import { importPlantel } from "@/features/partidos/services/plantel.service";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

type SeleccionLookup = {
  id: string;
  nombre: string;
  codigo: string;
};

type SeleccionesResponse = {
  data?: SeleccionLookup[];
};

export default function PlantelesImportarPage() {
  const router = useRouter();
  const canVerPlanteles = useCan("planteles", "ver");
  const canImport = useCan("planteles", "importar");
  const [importing, setImporting] = useState(false);
  const [importingExcel, setImportingExcel] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [selecciones, setSelecciones] = useState<SeleccionLookup[]>([]);
  const [selectedExcelFileName, setSelectedExcelFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadSelecciones() {
      try {
        const response = await axiosInstance.get<SeleccionesResponse>(
          "/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc",
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        setSelecciones(response.data.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar las selecciones para importar planteles");
      }
    }

    void loadSelecciones();
  }, []);

  if (!canVerPlanteles) {
    return <AccessDenied403Page />;
  }

  async function handleImport() {
    try {
      setImporting(true);

      const response = await axiosInstance.post<ImportResponse>(
        "/planteles/import-api",
      );
      setResult(response.data);

      toast.success(response.data.message ?? "Importacion de planteles completada");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo completar la importacion masiva de planteles");
    } finally {
      setImporting(false);
    }
  }

  async function handleImportExcel(file: File | null) {
    if (!file) return;

    try {
      setImportingExcel(true);
      setSelectedExcelFileName(file.name);

      const rows = await parseImportFile(file);
      const { itemsBySeleccionId, missingSelections, ignoredRows } = mapRowsToPlantelesBySeleccion(
        rows,
        selecciones,
      );

      const summaries: NonNullable<ImportResponse["meta"]>["summaries"] = [];
      let importedSelections = 0;
      let importedPlayers = 0;

      for (const [seleccionId, items] of itemsBySeleccionId.entries()) {
        const seleccion = selecciones.find((item) => item.id === seleccionId);

        try {
          const response = await importPlantel(seleccionId, items);

          importedSelections += 1;
          importedPlayers += response.summary.imported;

          summaries.push({
            seleccionId,
            seleccionNombre: seleccion?.nombre ?? null,
            success: true,
            imported: response.summary.imported,
            cleared: response.summary.cleared,
            message: `Importado desde Excel (${response.summary.imported} jugadores).`,
          });
        } catch (error) {
          console.error(error);
          summaries.push({
            seleccionId,
            seleccionNombre: seleccion?.nombre ?? null,
            success: false,
            imported: 0,
            cleared: 0,
            message: "No se pudo importar esta seleccion desde el Excel.",
          });
        }
      }

      for (const missing of missingSelections) {
        summaries.push({
          seleccionId: `missing-${missing.selectionCode ?? missing.selectionName ?? Math.random().toString(36).slice(2, 8)}`,
          seleccionNombre: missing.selectionName ?? missing.selectionCode ?? "Seleccion no identificada",
          success: false,
          imported: 0,
          cleared: 0,
          message: `No se encontro una seleccion activa que coincida con ${
            missing.selectionCode ? `codigo ${missing.selectionCode}` : "el nombre del Excel"
          }. Filas afectadas: ${missing.rowCount}.`,
        });
      }

      const failedSelections = summaries.filter((item) => !item.success).length;
      const ignoredRowsCount = ignoredRows.reduce(
        (total, item) => total + item.rowCount,
        0,
      );

      setResult({
        message: `Importacion desde Excel completada. ${importedPlayers} jugadores importados en ${importedSelections} selecciones.${
          ignoredRowsCount > 0 ? ` Filas omitidas: ${ignoredRowsCount}.` : ""
        }`,
        meta: {
          importedSelections,
          importedPlayers,
          failedSelections,
          ignoredRowsCount,
          ignoredRows,
          summaries,
        },
      });

      toast.success(
        `Importacion desde Excel completada. ${importedPlayers} jugadores importados.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo procesar el archivo Excel de planteles");
    } finally {
      setImportingExcel(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
                  Importacion de planteles
                </div>

                <div className="mt-6 space-y-2.5 xl:mt-8">
                  <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                    Carga masiva de <span className="text-[#5993B6]">convocados</span>
                  </h1>

                  <p className="font-brand max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                    Planteles completos y resultado por seleccion
                  </p>

                  <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                    Ejecuta la importacion en serie desde la API y revisa abajo
                    el estado de cada seleccion sin salir del dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-6 xl:pt-8 2xl:pt-10">
                  <Link href="/admin/planteles">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Volver a selecciones
                    </Button>
                  </Link>

                </div>
              </div>

              <div className="pointer-events-none absolute bottom-[-18px] right-[-22px] z-20 hidden h-[336px] w-[288px] xl:block 2xl:bottom-[-26px] 2xl:right-[-14px] 2xl:h-[408px] 2xl:w-[344px]">
                <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
                <div className="absolute inset-x-[-8%] top-[18%] h-[52%] rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.16)_36%,rgba(30,44,70,0.08)_64%,transparent_92%)] blur-[34px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
                <HeroVisualImage
                  src={brandImages.mascots.importar}
                  alt=""
                  sizes="(min-width: 1536px) 430px, 360px"
                  baseClassName="relative object-contain object-[center_bottom] drop-shadow-[0_28px_64px_rgba(0,0,0,0.34)] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_12%,rgba(0,0,0,0.92)_22%,rgba(0,0,0,0.98)_50%,rgba(0,0,0,0.92)_78%,rgba(0,0,0,0.55)_88%,transparent_100%),radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_12%,rgba(0,0,0,0.92)_22%,rgba(0,0,0,0.98)_50%,rgba(0,0,0,0.92)_78%,rgba(0,0,0,0.55)_88%,transparent_100%),radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
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
                title="Resumen lateral"
                description="Estado rapido del lote, de la fuente y del resultado esperado por plantel."
              />

              <div className="space-y-2.5">
                <ImportacionMetricCard
                  icon={<Users className="h-4.5 w-4.5" />}
                  toneClassName="bg-[#5993B6]/18 text-[#AEEBFF]"
                  title="Modo de carga"
                  detail="Importacion por API o por Excel"
                  value="DUAL"
                />
                <ImportacionMetricCard
                  icon={<RefreshCw className="h-4.5 w-4.5" />}
                  toneClassName="bg-[#FAB438]/14 text-[#FFE4A3]"
                  title="Cobertura esperada"
                  detail="Todas las selecciones disponibles"
                  value="48"
                />
                <ImportacionMetricCard
                  icon={<ShieldCheck className="h-4.5 w-4.5" />}
                  toneClassName="bg-emerald-400/14 text-emerald-200"
                  title="Resultado esperado"
                  detail="Resumen por seleccion al terminar"
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
                  Importar planteles
                </p>
                <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                  Convocados por lote completo
                </h2>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                  Elegi si queres importar el lote completo desde la API o desde
                  un Excel agrupado por seleccion, y valida debajo cuantas
                  selecciones entraron bien, cuantos jugadores se cargaron y
                  donde hubo errores.
                </p>
              </div>

              <div className="relative min-w-[220px] max-w-[320px]">
                <Input
                  value={
                    selectedExcelFileName
                      ? `Excel seleccionado: ${selectedExcelFileName}`
                      : "Fuente activa: API o Excel"
                  }
                  readOnly
                  className="h-11 rounded-2xl border-white/10 bg-white/8 text-white placeholder:text-white/38"
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.json"
              className="hidden"
              onChange={(event) =>
                void handleImportExcel(event.target.files?.[0] ?? null)
              }
            />

            <div className="grid gap-4 xl:grid-cols-3">
              <ImportacionActionCard
                icon={Globe2}
                title="Importar todos los planteles por API"
                description="Recorre las selecciones disponibles, ejecuta la carga de convocados y arma el resumen por seleccion al finalizar."
                ctaLabel="Importar planteles"
                statusLabel="Lote completo"
                busy={importing}
                busyLabel="Importando..."
                disabled={!canImport}
                onClick={() => void handleImport()}
              />

              <ImportacionActionCard
                icon={FileUp}
                title="Importar planteles por Excel"
                description="Procesa el archivo, agrupa filas por codigo o nombre de seleccion y reemplaza cada plantel usando el mismo flujo actual."
                ctaLabel="Seleccionar Excel"
                statusLabel="Archivo agrupado"
                tone="gold"
                busy={importingExcel}
                busyLabel="Procesando Excel..."
                disabled={!canImport || selecciones.length === 0}
                onClick={() => fileInputRef.current?.click()}
              />

              <ImportacionActionCard
                icon={FileSpreadsheet}
                tone="gold"
                title="Paso previo"
                description="Si antes quieres validar grupos, confederaciones o teamId, puedes volver al flujo de selecciones y luego retomar planteles."
                ctaLabel="Ir a importar selecciones"
                statusLabel="Flujo relacionado"
                onClick={() => router.push("/admin/paises/importar")}
              />
            </div>

            <PlantelesImportacionMasiva result={result} />
          </div>
        </section>
      </div>
    </main>
  );
}
