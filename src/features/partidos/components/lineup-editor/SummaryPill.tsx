type SummaryPillProps = {
  label: string;
  value: number;
};

export function SummaryPill({ label, value }: SummaryPillProps) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {label}: <span className="text-white">{value}</span>
    </span>
  );
}
