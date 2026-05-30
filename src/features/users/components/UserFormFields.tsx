"use client";

import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Eye, EyeOff, Lock } from "lucide-react";

import { IconInput } from "@/components/forms/IconInput";
import { CuilInput } from "@/components/forms/CuilInput";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTADO_CIVIL_OPCIONES } from "@/constants/estadocivil";
import { GENERO_OPCIONES } from "@/constants/genero";
import { LOCALIDAD_OPCIONES } from "@/constants/localidades";
import { NACIONALIDAD_VALUES } from "@/constants/nacionalidad";
import { TIPOS_DOCUMENTO_OPCIONES } from "@/constants/tiposDocumento";
import { cn } from "@/lib/utils";

import { UserFormValues } from "../types/types";
import { RoleSelect } from "./RoleSelect";

type Mode = "create" | "edit";

const onlyDigits = (s: string) => s.replace(/\D+/g, "");

const titleCaseEs = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(
      /([a-záéíóúüñ]+)([a-záéíóúüñ'-]*)/gi,
      (_m, p1: string, p2: string) =>
        p1.charAt(0).toUpperCase() + p1.slice(1) + p2
    );

const normalizeDni = (s: string) => onlyDigits(s);

const isValidDni = (s?: string) => {
  if (!s) return true;
  const ds = onlyDigits(s);
  return ds.length >= 7 && ds.length <= 8;
};

const CUIL_WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
const isValidCuil = (s?: string) => {
  if (!s) return true;
  const ds = onlyDigits(s);
  if (ds.length !== 11) return false;
  const nums = ds.split("").map((d) => parseInt(d, 10));
  const check = nums[10];
  const sum = CUIL_WEIGHTS.reduce((acc, w, i) => acc + w * nums[i], 0);
  let dv = 11 - (sum % 11);
  if (dv === 11) dv = 0;
  else if (dv === 10) dv = 9;
  return dv === check;
};

const isValidPhone = (s?: string) => {
  if (!s) return true;
  const ds = onlyDigits(s);
  return ds.length >= 8 && ds.length <= 15;
};

function fromYmdLocal(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function UserFormFields({
  mode,
  form,
  roles,
  loadingRoles,
}: {
  mode: Mode;
  form: UseFormReturn<UserFormValues>;
  roles: Array<{ id: number; nombre: string }>;
  loadingRoles: boolean;
  currentAvatarUrl?: string | null;
  onTempAvatarUploaded?: (tmpPath: string) => void;
}) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const [show, setShow] = useState(false);
  const rolValue = watch("rolId");

  return (
    <div className="grid gap-5 md:grid-cols-12">
      <div className="space-y-1 md:col-span-4">
        <Label>
          Usuario{" "}
          <p className="text-xs text-muted-foreground">
            ID único de login (no el email).
          </p>
        </Label>
        <Input
          {...register("userId")}
          readOnly={mode === "edit"}
          aria-readonly={mode === "edit"}
          className={cn(
            "h-11 rounded-2xl border-slate-200 pr-3",
            mode === "edit" &&
              "bg-muted/50 cursor-not-allowed text-muted-foreground"
          )}
          onKeyDown={(e) => {
            if (mode === "edit") e.preventDefault();
          }}
          onPaste={(e) => {
            if (mode === "edit") e.preventDefault();
          }}
        />
        {errors.userId && (
          <p className="text-xs text-red-600">{String(errors.userId.message)}</p>
        )}
      </div>

      <div className="space-y-1 md:col-span-4">
        <Label>
          {mode === "create" ? (
            "Contraseña"
          ) : (
            <>
              Nueva contraseña{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </>
          )}
        </Label>
        <IconInput
          id="password"
          leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {show ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          }
          input={
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="h-11 rounded-2xl border-slate-200 pl-9 pr-10"
            />
          }
        />
        {errors.password && (
          <p className="text-xs text-red-600">
            {String(errors.password.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-4">
        <Label>Rol</Label>
        <RoleSelect
          value={rolValue == null ? "" : String(rolValue)}
          onChange={(v) =>
            setValue("rolId", Number(v), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          roles={roles}
          disabled={loadingRoles || isSubmitting}          
        />
        {errors.rolId && (
          <p className="text-xs text-red-600">{String(errors.rolId.message)}</p>
        )}
      </div>

      <div className="space-y-1 md:col-span-6">
        <Label>Nombre</Label>
        <Input
          {...register("nombre", {
            onBlur: (e) =>
              setValue("nombre", titleCaseEs(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
          className="h-11 rounded-2xl border-slate-200 pr-3"
        />
        {errors.nombre && (
          <p className="text-xs text-red-600">{String(errors.nombre.message)}</p>
        )}
      </div>

      <div className="space-y-1 md:col-span-6">
        <Label>Apellido</Label>
        <Input
          {...register("apellido", {
            onBlur: (e) =>
              setValue("apellido", titleCaseEs(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
          className="h-11 rounded-2xl border-slate-200 pr-3"
        />
        {errors.apellido && (
          <p className="text-xs text-red-600">
            {String(errors.apellido.message)}
          </p>
        )}
      </div>

      <div className="user-form-divider h-px bg-slate-200/80 md:col-span-12" />

      <div className="space-y-1 md:col-span-3">
        <Label>Tipo de documento</Label>
        <Controller
          control={control}
          name="tipoDocumento"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="h-11 w-full pl-5 pr-10 rounded-2xl border-slate-200">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_DOCUMENTO_OPCIONES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tipoDocumento && (
          <p className="text-xs text-red-600">
            {String(errors.tipoDocumento.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-4">
        <Label>Número de documento</Label>
        <Input
          {...register("documento", {
            validate: (v) => isValidDni(v) || "DNI inválido",
            onBlur: (e) =>
              setValue("documento", normalizeDni(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
          className="h-11 rounded-2xl border-slate-200 pr-3"
          inputMode="numeric"
          placeholder="Ej: 30111222"
        />
        {errors.documento && (
          <p className="text-xs text-red-600">
            {String(errors.documento.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-5">
        <Label>CUIL</Label>
        <Controller
          name="cuil"
          control={control}
          rules={{
            validate: (v) =>
              isValidCuil(v) || "CUIL inválido o dígito verificador incorrecto",
          }}
          render={({ field, fieldState }) => (
            <>
              <CuilInput
                className="h-11 rounded-2xl border-slate-200 pr-3"
                value={field.value ?? ""}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                onValueChange={(digits) => field.onChange(digits)}
              />
              {fieldState.error && (
                <p className="text-xs text-red-600">
                  {String(fieldState.error.message)}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div className="user-form-divider h-px bg-slate-200/80 md:col-span-12" />

      <div className="space-y-1 md:col-span-6">
        <Label>Domicilio</Label>
        <Input
          {...register("domicilio", {
            onBlur: (e) =>
              setValue("domicilio", titleCaseEs(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
          className="h-11 rounded-2xl border-slate-200 pr-3"
          placeholder="Calle 123, Piso/Dto"
        />
        {errors.domicilio && (
          <p className="text-xs text-red-600">
            {String(errors.domicilio.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Partido</Label>
        <Controller
          control={control}
          name="localidad"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200">
                <SelectValue placeholder="Seleccionar localidad" />
              </SelectTrigger>
              <SelectContent>
                {LOCALIDAD_OPCIONES.map((localidad) => (
                  <SelectItem key={localidad} value={localidad}>
                    {localidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.localidad && (
          <p className="text-xs text-red-600">
            {String(errors.localidad.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Código postal</Label>
        <Input
          {...register("codigoPostal")}
          className="h-11 rounded-2xl border-slate-200 pr-3"
          placeholder="Ej: C1000 / 2000"
        />
        {errors.codigoPostal && (
          <p className="text-xs text-red-600">
            {String(errors.codigoPostal.message)}
          </p>
        )}
      </div>

      <div className="user-form-divider h-px bg-slate-200/80 md:col-span-12" />

      <div className="space-y-1 md:col-span-6">
        <Label>Celular</Label>
        <Input
          {...register("celular", {
            validate: (v) => isValidPhone(v) || "Celular inválido",
          })}
          className="h-11 rounded-2xl border-slate-200 pr-3"
          placeholder="Ej: +54 9 11 1234-5678"
        />
        {errors.celular && (
          <p className="text-xs text-red-600">
            {String(errors.celular.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-6">
        <Label>Email</Label>
        <Input
          type="email"
          {...register("email")}
          className="h-11 rounded-2xl border-slate-200 pr-3"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{String(errors.email.message)}</p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Género</Label>
        <Controller
          control={form.control}
          name="genero"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {GENERO_OPCIONES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.genero && (
          <p className="text-xs text-red-600">
            {String(form.formState.errors.genero.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Nacionalidad</Label>
        <Controller
          control={form.control}
          name="nacionalidad"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {NACIONALIDAD_VALUES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e
                      .toLowerCase()
                      .replaceAll("_", " ")
                      .replace(/^\w|(?:\s)\w/g, (m) => m.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.nacionalidad && (
          <p className="text-xs text-red-600">
            {String(form.formState.errors.nacionalidad.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Fecha de nacimiento</Label>
        <Controller
          control={form.control}
          name="fechaNacimiento"
          render={({ field }) => {
            const raw = field.value as string | null | undefined;
            const ymd = typeof raw === "string" ? raw : null;
            const dateValue = ymd ? fromYmdLocal(ymd) : undefined;

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 w-full justify-start rounded-2xl border-slate-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {dateValue ? (
                      format(dateValue, "dd/MM/yyyy", { locale: es })
                    ) : (
                      <span className="text-muted-foreground">
                        Seleccionar fecha
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(d) => field.onChange(d ? toYmdLocal(d) : null)}
                    captionLayout="dropdown"
                    fromYear={1940}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
        {form.formState.errors.fechaNacimiento && (
          <p className="text-xs text-red-600">
            {String(form.formState.errors.fechaNacimiento.message)}
          </p>
        )}
      </div>

      <div className="space-y-1 md:col-span-3">
        <Label>Estado civil</Label>
        <Controller
          control={form.control}
          name="estadoCivil"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {ESTADO_CIVIL_OPCIONES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e.charAt(0) + e.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.estadoCivil && (
          <p className="text-xs text-red-600">
            {String(form.formState.errors.estadoCivil.message)}
          </p>
        )}
      </div>
    </div>
  );
}
