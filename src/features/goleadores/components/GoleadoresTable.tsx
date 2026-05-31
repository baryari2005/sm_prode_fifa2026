"use client";

import { Goal, SearchX, ShieldQuestion, Shirt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FlagImage } from "@/components/ui/flag-image";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { Goleador } from "@/features/goleadores/types/types";
import { cn } from "@/lib/utils";

type Props = {
  goleadores: Goleador[];
  totalGoleadores?: number;
  busqueda?: string;
};

export function GoleadoresTable({
  goleadores,
  totalGoleadores = goleadores.length,
  busqueda = "",
}: Props) {
  const hasActiveSearch = busqueda.trim().length > 0;
  const isEmptyBySearch = hasActiveSearch && totalGoleadores > 0;

  if (goleadores.length === 0) {
    return (
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-5 md:p-6`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#5993B6]/26 bg-[#213450]/72 px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/8 text-[#FFE4A3]">
            {isEmptyBySearch ? <SearchX className="h-7 w-7" /> : <Goal className="h-7 w-7" />}
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isEmptyBySearch ? "No hay resultados para esa búsqueda" : "Todavía no hay goleadores cargados."}
            </h3>
            <p className="max-w-[560px] text-sm leading-6 text-white/72">
              {isEmptyBySearch
                ? "Probá con otro jugador, selección o posición para volver a cruzar la tabla."
                : "Podés cargar datos desde la API o desde mock para iniciar la tabla."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="relative z-10 space-y-5">
        <div className="space-y-2">
          <Badge className="rounded-full border border-[#5993B6]/22 bg-[#5993B6]/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF] hover:bg-[#5993B6]/14">
            Tabla operativa
          </Badge>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="brand-heading text-[2rem] text-white md:text-[2.35rem]">
                Goleadores del Mundial
              </h2>
              <p className="max-w-[760px] text-sm leading-6 text-white/72">
                Mantenemos las mismas columnas y datos reales, ahora con una lectura compacta para desktop y mobile.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/84">
              {goleadores.length} resultado{goleadores.length === 1 ? "" : "s"} visible{goleadores.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {goleadores.map((goleador, index) => (
            <article
              key={goleador.id}
              className={`${DASHBOARD_SUBCARD} rounded-[24px] border border-white/10 p-4 text-white`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black",
                      getRankTone(index),
                    )}
                  >
                    #{index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-white">{goleador.nombre}</p>
                    <p className="truncate text-xs text-white/62">{goleador.nacionalidad}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FAB438]/20 bg-[#FAB438]/12 px-3 py-2 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFE4A3]">
                    Goles
                  </p>
                  <p className="mt-1 text-2xl font-black leading-none text-[#FFE4A3]">
                    {goleador.goles}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#294564]">
                  <FlagImage
                    bandera={goleador.escudo}
                    codigo={goleador.codigoSeleccion}
                    nombre={goleador.seleccion}
                    widthClassName="w-8"
                    heightClassName="h-8"
                    fallbackClassName="text-[#AEEBFF]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{goleador.seleccion}</p>
                  <p className="truncate text-xs text-white/62">{goleador.codigoSeleccion}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MobileMetric label="Asist." value={goleador.asistencias} icon={Goal} />
                <MobileMetric label="Pen." value={goleador.penales} icon={ShieldQuestion} />
                <MobileMetric label="PJ" value={goleador.partidosJugados} icon={Shirt} />
                <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                    Posición
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{goleador.posicion}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-[28px] border border-white/10 bg-[#16263F]/88 md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#20314D]">
                <tr className="text-left text-[11px] font-black uppercase tracking-[0.22em] text-[#AEEBFF]">
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4">Jugador</th>
                  <th className="px-4 py-4">Selección</th>
                  <th className="px-4 py-4 text-center">Goles</th>
                  <th className="px-4 py-4 text-center">Asist.</th>
                  <th className="px-4 py-4 text-center">Pen.</th>
                  <th className="px-4 py-4 text-center">PJ</th>
                  <th className="px-4 py-4">Posición</th>
                </tr>
              </thead>

              <tbody>
                {goleadores.map((goleador, index) => (
                  <tr
                    key={goleador.id}
                    className="border-t border-[#5993B6]/16 text-sm text-white/84 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-black",
                          getRankTone(index),
                        )}
                      >
                        #{index + 1}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="min-w-[220px]">
                        <div className="font-bold text-white">{goleador.nombre}</div>
                        <div className="mt-1 text-xs text-white/56">{goleador.nacionalidad}</div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex min-w-[190px] items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#294564]">
                          <FlagImage
                            bandera={goleador.escudo}
                            codigo={goleador.codigoSeleccion}
                            nombre={goleador.seleccion}
                            widthClassName="w-8"
                            heightClassName="h-8"
                            fallbackClassName="text-[#AEEBFF]"
                          />
                        </span>

                        <div className="min-w-0">
                          <div className="truncate font-semibold text-white">{goleador.seleccion}</div>
                          <div className="text-xs text-white/56">{goleador.codigoSeleccion}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xl font-black text-[#FFE4A3]">{goleador.goles}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">{goleador.asistencias}</td>
                    <td className="px-4 py-3.5 text-center">{goleador.penales}</td>
                    <td className="px-4 py-3.5 text-center">{goleador.partidosJugados}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/84">
                        {goleador.posicion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Goal;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-3">
      <div className="flex items-center gap-2 text-[#AEEBFF]">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function getRankTone(index: number) {
  if (index === 0) {
    return "border-[#FAB438]/24 bg-[#FAB438]/14 text-[#FFE4A3]";
  }

  if (index === 1) {
    return "border-[#5993B6]/28 bg-[#5993B6]/16 text-[#AEEBFF]";
  }

  if (index === 2) {
    return "border-emerald-300/22 bg-emerald-300/12 text-emerald-100";
  }

  return "border-white/10 bg-white/[0.06] text-white/84";
}
