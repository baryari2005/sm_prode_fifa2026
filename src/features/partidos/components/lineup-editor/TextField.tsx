"use client";

import { Input } from "@/components/ui/input";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
        {label}
      </label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-[20px] border-white/10 bg-white/[0.08] px-4 text-base font-semibold text-white placeholder:text-white/38 shadow-none focus-visible:ring-2 focus-visible:ring-[#5993B6]/30"
      />
    </div>
  );
}
