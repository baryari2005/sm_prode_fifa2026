"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";

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
    heroIcon: ReactNode;
    heroIconClassName: string;
    highlightIcon: ReactNode;
    highlightClassName: string;
    highlightTitleClassName: string;
    highlightDescriptionClassName: string;
    confirmButtonClassName: string;
    confirmIcon: ReactNode;
  }
> = {
  primary: {
    heroIcon: <ShieldCheck className="h-6 w-6 text-[#FAB438]" />,
    heroIconClassName:
      "border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]",
    highlightIcon: <ShieldCheck className="h-5 w-5 text-[#FFE4A3]" />,
    highlightClassName: "border border-[#FAB438]/22 bg-[#FAB438]/10",
    highlightTitleClassName: "text-[#FFF2C8]",
    highlightDescriptionClassName: "text-white/74",
    confirmButtonClassName: BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME,
    confirmIcon: <ShieldCheck className="h-4 w-4" />,
  },
  danger: {
    heroIcon: <ShieldX className="h-6 w-6 text-[#FCA5A5]" />,
    heroIconClassName:
      "border border-rose-300/18 bg-rose-400/10 ring-0 shadow-[0_12px_30px_rgba(127,29,29,0.18)]",
    highlightIcon: <AlertTriangle className="h-5 w-5 text-[#FCA5A5]" />,
    highlightClassName: "border border-rose-300/18 bg-rose-400/10",
    highlightTitleClassName: "text-[#FFE0E0]",
    highlightDescriptionClassName: "text-white/74",
    confirmButtonClassName:
      "h-11 rounded-2xl border border-rose-300/18 bg-rose-500/88 px-5 font-black text-white shadow-[0_14px_34px_rgba(159,18,57,0.24)] transition hover:bg-rose-500 disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none",
    confirmIcon: <ShieldX className="h-4 w-4" />,
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
      <DialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <BrandDialogFrame>
          <DialogHero
            icon={styles.heroIcon}
            title={
              <span className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                {title}
              </span>
            }
            description={description}
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName={styles.heroIconClassName}
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={styles.highlightIcon}
              title={title}
              description={description}
              className={styles.highlightClassName}
              titleClassName={styles.highlightTitleClassName}
              descriptionClassName={styles.highlightDescriptionClassName}
            />

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              {note ??
                "Revisá esta acción antes de confirmar porque puede impactar datos visibles del sistema."}
            </DialogMutedNote>
          </DialogFormSection>

          <DialogFooter className={BRAND_DIALOG_FOOTER_CLASSNAME}>
            <DialogClose asChild>
              <Button
                variant="outline"
                className={BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME}
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                {cancelLabel}
              </Button>
            </DialogClose>

            <Button
              onClick={onConfirm}
              disabled={loading}
              className={cn(styles.confirmButtonClassName)}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {icon ?? styles.confirmIcon}
                  <span>{confirmLabel}</span>
                </span>
              )}
            </Button>
          </DialogFooter>
        </BrandDialogFrame>
      </DialogContent>
    </Dialog>
  );
}
