"use client";

import { CheckCheck, Loader2, UsersRound, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BrandDialogFrame,
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
  BRAND_DIALOG_FOOTER_CLASSNAME,
  BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME,
} from "@/components/ui/brand-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
} from "@/components/ui/dialog-shell";

type ApproveAllUsersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onConfirm: () => Promise<void> | void;
};

export function ApproveAllUsersDialog({
  open,
  onOpenChange,
  isLoading = false,
  onConfirm,
}: ApproveAllUsersDialogProps) {
  async function handleConfirm() {
    if (isLoading) return;

    await onConfirm();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <BrandDialogFrame>
          <DialogHero
            icon={<UsersRound className="h-6 w-6 text-[#FAB438]" />}
            title={
              <AlertDialogTitle className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                Aprobar usuarios pendientes
              </AlertDialogTitle>
            }
            description={
              <AlertDialogDescription className="mt-2 text-sm leading-5 text-white/80">
                Vas a habilitar el acceso de todos los usuarios que todavía
                están pendientes.
              </AlertDialogDescription>
            }
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName="border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<CheckCheck className="h-5 w-5 text-[#FFE4A3]" />}
              title="¿Querés aprobar todos los usuarios pendientes?"
              description="Una vez aprobados, podrán iniciar sesión y participar del Prode Mundial 2026."
              className="border border-[#FAB438]/22 bg-[#FAB438]/10"
              titleClassName="text-[#FFF2C8]"
              descriptionClassName="text-white/74"
            />

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              Esta acción solo afecta a usuarios pendientes. Los usuarios ya
              aprobados no se modifican.
            </DialogMutedNote>
          </DialogFormSection>

          <AlertDialogFooter className={BRAND_DIALOG_FOOTER_CLASSNAME}>
            <AlertDialogCancel
              disabled={isLoading}
              className={BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </AlertDialogCancel>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Aprobando...
                </span>
              ) : (
                "Aprobar todos"
              )}
            </Button>
          </AlertDialogFooter>
        </BrandDialogFrame>
      </AlertDialogContent>
    </AlertDialog>
  );
}
