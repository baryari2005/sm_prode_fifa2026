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
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      {label}
    </label>
  );
}