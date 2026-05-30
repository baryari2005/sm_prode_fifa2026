"use client";

import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  source?: string;
};

export function DashboardLoadingDebugInfo({ source }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const resolvedSource =
    source ??
    `Dashboard loading sin source manual: ${pathname || "(sin pathname)"}`;

  return (
    <div className="rounded-2xl border border-amber-300/25 bg-slate-950/22 px-4 py-3 text-left">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFE4A3]">
        Debug loading
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-white/82">
        Origen: {resolvedSource}
      </p>
      <p className="mt-1 break-words text-xs text-white/62">
        Ruta actual: {currentPath || "(sin pathname disponible)"}
      </p>
    </div>
  );
}
