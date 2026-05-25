"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {  
  ImagePlus,
  FileImage,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
  DialogShell,
} from "@/components/ui/dialog-shell";
import { AvatarUploader } from "@/features/settings/components/AvatarUploader";
import { useAvatarStaging } from "@/features/users/hooks/useAvatarStaging";
import { pathFromPublicUrl } from "@/features/users/lib/utils";
import { useAuth } from "@/stores/auth";
import { formatMessage } from "@/utils/formatters";
import { changeMyAvatar } from "@/lib/api/account";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function ChangeAvatarDialog({ open, onOpenChange }: Props) {
  const { user, logout } = useAuth();
  const { tmpPath, setTmpPath, commit } = useAvatarStaging();
  const oldKey = pathFromPublicUrl(user?.avatarUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setTmpPath(null);
  }, [open, setTmpPath]);

  const onSave = async () => {
    if (!tmpPath) {
      toast.error("Seleccioná una imagen primero");
      return;
    }

    try {
      setSaving(true);

      const result = await commit(`users/${user!.id}`, oldKey);
      await changeMyAvatar({ avatarUrl: result.publicUrl });

      toast.success("Avatar actualizado. Volvé a iniciar sesión.");
      onOpenChange(false);
      setTimeout(() => logout(), 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          error.message ??
          "No se pudo actualizar el avatar";

        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("No se pudo actualizar el avatar");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">Cambiar avatar</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para actualizar tu avatar de acceso.
        </DialogDescription>

        <DialogShell>
          <DialogHero
            icon={<FileImage className="h-6 w-6 text-white" />}
            title="Cambiar avatar"
            description="Actualizá tu imagen de perfil con una experiencia visual alineada al resto de acciones de cuenta."
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<ImagePlus className="h-5 w-5 text-sky-600" />}
              title="Subí una nueva imagen"
              description="Elegí un avatar claro y reconocible. El cambio se aplicará a tu perfil después de guardar."
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <AvatarUploader
                currentUrl={user?.avatarUrl}
                onTempUploaded={({ tmpPath: nextTmpPath }) => setTmpPath(nextTmpPath)}
              />
            </div>

            <DialogMutedNote>
              Por seguridad, después de actualizar tu avatar vas a tener que
              iniciar sesión nuevamente.
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
              onClick={onSave}
              disabled={saving || !tmpPath}
              className="h-11 rounded-xl bg-sky-600 px-5 font-black text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={18} />
                  {formatMessage("Guardando...")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">                  
                  <Save className="h-4 w-4" />
                  Guardar avatar
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogShell>
      </DialogContent>
    </Dialog>
  );
}
