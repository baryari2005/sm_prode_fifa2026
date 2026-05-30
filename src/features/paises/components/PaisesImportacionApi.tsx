"use client";

import { CirclePlus, RefreshCcw, Sigma } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ImportacionMetricCard } from "@/features/importaciones/components/ImportacionMetricCard";
import { DASHBOARD_PANEL, DASHBOARD_SUBCARD, DASHBOARD_TOP_LINE, DASHBOARD_TOP_LINE_GLOW, DASHBOARD_TOP_LINE_HAIR, DASHBOARD_TOP_LINE_INNER, DASHBOARD_TOP_LINE_SWEEP } from "@/features/dashboard/components/home/dashboard-home.styles";

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
    return "border-emerald-400/20 bg-emerald-400/14 text-emerald-100";
  }

  if (normalizedStatus.includes("actualizada")) {
    return "border-sky-400/20 bg-sky-400/14 text-sky-100";
  }

  if (normalizedStatus.includes("omitido")) {
    return "border-amber-400/20 bg-amber-400/14 text-amber-100";
  }

  return "border-white/10 bg-white/10 text-white/80";
}

export function PaisesImportacionApi({ result }: PaisesImportacionApiProps) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <ImportacionMetricCard
          icon={<Sigma className="h-4.5 w-4.5" />}
          toneClassName="bg-[#5993B6]/18 text-[#AEEBFF]"
          title="Total API"
          detail="Equipos listados en la fuente"
          value={result?.meta?.totalApi ?? 0}
        />
        <ImportacionMetricCard
          icon={<CirclePlus className="h-4.5 w-4.5" />}
          toneClassName="bg-emerald-400/14 text-emerald-200"
          title="Creadas"
          detail="Selecciones nuevas en el sistema"
          value={result?.meta?.created ?? 0}
        />
        <ImportacionMetricCard
          icon={<RefreshCcw className="h-4.5 w-4.5" />}
          toneClassName="bg-[#FAB438]/14 text-[#FFE4A3]"
          title="Actualizadas"
          detail="Selecciones existentes sincronizadas"
          value={result?.meta?.updated ?? 0}
        />
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Estado
          </p>
          <p className="mt-3 text-sm leading-6 text-white/72">
            {result?.message ??
              "Todavia no ejecutaste la importacion de selecciones."}
          </p>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Detalle por seleccion
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Aqui ves equipo API, estado de sincronizacion y la seleccion local asociada.
            </p>
          </div>

          {result?.results?.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {result.results.map((item, index) => (
                <article
                  key={`${item.team}-${item.status}-${index}`}
                  className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white">{item.team}</p>
                      <p className="mt-1 text-sm text-white/64">
                        {item.seleccion ?? "Sin asociacion local"}
                      </p>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`rounded-full ${getStatusClass(item.status)}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`rounded-[24px] p-6 text-center ${DASHBOARD_SUBCARD}`}>
              <p className="text-sm leading-6 text-white/64">
                Cuando ejecutes la importacion, aca vas a ver el detalle completo.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
