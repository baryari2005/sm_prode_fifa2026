"use client";

import type { Control, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RegisterFormValues } from "../../types/registerFields.types";

type Props = {
  control: Control<RegisterFormValues>;
  name: Path<RegisterFormValues>;
  label: string;
  options: readonly string[];
  placeholder?: string;
  formatOption?: (value: string) => string;
  errorMessage?: string;
  className?: string;
};

const SELECT_TRIGGER_CLASS =
  "h-11 w-full min-w-0 rounded-2xl border-white/22 bg-white/10 text-white";

const SELECT_CONTENT_CLASS =
  "w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]";

export function ControlledSelectField({
  control,
  name,
  label,
  options,
  placeholder = "Seleccionar",
  formatOption,
  errorMessage,
  className,
}: Props) {
  return (
    <div className={`min-w-0 space-y-1 ${className ?? ""}`}>
      <label className="text-sm text-muted-foreground">{label}</label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={String(field.value ?? "")} onValueChange={field.onChange}>
            <SelectTrigger
              aria-invalid={!!errorMessage}
              className={SELECT_TRIGGER_CLASS}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className={SELECT_CONTENT_CLASS}>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatOption ? formatOption(option) : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage ? (
        <p className="text-xs font-semibold text-red-300">{errorMessage}</p>
      ) : null}
    </div>
  );
}
