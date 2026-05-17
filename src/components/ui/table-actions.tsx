"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

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
    "rounded-none cursor-pointer focus:bg-[#FDBB30] focus:text-slate-900 data-[highlighted]:bg-[#FDBB30] data-[highlighted]:text-slate-900";

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
      {action && "onConfirm" in action && (
        <ConfirmDialog
          open={confirmIndex !== null}
          title={action.confirmTitle}
          description={action.confirmDescription}
          confirmLabel={action.confirmActionLabel}
          icon={action.confirmIcon}
          loading={loading}
          onConfirm={handleConfirm}
          onClose={() => setConfirmIndex(null)}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-2xl p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="rounded-none p-1">
          {actions.map((action, index) => {
            if ("href" in action) {
              return (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className={itemClassName}
                >
                  <Link href={action.href}>
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            }

            if ("onClick" in action) {
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className={itemClassName}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={index}
                onClick={() => setConfirmIndex(index)}
                className={itemClassName}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};