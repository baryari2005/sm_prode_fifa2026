"use client";

import { Input } from "@/components/ui/input";

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <Input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
      />
    </div>
  );
}