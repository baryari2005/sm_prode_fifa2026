import type { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  detail?: string | null;
  icon?: ReactNode;
};

export function SummaryCard({ title, value, detail, icon }: SummaryCardProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {icon ? <div className="shrink-0">{icon}</div> : null}

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>

        <p className="mt-1 truncate text-lg font-extrabold tracking-[-0.02em] text-slate-950 md:text-xl">
          {value}
        </p>

        {detail ? <p className="mt-1 text-sm text-slate-500">{detail}</p> : null}
      </div>
    </div>
  );
}
