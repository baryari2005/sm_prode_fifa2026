"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RankingRowDTO } from "@/features/pronosticos/services/ranking.service";
import { useAuth } from "@/stores/auth";

type Props = {
  rows: RankingRowDTO[];
};

export function RankingTable({ rows }: Props) {
  const myUserId = useAuth((state) => state.user?.id ?? null);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#1E2C46] shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Tabla general
        </p>
        <h2 className="mt-2 font-brand text-[2rem] leading-none tracking-[0.04em] text-white">
          Ranking completo
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white/[0.05]">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.18em] text-white/58">
              <th className="px-4 py-4">Pos.</th>
              <th className="px-4 py-4">Usuario</th>
              <th className="px-4 py-4 text-center">Puntos</th>
              <th className="px-4 py-4 text-center">Exactos</th>
              <th className="px-4 py-4 text-center">Tendencias</th>
              <th className="px-4 py-4 text-center">Calificados</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm font-semibold text-white/60"
                >
                  Todavía no hay ranking disponible.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
              const isCurrentUser = row.usuarioId === myUserId;

              return (
                <tr
                  key={row.usuarioId}
                  className={`border-t border-sky-100/10 text-sm ${
                    isCurrentUser ? "bg-sky-200/10" : "bg-transparent"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Badge className="rounded-full border-sky-100/14 bg-white/[0.06] px-2.5 py-1 text-white hover:bg-white/[0.06]">
                      #{row.posicion}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/12 bg-white/8 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
                        <AvatarImage
                          src={row.avatarUrl ?? undefined}
                          alt={row.nombre}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#5993B6]/18 text-xs font-black uppercase text-[#D8F2FF]">
                          {getInitials(row.nombre)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {row.nombre}
                        </p>
                        {isCurrentUser && (
                          <span className="text-xs font-semibold text-sky-200">
                            (Vos)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-black text-white">
                    {row.puntosTotales}
                  </td>
                  <td className="px-4 py-4 text-center text-white/82">{row.aciertosExactos}</td>
                  <td className="px-4 py-4 text-center text-white/82">{row.aciertosTendencia}</td>
                  <td className="px-4 py-4 text-center text-white/82">
                    {row.partidosCalificados}/{row.partidosPronosticados}
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join("");

  return initials.toUpperCase() || "U";
}
