"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  KeyRoundIcon,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  BrandDialogFrame,
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
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
import { changePassword } from "@/lib/api/account";
import { useAuth } from "@/stores/auth";
import { formatMessage } from "@/utils/formatters";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { logout } = useAuth();

  const canSave = useMemo(() => {
    return (
      values.currentPassword.length > 0 &&
      values.newPassword.length >= 6 &&
      values.newPassword === values.confirm &&
      !submitting
    );
  }, [values, submitting]);

  const onSubmit = async () => {
    if (!canSave) return;

    setSubmitting(true);

    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast.success("Contraseña actualizada. Se iniciará nuevamente la sesión.");
      onOpenChange(false);
      setTimeout(() => logout(), 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          error.message ??
          "Error al actualizar la contraseña.";

        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar la contraseña.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <DialogTitle className="sr-only">Editar clave</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para cambiar tu clave de acceso.
        </DialogDescription>

        <BrandDialogFrame>
          <DialogHero
            icon={<KeyRoundIcon className="h-6 w-6 text-[#FAB438]" />}
            title={
              <span className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                Editar clave
              </span>
            }
            description="Actualizá tu contraseña de acceso y confirmá la nueva clave antes de guardarla."
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName="border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<ShieldCheck className="h-5 w-5 text-[#AEEBFF]" />}
              title="Cambio seguro"
              description="Usá una contraseña de al menos 6 caracteres y verificá que ambas claves nuevas coincidan."
              className="border border-[#5993B6]/20 bg-[#5993B6]/10"
              titleClassName="text-[#EAF8FF]"
              descriptionClassName="text-white/74"
            />

            <PasswordField
              label="Ingresá clave actual"
              placeholder="Ingresá clave actual"
              value={values.currentPassword}
              onChange={(value) =>
                setValues((prev) => ({ ...prev, currentPassword: value }))
              }
              visible={show.current}
              onToggleVisible={() =>
                setShow((prev) => ({ ...prev, current: !prev.current }))
              }
            />

            <PasswordField
              label="Ingresá nueva clave"
              placeholder="Ingresá nueva clave"
              value={values.newPassword}
              onChange={(value) =>
                setValues((prev) => ({ ...prev, newPassword: value }))
              }
              visible={show.new}
              onToggleVisible={() =>
                setShow((prev) => ({ ...prev, new: !prev.new }))
              }
            />

            <PasswordField
              label="Repetí nueva clave"
              placeholder="Repetí nueva clave"
              value={values.confirm}
              onChange={(value) =>
                setValues((prev) => ({ ...prev, confirm: value }))
              }
              visible={show.confirm}
              onToggleVisible={() =>
                setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
            />

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              Cuando guardes la nueva contraseña, la sesión actual se cerrará
              para que vuelvas a ingresar con la clave actualizada.
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

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggleVisible,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>{label}</Label>

      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${BRAND_DIALOG_INPUT_CLASSNAME} mt-1 pr-10`}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />

        <button
          type="button"
          aria-label={visible ? "Ocultar clave" : "Mostrar clave"}
          onClick={onToggleVisible}
          className={BRAND_DIALOG_ICON_BUTTON_CLASSNAME}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
