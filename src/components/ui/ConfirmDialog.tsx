"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";

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
import { cn } from "@/lib/utils";

export type ConfirmDialogTone = "primary" | "danger";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  icon?: ReactNode;
  tone?: ConfirmDialogTone;
  note?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
};

const toneStyles: Record<
  ConfirmDialogTone,
  {
    heroClassName: string;
    highlightClassName: string;
    highlightTitleClassName: string;
    highlightDescriptionClassName: string;
    confirmButtonClassName: string;
    defaultHeroIcon: ReactNode;
    defaultHighlightIcon: ReactNode;
    defaultConfirmIcon: ReactNode;
  }
> = {
  primary: {
    heroClassName: "from-emerald-500 via-green-600 to-slate-900",
    highlightClassName: "border-emerald-100 bg-emerald-50",
    highlightTitleClassName: "text-emerald-900",
    highlightDescriptionClassName: "text-emerald-700",
    confirmButtonClassName:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700",
    defaultHeroIcon: <ShieldCheck className="h-6 w-6 text-white" />,
    defaultHighlightIcon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    defaultConfirmIcon: <ShieldCheck className="h-4 w-4" />,
  },
  danger: {
    heroClassName: "from-rose-500 via-red-600 to-slate-900",
    highlightClassName: "border-rose-100 bg-rose-50",
    highlightTitleClassName: "text-rose-900",
    highlightDescriptionClassName: "text-rose-700",
    confirmButtonClassName:
      "bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700",
    defaultHeroIcon: <ShieldX className="h-6 w-6 text-white" />,
    defaultHighlightIcon: <AlertTriangle className="h-5 w-5 text-rose-600" />,
    defaultConfirmIcon: <ShieldX className="h-4 w-4" />,
  },
};

export function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  icon,
  tone = "primary",
  note,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const styles = toneStyles[tone];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <DialogShell>
          <DialogHero
            icon={styles.defaultHeroIcon}
            title={title}
            description={description}
            className={styles.heroClassName}
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={styles.defaultHighlightIcon}
              title={title}
              description={description}
              className={styles.highlightClassName}
              titleClassName={styles.highlightTitleClassName}
              descriptionClassName={styles.highlightDescriptionClassName}
            />

            <DialogMutedNote>
              {note ??
                "Revisá esta acción antes de confirmar porque puede impactar datos visibles del sistema."}
            </DialogMutedNote>
          </DialogFormSection>

          <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-slate-200 px-5 font-bold"
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                {cancelLabel}
              </Button>
            </DialogClose>

            <Button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "h-11 rounded-xl px-5 font-black",
                styles.confirmButtonClassName
              )}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {icon ?? styles.defaultConfirmIcon}
                  <span>{confirmLabel}</span>
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogShell>
      </DialogContent>
    </Dialog>
  );
}
