"use client";

import { Input } from "@/components/ui/input";

type TextFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function TextField({
  label,
  value,
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}