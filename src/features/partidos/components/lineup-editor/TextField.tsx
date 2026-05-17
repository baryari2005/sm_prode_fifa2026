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
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#008C93]/20"
      />
    </div>
  );
}