"use client";

import { useEffect } from "react";
import type { FieldError, FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { RefreshCw, Save, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMessage } from "@/utils/formatters";

import { UserFormFields } from "./UserFormFields";
import { UserFormValues, type UserProtectionMeta } from "../types/types";
import { useUserForm } from "../hooks/useUserForm";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  defaultValues?: Partial<UserFormValues> & {
    id?: string;
    rol?: { id: number };
  } & UserProtectionMeta;
  onSuccess?: (id: string) => void;
  className?: string;
};

function isFieldError(value: unknown): value is FieldError {
  return (
    !!value &&
    typeof value === "object" &&
    ("message" in value || "type" in value)
  );
}

function getFirstFieldError(
  errors: FieldErrors<UserFormValues>
): { name: string; error: FieldError } | null {
  for (const [name, value] of Object.entries(errors)) {
    if (isFieldError(value)) {
      return { name, error: value };
    }
  }

  return null;
}

export function UserForm({ mode, defaultValues, onSuccess, className }: Props) {
  const { form, onSubmit, submitting, roles, loadingRoles, setTmpPath } =
    useUserForm({ mode, defaultValues, onSuccess });

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      Object.keys(form.formState.errors).length > 0
    ) {
      console.log("[RHF] errors", form.formState.errors);
    }
  }, [form.formState.errors]);

  const onInvalid = (errors: FieldErrors<UserFormValues>) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[RHF] onInvalid", errors);
    }

    const first = getFirstFieldError(errors);

    if (!first) {
      toast.error("Revisá los campos del formulario.");
      return;
    }

    const { name, error } = first;
    const msg =
      typeof error.message === "string"
        ? error.message
        : `Revisá el campo: ${name}`;

    toast.error(msg);

    const element =
      (document.querySelector(`[name="${name}"]`) as HTMLElement | null) ??
      (error.ref as HTMLElement | undefined) ??
      (document.getElementById(name) as HTMLElement | null);

    element?.focus?.();
  };

  return (
    <form
      id="user-form"
      className={cn("w-full", className)}
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      noValidate
    >
      <UserFormFields
        mode={mode}
        form={form}
        roles={roles}
        loadingRoles={loadingRoles}
        disableRoleField={
          !!defaultValues?.isProtectedDevSup &&
          !defaultValues?.canManageProtectedDevSup
        }
        currentAvatarUrl={defaultValues?.avatarUrl || null}
        onTempAvatarUploaded={setTmpPath}
      />

      <div className="mt-4 mb-4 md:col-span-2">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full rounded-2xl border border-[#F7CF74] bg-[#FAB438] text-[0.98rem] font-semibold tracking-[0.02em] text-[#1E2C46] shadow-[0_18px_40px_rgba(250,180,56,0.24)] transition hover:bg-[#FFD166] hover:shadow-[0_22px_46px_rgba(250,180,56,0.3)]"
          disabled={submitting}
          aria-disabled={submitting}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="animate-spin" size={18} />
              {formatMessage("Guardando...")}
            </span>
          ) : mode === "create" ? (
            <span className="inline-flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Crear usuario
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar cambios
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
