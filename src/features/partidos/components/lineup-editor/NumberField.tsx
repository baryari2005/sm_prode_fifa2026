"use client";

import { Input } from "@/components/ui/input";

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="whitespace-nowrap text-xs font-semibold text-white/72">
        {label}
      </span>

      <Input
        type="text"
        inputMode="numeric"
        value={String(value ?? 0)}
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        onMouseUp={(event) => {
          event.preventDefault();
        }}
        onChange={(event) => {
          const onlyNumbers = event.target.value.replace(/\D/g, "");
          onChange(onlyNumbers === "" ? 0 : Number(onlyNumbers));
        }}
        className="h-8 w-14 border-0 bg-transparent p-0 text-center font-black text-white shadow-none focus-visible:ring-0"
      />
    </label>
  );
}
