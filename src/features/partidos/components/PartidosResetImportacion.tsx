"use client";

import { RefreshCcw, Sigma, Trash2, TriangleAlert, Users } from "lucide-react";

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
  const metrics = [
    {
      icon: Users,
      title: "Selecciones eliminadas",
      value: summary?.meta?.seleccionesEliminadas ?? 0,
      toneClass: "bg-[#5993B6]/18 text-[#AEEBFF]",
    },
    {
      icon: Trash2,
      title: "Planteles eliminados",
      value: summary?.meta?.plantelesEliminados ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
    {
      icon: Trash2,
      title: "Partidos eliminados",
      value: summary?.meta?.partidosEliminados ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
    {
      icon: Trash2,
      title: "Resultados eliminados",
      value: summary?.meta?.resultadosEliminados ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
    {
      icon: Trash2,
      title: "Predicciones eliminadas",
      value: summary?.meta?.prediccionesEliminadas ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
    {
      icon: RefreshCcw,
      title: "Partidos recreados",
      value: summary?.meta?.creados ?? 0,
      toneClass: "bg-[#FAB438]/10 text-[#FFE4A3]",
    },
    {
      icon: Sigma,
      title: "Omitidos",
      value: summary?.meta?.omitidos ?? 0,
      toneClass: "bg-white/10 text-white",
    },
    {
      icon: TriangleAlert,
      title: "Errores",
      value: summary?.meta?.fallidos ?? 0,
      toneClass: "bg-rose-300/10 text-rose-100",
    },
  ];

  return (
    <>
      <section className="rounded-[24px] border border-rose-300/18 bg-rose-300/[0.07] p-4">
        <p className="text-sm font-semibold text-rose-100">Que hace esta accion</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-white/72">
          <li>Elimina todos los partidos actuales.</li>
          <li>Elimina todos los resultados asociados.</li>
          <li>Elimina predicciones de partidos y reinicia ranking.</li>
          <li>Elimina selecciones y planteles actuales.</li>
          <li>Vuelve a crear el fixture usando lo que devuelve la API.</li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
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
          {summary?.message ??
            "Todavia no ejecutaste la reimportacion total del fixture."}
        </p>
        <p className="mt-2 text-xs text-white/52">
          Total recibido desde API: {summary?.meta?.totalApi ?? 0}
        </p>
      </section>
    </>
  );
}
