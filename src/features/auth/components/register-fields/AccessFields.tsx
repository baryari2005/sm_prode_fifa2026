"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { IconInput } from "@/components/forms/IconInput";
import { Input } from "@/components/ui/input";

import { FormSection } from "./FormSection";
import { RegisterFieldsSectionProps } from "../../types/registerFields.types";
import { Label } from "@/components/ui/label";

export function AccessFields({ form }: RegisterFieldsSectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection title="Acceso">
      <div className="grid gap-4 md:grid-cols-3">
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
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
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
        </div>
      </div>
    </FormSection>
  );
}
