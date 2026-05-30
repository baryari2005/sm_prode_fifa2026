"use client";

import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { fromYmdLocal, toYmdLocal } from "../helpers/registerFields.helpers";

export function BirthDateField({ form }: RegisterFieldsSectionProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="min-w-0 space-y-1">
      <label className="text-sm text-muted-foreground">
        Fecha de nacimiento
      </label>

      <Controller
        control={control}
        name="fechaNacimiento"
        render={({ field }) => {
          const dateValue = field.value ? fromYmdLocal(field.value) : undefined;

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={`h-11 w-full min-w-0 justify-start rounded-2xl bg-white/10 px-3 text-left text-white ${
                    errors.fechaNacimiento
                      ? "border-destructive ring-destructive/20"
                      : "border-white/22"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-white/55" />

                  <span className="min-w-0 truncate">
                    {dateValue ? (
                      format(dateValue, "dd/MM/yyyy", { locale: es })
                    ) : (
                      <span className="text-white/45">Seleccionar fecha</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => field.onChange(date ? toYmdLocal(date) : "")}
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {errors.fechaNacimiento?.message ? (
        <p className="text-xs font-semibold text-red-300">
          {errors.fechaNacimiento.message}
        </p>
      ) : null}
    </div>
  );
}
