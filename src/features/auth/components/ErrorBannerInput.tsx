"use client";

import { AlertCircle, Clock3, X } from "lucide-react";

export function ErrorBannerInput({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const normalizedMessage = message.trim();
  const isPendingApproval =
    normalizedMessage.toLowerCase().includes("pendiente") &&
    normalizedMessage.toLowerCase().includes("aprob");

  const Icon = isPendingApproval ? Clock3 : AlertCircle;

  return (
    <div
      className={
        isPendingApproval
          ? "rounded-2xl border border-amber-300/70 bg-amber-50/95 shadow-sm"
          : "rounded-2xl border border-red-300/80 bg-red-50/95 shadow-sm"
      }
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div
          className={
            isPendingApproval
              ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
              : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"
          }
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={
              isPendingApproval
                ? "text-sm font-semibold text-amber-900"
                : "text-sm font-semibold text-red-900"
            }
          >
            {isPendingApproval ? "Aprobación pendiente" : "No se pudo iniciar sesión"}
          </p>
          <p
            className={
              isPendingApproval
                ? "mt-1 text-sm leading-5 text-amber-800 break-words"
                : "mt-1 text-sm leading-5 text-red-800 break-words"
            }
          >
            {normalizedMessage}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={
            isPendingApproval
              ? "rounded-full p-1 text-amber-700 transition hover:bg-amber-100"
              : "rounded-full p-1 text-red-700 transition hover:bg-red-100"
          }
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
