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

import {
  BrandDialogFrame,
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
  BRAND_DIALOG_ERROR_CLASSNAME,
  BRAND_DIALOG_FOOTER_CLASSNAME,
  BRAND_DIALOG_ICON_BUTTON_CLASSNAME,
  BRAND_DIALOG_INPUT_CLASSNAME,
  BRAND_DIALOG_LABEL_CLASSNAME,
  BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME,
} from "@/components/ui/brand-dialog";
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
      <DialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <DialogTitle className="sr-only">Editar email</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para cambiar tu correo electrónico personal.
        </DialogDescription>

        <BrandDialogFrame>
          <DialogHero
            icon={<Mail className="h-6 w-6 text-[#FAB438]" />}
            title={
              <span className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                Editar email
              </span>
            }
            description="Actualizá el correo vinculado a tu cuenta y confirmá la operación con tu clave actual."
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName="border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<CheckCircle2 className="h-5 w-5 text-[#AEEBFF]" />}
              title="Email actual"
              description={
                <span className="break-all font-medium text-white">
                  {currentEmail}
                </span>
              }
              className="border border-[#5993B6]/20 bg-[#5993B6]/10"
              titleClassName="text-[#EAF8FF]"
              descriptionClassName="text-white/86"
            />

            <div className="space-y-1.5">
              <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>
                Correo electrónico nuevo
              </Label>
              <Input
                type="email"
                placeholder="Ingresá tu nuevo email"
                value={values.email}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`${BRAND_DIALOG_INPUT_CLASSNAME} ${
                  emailError
                    ? "border-rose-400/70 focus-visible:border-rose-300 focus-visible:ring-rose-300/25"
                    : ""
                }`}
              />
              {emailError ? (
                <p className={BRAND_DIALOG_ERROR_CLASSNAME}>{emailError}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>
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
                  className={`${BRAND_DIALOG_INPUT_CLASSNAME} pr-10`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                  }}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Ocultar clave" : "Mostrar clave"}
                  onClick={() => setShowPw((prev) => !prev)}
                  className={BRAND_DIALOG_ICON_BUTTON_CLASSNAME}
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

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              Para proteger tu cuenta, cuando confirmes el cambio vas a tener
              que iniciar sesión nuevamente.
            </DialogMutedNote>
          </DialogFormSection>

          <DialogFooter className={BRAND_DIALOG_FOOTER_CLASSNAME}>
            <DialogClose asChild>
              <Button
                className={BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME}
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>

            <Button
              onClick={onSubmit}
              disabled={!canSave}
              className={BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME}
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
        </BrandDialogFrame>
      </DialogContent>
    </Dialog>
  );
}
