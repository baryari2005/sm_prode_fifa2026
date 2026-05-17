"use client";

import { CirclePlus, RefreshCcw, Sigma } from "lucide-react";

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

export type PaisesImportResult = {
  team: string;
  status: string;
  seleccion?: string;
};

export type PaisesImportResponse = {
  message?: string;
  meta?: {
    totalApi?: number;
    updated?: number;
    created?: number;
  };
  results?: PaisesImportResult[];
};

type PaisesImportacionApiProps = {
  result: PaisesImportResponse | null;
};

function getStatusClass(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("creada")) {
    return "border-emerald-200 bg-emerald-100 text-emerald-900";
  }

  if (normalizedStatus.includes("actualizada")) {
    return "border-sky-200 bg-sky-100 text-sky-900";
  }

  if (normalizedStatus.includes("omitido")) {
    return "border-amber-200 bg-amber-100 text-amber-900";
  }

  return "border-slate-200 bg-slate-100 text-slate-900";
}

export function PaisesImportacionApi({ result }: PaisesImportacionApiProps) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <ResultMetricCard        
          icono={Sigma}
          titulo="Total API"
          resultado={result?.meta?.totalApi ?? 0}
        />

        <ResultMetricCard
          icono={CirclePlus}
          titulo="Creadas"
          resultado={result?.meta?.created ?? 0}
        />

        <ResultMetricCard
          icono={RefreshCcw}
          titulo="Actualizadas"
          resultado={result?.meta?.updated ?? 0}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-sm font-semibold text-slate-800">Resultado</p>
        <p className="mt-1 text-sm text-slate-600">
          {result?.message ??
            "Todavia no ejecutaste la importacion de selecciones."}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Detalle por seleccion
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo API</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Seleccion local</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {result?.results?.length ? (
                result.results.map((item, index) => (
                  <TableRow key={`${item.team}-${item.status}-${index}`}>
                    <TableCell className="font-medium">
                      {item.team}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusClass(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {item.seleccion ?? "-"}
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