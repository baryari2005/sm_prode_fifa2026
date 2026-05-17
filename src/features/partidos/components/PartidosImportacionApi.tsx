"use client";

import { AlertTriangle, CirclePlus, CircleX, Sigma } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ResultMetricCard } from "@/components/ui/result-metric-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFixturePhaseLabel,
  type FixturePhaseSlug,
} from "@/features/partidos/constants/fixture-phase-filter.constants";
import type {
  CargaPartidosApiItem,
  CargaPartidosApiResult,
} from "@/features/partidos/services/partidos.service";

type PartidosImportacionApiProps = {
  result: CargaPartidosApiResult | null;
};

function getActionLabel(action: CargaPartidosApiItem["action"]) {
  switch (action) {
    case "created":
      return "Creado";
    case "updated":
      return "Actualizado";
    case "existing":
      return "Existente";
    case "omitted":
      return "Omitido";
    case "error":
      return "Error";
    default:
      return action;
  }
}

function getActionClass(action: CargaPartidosApiItem["action"]) {
  switch (action) {
    case "created":
      return "border-emerald-200 bg-emerald-100 text-emerald-900";
    case "updated":
      return "border-sky-200 bg-sky-100 text-sky-900";
    case "existing":
      return "border-slate-200 bg-slate-100 text-slate-900";
    case "omitted":
      return "border-amber-200 bg-amber-100 text-amber-900";
    case "error":
      return "border-rose-200 bg-rose-100 text-rose-900";
    default:
      return "border-slate-200 bg-slate-100 text-slate-900";
  }
}

export function PartidosImportacionApi({
  result,
}: PartidosImportacionApiProps) {
  const errores =
    result?.resultados.filter((item) => item.action === "error") ?? [];

  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        <ResultMetricCard
          icono={Sigma}
          titulo="Total API"
          resultado={result?.meta?.totalApi ?? 0}
        />
        <ResultMetricCard
          icono={CirclePlus}
          titulo="Creados"
          resultado={result?.meta?.creados ?? 0}
        />
        <ResultMetricCard
          icono={AlertTriangle}
          titulo="Omitidos"
          resultado={result?.meta?.omitidos ?? 0}
        />
        <ResultMetricCard
          icono={CircleX}
          titulo="Errores"
          resultado={result?.meta?.fallidos ?? 0}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-sm font-semibold text-slate-800">Resultado</p>
        <p className="mt-1 text-sm text-slate-600">
          {result?.message ?? "Todavia no ejecutaste la importacion del fixture."}
        </p>
        {result?.meta ? (
          <p className="mt-2 text-xs text-slate-500">
            Fase importada:{" "}
            {result.meta.fase
              ? getFixturePhaseLabel(result.meta.fase as FixturePhaseSlug)
              : "Todas las fases"}
            . Procesados: {result.meta.totalProcesados ?? 0}. Total en base
            despues de sincronizar: {result.meta.totalEnBase ?? 0}.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-sm font-semibold text-rose-900">Partidos con error</p>
        {errores.length > 0 ? (
          <div className="mt-3 space-y-2">
            {errores.map((item) => (
              <article
                key={`error-${item.partidoApiId ?? item.message}`}
                className="rounded-2xl border border-rose-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-900">
                  Partido API ID: {item.partidoApiId ?? "Sin id"}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            No hay errores registrados en la ultima corrida.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Detalle por partido
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API ID</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result?.resultados.length ? (
                result.resultados.map((item) => (
                  <TableRow
                    key={`${item.partidoApiId ?? "row"}-${item.message}`}
                  >
                    <TableCell>{item.partidoApiId ?? "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getActionClass(item.action)}
                      >
                        {getActionLabel(item.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {item.message}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    Cuando ejecutes la importacion, aca vas a ver el detalle
                    completo.
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
