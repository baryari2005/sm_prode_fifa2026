"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileImage,
  ImagePlus,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  BrandDialogFrame,
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
  BRAND_DIALOG_FOOTER_CLASSNAME,
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
import { AvatarUploader } from "@/features/settings/components/AvatarUploader";
import { useAvatarStaging } from "@/features/users/hooks/useAvatarStaging";
import { pathFromPublicUrl } from "@/features/users/lib/utils";
import { changeMyAvatar } from "@/lib/api/account";
import { useAuth } from "@/stores/auth";
import { formatMessage } from "@/utils/formatters";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function ChangeAvatarDialog({ open, onOpenChange }: Props) {
  const { user, logout } = useAuth();
  const { tmpPath, setTmpPath, commit } = useAvatarStaging();
  const oldKey = pathFromPublicUrl(user?.avatarUrl);
  const [saving, setSaving] = useState(false);
  const avatarFallback =
    [user?.nombre, user?.apellido]
      .filter(Boolean)
      .map((value) => value?.trim().charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "US";

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
      <DialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <DialogTitle className="sr-only">Cambiar avatar</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para actualizar tu avatar de acceso.
        </DialogDescription>

        <BrandDialogFrame>
          <DialogHero
            icon={<FileImage className="h-6 w-6 text-[#FAB438]" />}
            title={
              <span className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                Cambiar avatar
              </span>
            }
            description="Actualizá tu imagen de perfil con una experiencia visual alineada al resto de acciones de cuenta."
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName="border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<ImagePlus className="h-5 w-5 text-[#AEEBFF]" />}
              title="Subí una nueva imagen"
              description="Elegí un avatar claro y reconocible. El cambio se aplicará a tu perfil después de guardar."
              className="border border-[#5993B6]/20 bg-[#5993B6]/10"
              titleClassName="text-[#EAF8FF]"
              descriptionClassName="text-white/74"
            />

            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <AvatarUploader
                currentUrl={user?.avatarUrl}
                fallbackText={avatarFallback}
                onTempUploaded={({ tmpPath: nextTmpPath }) =>
                  setTmpPath(nextTmpPath)
                }
              />
            </div>

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              Por seguridad, después de actualizar tu avatar vas a tener que
              iniciar sesión nuevamente.
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
              onClick={onSave}
              disabled={saving || !tmpPath}
              className={BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME}
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
        </BrandDialogFrame>
      </DialogContent>
    </Dialog>
  );
}
