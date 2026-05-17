"use client";

type BooleanFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function BooleanField({
  label,
  checked,
  onChange,
}: BooleanFieldProps) {
  return (
    <label
      className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
        checked
          ? "border-[#008C93]/30 bg-[#008C93]/10 text-[#00757B]"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-[#008C93]"
      />

      {label}
    </label>
  );
}