"use client";

import Image from "next/image";

type TeamFlagProps = {
  flag?: string | null;
  name: string;
};

export function TeamFlag({ flag, name }: TeamFlagProps) {
  if (!flag) {
    return (
      <span className="flex h-7 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[0.6rem] font-black text-slate-400">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  const isImage = flag.startsWith("http") || flag.startsWith("/");

  if (isImage) {
    return (
      <Image
        src={flag}
        alt={name}
        width={36}
        height={28}
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
