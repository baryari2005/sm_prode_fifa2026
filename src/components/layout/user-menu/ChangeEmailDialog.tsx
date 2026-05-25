"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
  DialogShell,
} from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeEmail } from "@/lib/api/account";
import { useAuth } from "@/stores/auth";
import { formatMessage } from "@/utils/formatters";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentEmail: string;
};

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const { logout } = useAuth();

  const emailError = useMemo(() => {
    if (!values.email) return "El email no es válido";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
    return ok ? "" : "El email no es válido";
  }, [values.email]);

  const canSave = useMemo(() => {
    return !submitting && !emailError && values.password.length >= 6;
  }, [submitting, emailError, values.password]);

  const onSubmit = async () => {
    if (!canSave) return;

    setSubmitting(true);

    try {
      await changeEmail({ email: values.email.trim(), password: values.password });
      toast.success("Email actualizado. Se iniciará nuevamente la sesión.");
      onOpenChange(false);
      setTimeout(() => logout(), 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          error.message ??
          "No se pudo actualizar el email.";

        toast.error(message);
      } else {
        toast.error("No se pudo actualizar el email.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">Editar email</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para cambiar tu correo electrónico personal.
        </DialogDescription>

        <DialogShell>
          <DialogHero
            icon={<Mail className="h-6 w-6 text-white" />}
            title="Editar email"
            description="Actualizá el correo vinculado a tu cuenta y confirmá la operación con tu clave actual."
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<CheckCircle2 className="h-5 w-5 text-sky-600" />}
              title="Email actual"
              description={
                <span className="break-all font-medium text-sky-950">
                  {currentEmail}
                </span>
              }
            />

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-800">
                Correo electrónico nuevo
              </Label>
              <Input
                type="email"
                placeholder="Ingresá tu nuevo email"
                value={values.email}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`h-11 rounded-xl border-slate-200 bg-white ${
                  emailError ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
              {emailError ? (
                <p className="text-xs text-red-600">{emailError}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-800">
                Clave actual
              </Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Ingresá tu clave actual"
                  value={values.password}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="h-11 rounded-xl border-slate-200 bg-white pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                  }}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Ocultar clave" : "Mostrar clave"}
                  onClick={() => setShowPw((prev) => !prev)}
                  className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-100"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <DialogMutedNote>
              Para proteger tu cuenta, cuando confirmes el cambio vas a tener
              que iniciar sesión nuevamente.
            </DialogMutedNote>
          </DialogFormSection>

          <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-end">
            <DialogClose asChild>
              <Button
                className="h-11 rounded-xl border-slate-200 px-5 font-bold"
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>

            <Button
              onClick={onSubmit}
              disabled={!canSave}
              className="h-11 rounded-xl bg-sky-600 px-5 font-black text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={18} />
                  {formatMessage("Guardando...")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Guardar cambios
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogShell>
      </DialogContent>
    </Dialog>
  );
}
