"use client";

import { AlertTriangle, CirclePlus, CircleX, Sigma } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
      return "border-emerald-300/18 bg-emerald-300/10 text-emerald-100";
    case "updated":
      return "border-sky-300/18 bg-sky-300/10 text-sky-100";
    case "existing":
      return "border-white/10 bg-white/10 text-white";
    case "omitted":
      return "border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3]";
    case "error":
      return "border-rose-300/18 bg-rose-300/10 text-rose-100";
    default:
      return "border-white/10 bg-white/10 text-white";
  }
}

export function PartidosImportacionApi({
  result,
}: PartidosImportacionApiProps) {
  const errores =
    result?.resultados.filter((item) => item.action === "error") ?? [];

  const metrics = [
    {
      icon: Sigma,
      title: "Total API",
      value: result?.meta?.totalApi ?? 0,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      icon: CirclePlus,
      title: "Creados",
      value: result?.meta?.creados ?? 0,
      toneClass: "bg-emerald-300/10 text-emerald-100",
    },
    {
      icon: AlertTriangle,
      title: "Omitidos",
      value: result?.meta?.omitidos ?? 0,
      toneClass: "bg-[#FAB438]/10 text-[#FFE4A3]",
    },
    {
      icon: CircleX,
      title: "Errores",
      value: result?.meta?.fallidos ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
  ];

  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1]"
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-[18px] ${metric.toneClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/62">
                {metric.title}
              </p>
              <p className="mt-2 font-brand text-[2rem] leading-none tracking-[0.04em] text-white">
                {metric.value}
              </p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
        <p className="text-sm font-semibold text-white">Resultado</p>
        <p className="mt-1 text-sm text-white/72">
          {result?.message ?? "Todavia no ejecutaste la importacion del fixture."}
        </p>
        {result?.meta ? (
          <p className="mt-2 text-xs leading-5 text-white/52">
            Fase importada:{" "}
            {result.meta.fase
              ? getFixturePhaseLabel(result.meta.fase as FixturePhaseSlug)
              : "Todas las fases"}
            . Procesados: {result.meta.totalProcesados ?? 0}. Total en base
            despues de sincronizar: {result.meta.totalEnBase ?? 0}.
          </p>
        ) : null}
      </section>

      <section className="rounded-[24px] border border-rose-300/18 bg-rose-300/[0.07] p-4">
        <p className="text-sm font-semibold text-rose-100">Partidos con error</p>
        {errores.length > 0 ? (
          <div className="mt-3 space-y-2">
            {errores.map((item) => (
              <article
                key={`error-${item.partidoApiId ?? item.message}`}
                className="rounded-[20px] border border-rose-300/18 bg-[#2A3751]/72 px-4 py-3"
              >
                <p className="text-sm font-medium text-white">
                  Partido API ID: {item.partidoApiId ?? "Sin id"}
                </p>
                <p className="mt-1 text-sm text-white/68">{item.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-white/68">
            No hay errores registrados en la ultima corrida.
          </p>
        )}
      </section>

      <section className="rounded-[24px] border border-white/10 bg-[#1E2C46]/72">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Detalle por partido</h2>
        </div>

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
                <TableRow key={`${item.partidoApiId ?? "row"}-${item.message}`}>
                  <TableCell>{item.partidoApiId ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getActionClass(item.action)}
                    >
                      {getActionLabel(item.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-white/72">
                    {item.message}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-sm text-white/54"
                >
                  Cuando ejecutes la importacion, aca vas a ver el detalle completo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
