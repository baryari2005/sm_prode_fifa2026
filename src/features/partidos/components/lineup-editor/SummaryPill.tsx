type SummaryPillProps = {
  label: string;
  value: number;
};

export function SummaryPill({ label, value }: SummaryPillProps) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
      {label}: <span className="text-slate-950">{value}</span>
    </span>
  );
}