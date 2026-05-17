"use client";


import { useMemo } from "react";
import { CirclePlus,  Sigma, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultMetricCard } from "@/components/ui/result-metric-card";

type ImportSummary = {
  seleccionId: string;
  seleccionNombre?: string | null;
  success: boolean;
  imported: number;
  cleared: number;
  message?: string | null;
};

export type ImportResponse = {
  message?: string;
  meta?: {
    importedSelections?: number;
    importedPlayers?: number;
    failedSelections?: number;
    summaries?: ImportSummary[];
  };
};

type PlantelesImportacionMasivaProps = {
  result: ImportResponse | null;
};

export function PlantelesImportacionMasiva({ result }: PlantelesImportacionMasivaProps) {  
  const summaries = result?.meta?.summaries ?? [];
  const successCount = result?.meta?.importedSelections ?? 0;
  const importedPlayers = result?.meta?.importedPlayers ?? 0;
  const failedCount = result?.meta?.failedSelections ?? 0;

  const statusLabel = useMemo(() => {
    if (!result) return "Todavia no se ejecuto la importacion masiva.";
    return result.message ?? "Importacion finalizada.";
  }, [result]);



  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <ResultMetricCard
          icono={Sigma}
          titulo="Selecciones importadas"
          resultado={successCount}
          descripcion="Selecciones cargadas exitosamente"
        />
        <ResultMetricCard
          icono={CirclePlus}
          titulo="Jugadores cargados"
          resultado={importedPlayers}
          descripcion="Jugadores agregados al sistema"
        />
        <ResultMetricCard
          icono={TriangleAlert}
          titulo="Selecciones con error"
          resultado={failedCount}
          descripcion="Selecciones que no pudieron ser importadas"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-sm font-semibold text-slate-800">Estado</p>
        <p className="mt-1 text-sm text-slate-600">{statusLabel}</p>
        <p className="mt-3 text-xs text-slate-500">
          Esta pantalla ejecuta la importacion en serie y agrega pausas con reintentos cuando la API responde rate limit.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Resumen por plantel
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seleccion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Plantel anterior</TableHead>
                <TableHead className="text-right">Jugadores importados</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length > 0 ? (
                summaries.map((item) => (
                  <TableRow key={item.seleccionId}>
                    <TableCell className="font-medium">
                      {item.seleccionNombre ?? item.seleccionId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          item.success
                            ? "border-emerald-200 bg-emerald-100 text-emerald-900"
                            : "border-rose-200 bg-rose-100 text-rose-900"
                        }
                      >
                        {item.success ? "Importado" : "Error"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.cleared}</TableCell>
                    <TableCell className="text-right">{item.imported}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {item.message ?? (item.success ? "Sin novedades" : "No disponible")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Cuando ejecutes la importacion masiva, aca vas a ver el detalle por seleccion.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </>

  );
}
