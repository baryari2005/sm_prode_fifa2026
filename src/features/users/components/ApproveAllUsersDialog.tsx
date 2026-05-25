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
import { Button } from "@/components/ui/button";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
  DialogShell,
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
      <AlertDialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogShell>
          <DialogHero
            icon={<UsersRound className="h-6 w-6 text-white" />}
            title={
              <AlertDialogTitle className="text-xl font-black leading-tight text-white">
                Aprobar usuarios pendientes
              </AlertDialogTitle>
            }
            description={
              <AlertDialogDescription className="mt-2 text-sm leading-5 text-white/80">
                Vas a habilitar el acceso de todos los usuarios que todavía
                están pendientes.
              </AlertDialogDescription>
            }
            className="from-emerald-500 via-green-600 to-slate-900"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<CheckCheck className="h-5 w-5 text-emerald-600" />}
              title="¿Querés aprobar todos los usuarios pendientes?"
              description="Una vez aprobados, podrán iniciar sesión y participar del Prode Mundial 2026."
              className="border-emerald-100 bg-emerald-50"
              titleClassName="text-emerald-900"
              descriptionClassName="text-emerald-700"
            />

            <DialogMutedNote>
              Esta acción solo afecta a usuarios pendientes. Los usuarios ya
              aprobados no se modifican.
            </DialogMutedNote>
          </DialogFormSection>

          <AlertDialogFooter className="gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-end">
            <AlertDialogCancel
              disabled={isLoading}
              className="h-11 rounded-xl border-slate-200 px-5 font-bold"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </AlertDialogCancel>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="h-11 rounded-xl bg-emerald-600 px-5 font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        </DialogShell>
      </AlertDialogContent>
    </AlertDialog>
  );
}
