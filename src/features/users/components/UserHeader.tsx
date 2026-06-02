"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import Link from "next/link";
import { CheckCheck, Info, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { approveAllUsers } from "@/features/users/services/user-client.service";
import { ApproveAllUsersDialog } from "./ApproveAllUsersDialog";

type UserHeaderProps = {
  cantCreate: boolean;
  cantApproveAll?: boolean;
  title?: string;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  onApprovedAll?: () => Promise<void> | void;
};

export function UserHeader({
  cantCreate,
  cantApproveAll = true,
  title = "Usuarios",
  icon: Icon = UserPlus,
  description = "Administrá usuarios, accesos y datos principales desde un mismo panel.",
  onApprovedAll,
}: UserHeaderProps) {
  const [approvingAll, setApprovingAll] = useState(false);
  const [openApproveAllDialog, setOpenApproveAllDialog] = useState(false);

  async function handleApproveAllUsers() {
    if (approvingAll) return;

    setApprovingAll(true);

    try {
      const result = await approveAllUsers();

      if (result.count === 0) {
        toast.info(result.message);
      } else {
        toast.success(result.message);
      }

      setOpenApproveAllDialog(false);

      await onApprovedAll?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Error al aprobar todos los usuarios"
      );
    } finally {
      setApprovingAll(false);
    }
  }

  return (
    <>
    <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icon className="h-6 w-6" />
              {title}
            </CardTitle>
          </div>

          <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{description}</span>
            <Info className="h-4 w-4 text-slate-400" />
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          {!cantApproveAll && (
            <Button
              type="button"
              variant="outline"
                onClick={() => setOpenApproveAllDialog(true)}
              disabled={approvingAll}
                className="h-11 rounded-2xl border-green-200 bg-green-50 font-bold text-green-700 shadow-sm transition hover:bg-green-100 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              {approvingAll ? "Aprobando..." : "Aprobar todos"}
            </Button>
          )}

          {!cantCreate && (
            <Link href="/users/new">
              <Button
                type="button"
                className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
              >
                <Icon className="mr-2 h-4 w-4" />
                Nuevo usuario
              </Button>
            </Link>
          )}
        </div>
      </div>
    </CardHeader>

      <ApproveAllUsersDialog
        open={openApproveAllDialog}
        onOpenChange={setOpenApproveAllDialog}
        isLoading={approvingAll}
        onConfirm={handleApproveAllUsers}
      />
    </>
  );
}
