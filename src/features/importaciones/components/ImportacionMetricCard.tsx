"use client";

import type { ReactNode } from "react";

import { DASHBOARD_SUBCARD } from "@/features/dashboard/components/home/dashboard-home.styles";

type ImportacionMetricCardProps = {
  icon: ReactNode;
  title: string;
  detail: string;
  value: ReactNode;
  toneClassName: string;
};

export function ImportacionMetricCard({
  icon,
  title,
  detail,
  value,
  toneClassName,
}: ImportacionMetricCardProps) {
  return (
    <div
      className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
          {detail}
        </span>
      </span>
      <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
        {value}
      </span>
    </div>
  );
}
