"use client";

import { useEffect, useState } from "react";
import { Clock3, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type LiveRefreshBadgeProps = {
  isRefreshing: boolean;
  nextRefreshIn: number;
  lastRefreshAt?: Date | null;
  shortText?: boolean;
  suffix?: string | null;
  className?: string;
};

export function LiveRefreshBadge({
  isRefreshing,
  nextRefreshIn,
  lastRefreshAt,
  shortText = false,
  suffix,
  className,
}: LiveRefreshBadgeProps) {
  const [showJustUpdated, setShowJustUpdated] = useState(false);

  useEffect(() => {
    if (!lastRefreshAt || isRefreshing) return;

    setShowJustUpdated(true);

    const timeoutId = window.setTimeout(() => {
      setShowJustUpdated(false);
    }, 4_000);

    return () => window.clearTimeout(timeoutId);
  }, [lastRefreshAt, isRefreshing]);

  const statusText = isRefreshing
    ? "Actualizando..."
    : showJustUpdated
      ? "Actualizado recien"
      : `Actualiza en ${nextRefreshIn}s`;

  const detailsText =
    shortText || !lastRefreshAt
      ? ""
      : ` · ultimo refresh ${lastRefreshAt.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`;

  return (
    <Badge
      className={
        className ??
        "inline-flex max-w-full items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
      }
    >
      {isRefreshing ? (
        <RefreshCw className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin" />
      ) : (
        <Clock3 className="mr-1.5 h-3.5 w-3.5 shrink-0" />
      )}

      <span className="truncate">
        {statusText}
        {detailsText}
        {suffix ? ` · ${suffix}` : ""}
      </span>
    </Badge>
  );
}
