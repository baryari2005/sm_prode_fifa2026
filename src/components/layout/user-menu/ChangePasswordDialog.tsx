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
import { changePassword } from "@/lib/api/account";
import { formatMessage } from "@/utils/formatters";
import { useAuth } from "@/stores/auth";

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
      <DialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">Editar clave</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para cambiar tu clave de acceso.
        </DialogDescription>

        <DialogShell>
          <DialogHero
            icon={<KeyRoundIcon className="h-6 w-6 text-white" />}
            title="Editar clave"
            description="Actualizá tu contraseña de acceso y confirmá la nueva clave antes de guardarla."
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<ShieldCheck className="h-5 w-5 text-sky-600" />}
              title="Cambio seguro"
              description="Usá una contraseña de al menos 6 caracteres y verificá que ambas claves nuevas coincidan."
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

            <DialogMutedNote>
              Cuando guardes la nueva contraseña, la sesión actual se cerrará
              para que vuelvas a ingresar con la clave actualizada.
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
      <Label className="text-sm font-semibold text-slate-800">{label}</Label>

      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-11 rounded-xl border-slate-200 bg-white pr-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />

        <button
          type="button"
          aria-label={visible ? "Ocultar clave" : "Mostrar clave"}
          onClick={onToggleVisible}
          className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-100"
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
