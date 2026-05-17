// src/features/partidos/components/TablaPosiciones.tsx

import Image from "next/image";
import { Trophy } from "lucide-react";

import { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";
import { Button } from "@/components/ui/button";
import { resolveBanderaSrc } from "@/lib/flags";

interface TablaPosicionesProps {
  grupos: string[];
  grupoSeleccionado: string | null;
  onGrupoChange: (grupo: string | null) => void;
  tabla: PosicionEquipo[];
}

export function TablaPosiciones({
  grupos,
  grupoSeleccionado,
  onGrupoChange,
  tabla,
}: TablaPosicionesProps) {
  const gruposATabla =
    grupoSeleccionado === null
      ? grupos.map((grupo) => ({
          grupo,
          equipos: tabla.filter((equipo) => equipo.grupo === grupo),
        }))
      : [
          {
            grupo: grupoSeleccionado,
            equipos: tabla.filter((equipo) => equipo.grupo === grupoSeleccionado),
          },
        ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={grupoSeleccionado === null ? "default" : "outline"}
          onClick={() => onGrupoChange(null)}
          size="sm"
          className={
            grupoSeleccionado === null
              ? "bg-[#008C93] text-white hover:bg-[#007781]"
              : "border-slate-200 text-slate-700 hover:border-[#008C93]/30 hover:text-[#008C93]"
          }
        >
          Todos
        </Button>

        {grupos.map((grupo) => (
          <Button
            key={grupo}
            variant={grupoSeleccionado === grupo ? "default" : "outline"}
            onClick={() => onGrupoChange(grupo)}
            size="sm"
            className={
              grupoSeleccionado === grupo
                ? "bg-[#008C93] text-white hover:bg-[#007781]"
                : "border-slate-200 text-slate-700 hover:border-[#008C93]/30 hover:text-[#008C93]"
            }
          >
            Grupo {grupo}
          </Button>
        ))}
      </div>

      {gruposATabla.length === 0 || gruposATabla.every((item) => item.equipos.length === 0) ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-4 py-10 text-center text-slate-500 shadow-sm">
          No hay datos disponibles
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {gruposATabla.map(({ grupo, equipos }) => (
            <TablaGrupoCard key={grupo} grupo={grupo} equipos={equipos} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-sm">
        <p className="mb-3 text-xs ml-2 font-bold uppercase tracking-[0.22em] text-slate-700">
          Referencias
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 md:grid-cols-4 ml-2 ">
          <div><span className="font-semibold text-slate-800">PJ</span> = Partidos jugados</div>
          <div><span className="font-semibold text-slate-800">G</span> = Ganados</div>
          <div><span className="font-semibold text-slate-800">E</span> = Empates</div>
          <div><span className="font-semibold text-slate-800">P</span> = Perdidos</div>
          <div><span className="font-semibold text-slate-800">GF</span> = Goles a favor</div>
          <div><span className="font-semibold text-slate-800">GC</span> = Goles en contra</div>
          <div><span className="font-semibold text-slate-800">DIF</span> = Diferencia de goles</div>
          <div><span className="font-semibold text-slate-800">PTS</span> = Puntos</div>
        </div>
      </div>
    </div>
  );
}

function TablaGrupoCard({
  grupo,
  equipos,
}: {
  grupo: string;
  equipos: PosicionEquipo[];
}) {
  return (
    <section className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_24px_56px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93]">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950 md:text-xl">
                Grupo {grupo}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {equipos.length} {equipos.length === 1 ? "selección" : "selecciones"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="rounded-l-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  Pos
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  Equipo
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">PJ</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">G</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">E</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">P</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">GF</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">GC</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">DIF</th>
                <th className="rounded-r-2xl px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">PTS</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo, index) => (
                <tr
                  key={equipo.seleccionId}
                  className={
                    index % 2 === 0
                      ? "border-b border-slate-100/90 transition-colors hover:bg-slate-50/70"
                      : "border-b border-slate-100/90 bg-slate-50/40 transition-colors hover:bg-slate-100/70"
                  }
                >
                  <td className="px-4 py-3 font-extrabold text-slate-900">
                    {equipo.posicion || index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TeamFlag
                        bandera={equipo.bandera}
                        codigo={equipo.codigo}
                        nombre={equipo.nombre}
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{equipo.nombre}</div>
                        <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                          {equipo.codigo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.partidosJugados}</td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.ganancias}</td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.empates}</td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.derrotas}</td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.golesAFavor}</td>
                  <td className="px-3 py-3 text-center font-medium text-slate-700">{equipo.golesEnContra}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={
                        equipo.diferencial >= 0
                          ? "font-bold text-emerald-600"
                          : "font-bold text-red-600"
                      }
                    >
                      {equipo.diferencial > 0 ? "+" : ""}
                      {equipo.diferencial}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-base font-extrabold text-slate-950">
                    {equipo.puntos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TeamFlag({
  bandera,
  codigo,
  nombre,
}: {
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
}) {
  const value = bandera?.trim();
  const src = resolveBanderaSrc(value, codigo);
  const flagClassName = "h-8 w-12 shrink-0 object-contain";
  const flagWrapperClassName =
    "flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden";

  if (!value) {
    return <span className={`${flagWrapperClassName} bg-slate-50 text-lg`}>🏳️</span>;
  }

  if (src) {
    return (
      <span className={flagWrapperClassName}>
        <Image
          src={src}
          alt={`Bandera de ${nombre}`}
          width={48}
          height={32}
          unoptimized
          className={flagClassName}
        />
      </span>
    );
  }

  return <span className={`${flagWrapperClassName} bg-white px-1 text-xl`}>{value}</span>;
}
