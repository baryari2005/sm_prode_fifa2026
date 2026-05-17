type StatValueProps = {
  value: number;
  active: boolean;
};

export function StatValue({ value, active }: StatValueProps) {
  return (
    <div
      className={`text-center text-lg font-semibold ${
        active ? "text-[#0B66C3]" : "text-slate-900"
      }`}
    >
      {value}

      <span className="ml-1 text-sm text-slate-500">
        {value <= 100 ? "%" : ""}
      </span>
    </div>
  );
}