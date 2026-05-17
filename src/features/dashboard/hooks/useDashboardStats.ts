"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePendingDocuments } from "@/features/dashboard/hooks/usePendingDocuments";
import { buildDashboardStats } from "../lib/stats/buildDashboardStats";
import { useCan } from "@/hooks/useCan";

export function useDashboardStats() {
  const router = useRouter();
  const pathname = usePathname();

  const canViewDocuments = useCan("recibos", "ver");

  const { count: pendingDocs, loading: loadingDocs } = usePendingDocuments();

  const stats = useMemo(() => {
    return buildDashboardStats({
      documents: {
        canApprove: false,
        canLoad: false,
        canView: canViewDocuments,
        loadingDocs,
        pendingDocs,
        pathname,
        onGoReceipts: () => {
          if (pathname.startsWith("/receipts")) {
            router.push(`/receipts?v=${Date.now()}`);
          } else {
            router.push("/receipts");
          }
        },
      },
      holiday: {
        loadingHoliday: false,
        nextHoliday: null,
      },
    });
  }, [
    canViewDocuments,
    loadingDocs,
    pendingDocs,
    pathname,
    router,
  ]);

  return { stats };
}