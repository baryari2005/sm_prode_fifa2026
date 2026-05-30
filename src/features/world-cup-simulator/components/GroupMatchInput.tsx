"use client";

import { Input } from "@/components/ui/input";

type GroupMatchInputProps = {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
};

export function GroupMatchInput({ value, onChange }: GroupMatchInputProps) {
  return (
    <Input
      value={value ?? ""}
      inputMode="numeric"
      className="h-9 w-12 rounded-xl border-white/12 bg-white/8 px-0 text-center text-sm font-black text-white placeholder:text-white/40"
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        if (!nextValue.trim()) {
          onChange(null);
          return;
        }

        if (!/^\d+$/.test(nextValue)) return;
        onChange(Number(nextValue));
      }}
    />
  );
}
