"use client";

import { CalendarDays, Search } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import Image from "next/image";

export function Topbar() {
  return (
    <div className="flex h-[var(--topbar-h)] w-full items-center justify-between gap-2 bg-white px-[var(--content-pad)] lg:gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl lg:h-10 lg:w-10">
          <Image
              src="/copa.png"
              alt="Logo copa mundial"
              width={30}
              height={30}
              className="h-auto w-5 select-none object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)] lg:w-6"
            />
          </div>

          <div className="min-w-0">
            <Image
              src="/logo2.png"
              alt="logo Mundial 2026"
              width={160}
              height={160}
              className="h-auto w-[130px] max-w-full select-none object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] xl:w-[150px] 2xl:w-[180px]"
            />
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 max-w-[340px] flex-1 items-center rounded-2xl border border-[#E5EAF0] bg-[#F5F7FA] px-3 py-2 xl:flex 2xl:max-w-md">
        <Search className="mr-2 h-4 w-4 text-[#6B7280]" />
        <input
          placeholder="Buscar partidos, ranking o usuarios..."
          className="min-w-0 w-full bg-transparent text-sm font-medium text-[#172033] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>

      <div className="flex min-w-0 items-center gap-2 lg:gap-3">
        <div className="hidden items-center gap-2 rounded-2xl border border-[#E5EAF0] bg-white px-2.5 py-2 text-sm text-[#172033] shadow-sm 2xl:flex">
          <CalendarDays className="h-4 w-4 text-[#39A935]" />
          Mundial 2026
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
