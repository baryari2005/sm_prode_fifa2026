"use client";

import Image from "next/image";
import { resolveBanderaSrc } from "@/lib/flags";

type TeamFlagProps = {
  flag?: string | null;
  code?: string | null;
  name: string;
};

export function TeamFlag({ flag, code, name }: TeamFlagProps) {
  const src = resolveBanderaSrc(flag, code);

  if (!flag && !src) {
    return (
      <span className="flex h-7 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[0.6rem] font-black text-slate-400">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={36}
        height={28}
        unoptimized
        className="h-7 w-9 rounded-[0.35rem] object-cover shadow-sm"
      />
    );
  }

  return (
    <span className="text-2xl leading-none" aria-label={name}>
      {flag}
    </span>
  );
}
