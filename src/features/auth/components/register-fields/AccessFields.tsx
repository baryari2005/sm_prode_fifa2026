"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { IconInput } from "@/components/forms/IconInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { FormSection } from "./FormSection";

export function AccessFields({ form }: RegisterFieldsSectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 lg:p-5">
        <div className="mb-4 space-y-1">          
          <p className="text-xs leading-5 text-white/58">
            Define las credenciales con las que vas a ingresar al Prode cuando
            la solicitud sea aprobada.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-1">
            <Label htmlFor="userId" className="text-sm text-muted-foreground">
              Usuario
            </Label>

            <IconInput
              id="userId"
              leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
              input={
                <Input
                  id="userId"
                  autoComplete="username"
                  {...register("userId")}
                  aria-invalid={!!errors.userId}
                  className="h-11 rounded-2xl border pl-9 pr-3"
                />
              }
            />
            {errors.userId?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.userId.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>

            <IconInput
              id="email"
              leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
              input={
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className="h-11 rounded-2xl border pl-9 pr-3"
                />
              }
            />
            {errors.email?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-1">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Contraseña
            </Label>

            <IconInput
              id="password"
              leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
              rightAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={
                    showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              }
              input={
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-2xl border pl-9 pr-10"
                />
              }
            />
            {errors.password?.message ? (
              <p className="text-xs font-semibold text-red-300">
                {errors.password.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
