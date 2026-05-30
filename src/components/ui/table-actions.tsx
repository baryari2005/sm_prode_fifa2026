"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog, type ConfirmDialogTone } from "@/components/ui/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TableAction =
  | {
      label: string;
      icon: React.ReactNode;
      href: string;
    }
  | {
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
    }
  | {
      label: string;
      icon: React.ReactNode;
      onConfirm: () => Promise<void> | void;
      confirmTitle?: string;
      confirmDescription?: string;
      confirmActionLabel?: string;
      confirmIcon?: React.ReactNode;
      confirmTone?: ConfirmDialogTone;
      confirmNote?: string;
    };

interface TableActionsProps {
  id: string;
  actions: TableAction[];
  theme?: "default" | "users-brand" | "roles-brand";
}

export const TableActions = ({ actions, theme = "default" }: TableActionsProps) => {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const action = confirmIndex !== null ? actions[confirmIndex] : null;
  const isBrandedDark = theme === "users-brand" || theme === "roles-brand";

  const itemClassName =
    isBrandedDark
      ? "cursor-pointer rounded-2xl border border-transparent px-3 py-2 text-[0.95rem] font-medium text-white transition focus:bg-[#FDBB30] focus:text-[#1E2C46] focus:border-[#F7CF74] data-[highlighted]:bg-[#FDBB30] data-[highlighted]:text-[#1E2C46] data-[highlighted]:border-[#F7CF74] [&_svg]:!text-current [&_svg]:size-[1.05rem] [&_svg]:shrink-0"
      : "cursor-pointer rounded-none focus:bg-[#FDBB30] focus:text-slate-900 data-[highlighted]:bg-[#FDBB30] data-[highlighted]:text-slate-900";

  function getBrandedItemClassName(label: string) {
    if (label === "Eliminar") {
      return "cursor-pointer rounded-2xl border border-rose-300/12 bg-rose-400/8 px-3 py-2 text-[0.95rem] font-medium text-rose-100 transition hover:bg-rose-400/12 hover:text-white focus:bg-rose-500/16 focus:text-white focus:border-rose-300/22 data-[highlighted]:bg-rose-500/16 data-[highlighted]:text-white data-[highlighted]:border-rose-300/22 [&_svg]:!text-current [&_svg]:size-[1.05rem] [&_svg]:shrink-0";
    }

    if (label === "Aprobar") {
      return "cursor-pointer rounded-2xl border border-[#FAB438]/18 bg-[#FAB438]/10 px-3 py-2 text-[0.95rem] font-medium text-[#FFE4A3] transition hover:bg-[#FAB438]/14 hover:text-white focus:bg-[#FDBB30] focus:text-[#1E2C46] focus:border-[#F7CF74] data-[highlighted]:bg-[#FDBB30] data-[highlighted]:text-[#1E2C46] data-[highlighted]:border-[#F7CF74] [&_svg]:!text-current [&_svg]:size-[1.05rem] [&_svg]:shrink-0";
    }

    if (label === "Editar") {
      return itemClassName;
    }

    return itemClassName;
  }

  async function handleConfirm() {
    if (!action || !("onConfirm" in action)) return;

    try {
      setLoading(true);
      await action.onConfirm();
      setConfirmIndex(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {action && "onConfirm" in action ? (
        <ConfirmDialog
          open={confirmIndex !== null}
          title={action.confirmTitle}
          description={action.confirmDescription}
          confirmLabel={action.confirmActionLabel}
          icon={action.confirmIcon}
          tone={action.confirmTone}
          note={action.confirmNote}
          loading={loading}
          onConfirm={handleConfirm}
          onClose={() => setConfirmIndex(null)}
        />
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={
              isBrandedDark
                ? "h-10 w-10 rounded-2xl border border-[#5993B6]/24 bg-[#1E2C46]/92 p-0 text-[#AEEBFF] shadow-[0_14px_34px_rgba(2,6,23,0.18)] transition hover:bg-[#243754] hover:text-white"
                : "h-8 w-8 rounded-2xl p-0"
            }
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={
            isBrandedDark
              ? "min-w-[210px] rounded-[24px] border border-[#5993B6]/24 bg-[#1E2C46]/98 p-2 text-white shadow-[0_24px_56px_rgba(2,6,23,0.34)]"
              : "rounded-none p-1"
          }
        >
          {actions.map((actionItem, index) => {
            const currentItemClassName = isBrandedDark
              ? getBrandedItemClassName(actionItem.label)
              : itemClassName;

            if ("href" in actionItem) {
              return (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className={currentItemClassName}
                >
                  <Link href={actionItem.href}>
                    {actionItem.icon}
                    <span className="ml-2">{actionItem.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            }

            if ("onClick" in actionItem) {
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={actionItem.onClick}
                  className={currentItemClassName}
                >
                  {actionItem.icon}
                  <span className="ml-2">{actionItem.label}</span>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={index}
                onClick={() => setConfirmIndex(index)}
                className={currentItemClassName}
              >
                {actionItem.icon}
                <span className="ml-2">{actionItem.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
