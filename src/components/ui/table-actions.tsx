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
}

export const TableActions = ({ actions }: TableActionsProps) => {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const action = confirmIndex !== null ? actions[confirmIndex] : null;

  const itemClassName =
    "cursor-pointer rounded-none focus:bg-[#FDBB30] focus:text-slate-900 data-[highlighted]:bg-[#FDBB30] data-[highlighted]:text-slate-900";

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
          <Button variant="ghost" className="h-8 w-8 rounded-2xl p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="rounded-none p-1">
          {actions.map((actionItem, index) => {
            if ("href" in actionItem) {
              return (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className={itemClassName}
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
                  className={itemClassName}
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
                className={itemClassName}
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
