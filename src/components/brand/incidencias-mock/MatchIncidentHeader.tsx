"use client";

import { Badge } from "@/components/ui/badge";

export function MatchIncidentHeader() {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        <div className="text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Local</p>
          <p className="mt-2 text-2xl font-bold text-white">Mexico</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-[64px_auto_64px] items-center gap-2">
            <div className="grid h-14 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
              2
            </div>
            <span className="font-brand text-4xl text-white/42">VS</span>
            <div className="grid h-14 w-16 place-items-center rounded-3xl bg-white/10 text-2xl font-black text-white">
              1
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="rounded-full bg-[#84F0C8]/12 text-[#84F0C8] hover:bg-[#84F0C8]/12">
              En vivo
            </Badge>
            <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
              Grupo F
            </Badge>
            <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
              30 mayo 2026
            </Badge>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">Visitante</p>
          <p className="mt-2 text-2xl font-bold text-white">Sudafrica</p>
        </div>
      </div>
    </div>
  );
}
