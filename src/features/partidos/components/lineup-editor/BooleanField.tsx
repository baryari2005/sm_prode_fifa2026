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
          ? "border-[#5993B6]/35 bg-[#5993B6]/18 text-white"
          : "border-white/10 bg-white/[0.06] text-white/72 hover:bg-white/[0.1] hover:text-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#5993B6]"
      />

      {label}
    </label>
  );
}
