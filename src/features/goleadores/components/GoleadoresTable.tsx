"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Goleador } from "@/features/goleadores/types/types";

type Props = {
  goleadores: Goleador[];
};

export function GoleadoresTable({ goleadores }: Props) {
  if (goleadores.length === 0) {
    return (
      <Card className="border-dashed border-slate-200 bg-slate-50/60 shadow-none">
        <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="text-lg font-bold text-slate-900">
            No hay goleadores para mostrar
          </div>
          <p className="max-w-xl text-sm text-slate-500">
            Probá cargar desde la API o desde el dataset mock para ver cómo se
            comporta la pantalla.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
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
                className="border-t border-slate-100 text-sm text-slate-700"
              >
                <td className="px-4 py-4">
                  <Badge className="rounded-full bg-slate-900 px-2.5 py-1 text-white hover:bg-slate-900">
                    {index + 1}
                  </Badge>
                </td>

                <td className="px-4 py-4">
                  <div className="min-w-[220px]">
                    <div className="font-bold text-slate-950">{goleador.nombre}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {goleador.nacionalidad}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex min-w-[180px] items-center gap-3">
                    <span className="flex h-10 w-12 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                      {goleador.escudo ? (
                        <Image
                          src={goleador.escudo}
                          alt={`Escudo de ${goleador.seleccion}`}
                          width={36}
                          height={36}
                          className="h-8 w-8 object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {goleador.codigoSeleccion}
                        </span>
                      )}
                    </span>

                    <div>
                      <div className="font-semibold text-slate-950">
                        {goleador.seleccion}
                      </div>
                      <div className="text-xs text-slate-500">
                        {goleador.codigoSeleccion}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <span className="text-lg font-black text-slate-950">
                    {goleador.goles}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">{goleador.asistencias}</td>
                <td className="px-4 py-4 text-center">{goleador.penales}</td>
                <td className="px-4 py-4 text-center">{goleador.partidosJugados}</td>
                <td className="px-4 py-4">{goleador.posicion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
