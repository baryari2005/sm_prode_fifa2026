"use client";

import { RotateCcw, Sigma, Trash2, TriangleAlert, Users } from "lucide-react";

import { ResultMetricCard } from "@/components/ui/result-metric-card";

export type ResetPartidosResponse = {
  message: string;
  meta?: {
    totalApi?: number;
    partidosEliminados?: number;
    resultadosEliminados?: number;
    prediccionesEliminadas?: number;
    plantelesEliminados?: number;
    seleccionesEliminadas?: number;
    creados?: number;
    omitidos?: number;
    fallidos?: number;
  };
};

type PartidosResetImportacionProps = {
  summary: ResetPartidosResponse | null;
};

export function PartidosResetImportacion({
  summary,
}: PartidosResetImportacionProps) {
  return (
    <>
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <p className="text-sm font-semibold text-rose-900">
          Que hace esta accion
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
          <li>Elimina todos los partidos actuales.</li>
          <li>Elimina todos los resultados asociados.</li>
          <li>Elimina predicciones de partidos y reinicia ranking.</li>
          <li>Elimina selecciones y planteles actuales.</li>
          <li>Vuelve a crear el fixture usando lo que devuelve la API.</li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ResultMetricCard
          icono={Users}
          titulo="Selecciones eliminadas"
          resultado={summary?.meta?.seleccionesEliminadas ?? 0}
        />
        <ResultMetricCard
          icono={Trash2}
          titulo="Planteles eliminados"
          resultado={summary?.meta?.plantelesEliminados ?? 0}
        />
        <ResultMetricCard
          icono={Trash2}
          titulo="Partidos eliminados"
          resultado={summary?.meta?.partidosEliminados ?? 0}
        />
        <ResultMetricCard
          icono={Trash2}
          titulo="Resultados eliminados"
          resultado={summary?.meta?.resultadosEliminados ?? 0}
        />
        <ResultMetricCard
          icono={Trash2}
          titulo="Predicciones eliminadas"
          resultado={summary?.meta?.prediccionesEliminadas ?? 0}
        />
        <ResultMetricCard
          icono={RotateCcw}
          titulo="Partidos recreados"
          resultado={summary?.meta?.creados ?? 0}
        />
        <ResultMetricCard
          icono={Sigma}
          titulo="Omitidos"
          resultado={summary?.meta?.omitidos ?? 0}
        />
        <ResultMetricCard
          icono={TriangleAlert}
          titulo="Errores"
          resultado={summary?.meta?.fallidos ?? 0}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-sm font-semibold text-slate-800">Resultado</p>
        <p className="mt-1 text-sm text-slate-600">
          {summary?.message ??
            "Todavia no ejecutaste la reimportacion total del fixture."}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Total recibido desde API: {summary?.meta?.totalApi ?? 0}
        </p>
      </section>
    </>
  );
}
