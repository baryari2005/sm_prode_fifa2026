"use client";

import type { ReactNode } from "react";

type InfoBadgeProps = {
  children: ReactNode;
  className?: string;
};

export function InfoBadge({ children, className = "" }: InfoBadgeProps) {
  return (
    <span
      className={[
        "rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}