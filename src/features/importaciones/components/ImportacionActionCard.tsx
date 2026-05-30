"use client";

import type { LucideIcon } from "lucide-react";
import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SUBCARD } from "@/features/dashboard/components/home/dashboard-home.styles";

type ImportacionActionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  statusLabel: string;
  tone?: "sky" | "gold";
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
  busyLabel?: string;
};

export function ImportacionActionCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  statusLabel,
  tone = "sky",
  onClick,
  disabled,
  busy,
  busyLabel,
}: ImportacionActionCardProps) {
  const toneClassName =
    tone === "gold"
      ? "bg-[#FAB438]/14 text-[#FFE4A3]"
      : "bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <article className={`rounded-[24px] p-5 ${DASHBOARD_SUBCARD}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-black text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-white/68">{description}</p>
          </div>
        </div>

        <Badge className="rounded-full border-white/10 bg-white/10 text-white/76 hover:bg-white/10">
          {statusLabel}
        </Badge>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={onClick}
          disabled={disabled || busy}
          className="rounded-2xl bg-[#5993B6] text-white hover:bg-[#4B84A6]"
        >
          {busy ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {busyLabel ?? "Procesando..."}
            </>
          ) : (
            ctaLabel
          )}
        </Button>
      </div>
    </article>
  );
}
