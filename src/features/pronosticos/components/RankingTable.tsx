"use client";

import { Badge } from "@/components/ui/badge";
import type { RankingRowDTO } from "@/features/pronosticos/services/ranking.service";
import { useAuth } from "@/stores/auth";

type Props = {
  rows: RankingRowDTO[];
};

export function RankingTable({ rows }: Props) {
  const myUserId = useAuth((state) => state.user?.id ?? null);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-4">Pos.</th>
              <th className="px-4 py-4">Usuario</th>
              <th className="px-4 py-4 text-center">Puntos</th>
              <th className="px-4 py-4 text-center">Exactos</th>
              <th className="px-4 py-4 text-center">Tendencias</th>
              <th className="px-4 py-4 text-center">Calificados</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const isCurrentUser = row.usuarioId === myUserId;

              return (
                <tr
                  key={row.usuarioId}
                  className={`border-t border-slate-100 text-sm ${
                    isCurrentUser ? "bg-[#EEF6EF]/70" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Badge className="rounded-full bg-slate-900 px-2.5 py-1 text-white hover:bg-slate-900">
                      #{row.posicion}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-950">
                    {row.nombre}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs font-semibold text-[#39A935]">
                        (Vos)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-black text-slate-950">
                    {row.puntosTotales}
                  </td>
                  <td className="px-4 py-4 text-center">{row.aciertosExactos}</td>
                  <td className="px-4 py-4 text-center">{row.aciertosTendencia}</td>
                  <td className="px-4 py-4 text-center">
                    {row.partidosCalificados}/{row.partidosPronosticados}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
