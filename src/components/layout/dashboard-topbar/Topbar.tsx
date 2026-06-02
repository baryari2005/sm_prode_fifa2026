"use client";

import { CalendarDays, Search } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { brandImages } from "@/config/brand-images";
import Image from "next/image";

export function Topbar() {
  return (
    <div className="flex h-[var(--topbar-h)] w-full items-center justify-between gap-4 border-b border-white/10 bg-[rgba(6,27,51,0.72)] px-[var(--content-pad)] text-white backdrop-blur-xl lg:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.05] lg:h-11 lg:w-11">
            <Image
              src={brandImages.prode.solMark}
              alt="Logo copa mundial"
              width={10}
              height={10}
              className="h-auto w-10 select-none object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)] lg:w-11"
            />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-col">
              <p className="text-[12px] font-black uppercase tracking-[0.30em] text-brand-white">
                Orgullo de barrio
              </p>
              <p className="font-brand text-[30px] font-black leading-none tracking-[0.08em] text-brand-blue 2xl:text-[30px]">
                Pasión mundial
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 max-w-[420px] flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 xl:flex 2xl:max-w-[520px]">
        <Search className="mr-2 h-4 w-4 text-white/40" />
        <input
          placeholder="Buscar partidos, ranking o usuarios..."
          className="min-w-0 w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/38"
        />
      </div>

      <div className="flex min-w-0 shrink-0 items-center gap-2 lg:gap-3">
        <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/88 shadow-sm xl:flex">
          <CalendarDays className="h-4 w-4 text-[#AEEBFF]" />
          Mundial 2026
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
