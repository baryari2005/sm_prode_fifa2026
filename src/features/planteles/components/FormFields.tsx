import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

import {
  preventMouseSelectionReset,
  selectAllInputText,
} from "../helpers";

export function SectionDivider() {
  return <div className="border-t border-slate-200" />;
}

export function FormField({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-sm font-semibold text-slate-800">{children}</label>
  );
}

export function InlineField({
  label,
  children,
  compact = false,
  helper,
  labelClassName,
  className,
}: {
  label: string;
  children: ReactNode;
  compact?: boolean;
  helper?: string;
  labelClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-2 ${
        compact
          ? "md:grid-cols-[110px_minmax(0,1fr)] md:items-center"
          : "md:grid-cols-[140px_minmax(0,1fr)] md:items-start"
      } ${className ?? ""}`}
    >
      <div className={labelClassName}>
        <FormLabel>{label}</FormLabel>
        {helper ? <p className="text-[11px] text-slate-500">{helper}</p> : null}
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  compact = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <InlineField label={label} compact={compact} className={className}>
      <Input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={selectAllInputText}
        onMouseUp={preventMouseSelectionReset}
        className="h-11 rounded-2xl border-slate-200 bg-white"
      />
    </InlineField>
  );
}
