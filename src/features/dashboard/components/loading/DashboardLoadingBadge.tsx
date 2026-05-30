"use client";

import { usePathname } from "next/navigation";

import { getDashboardLoadingBadgeLabel } from "./dashboard-loading.helpers";

type Props = {
  badgeLabel?: string;
};

export function DashboardLoadingBadge({ badgeLabel }: Props) {
  const pathname = usePathname();
  const resolvedBadgeLabel =
    badgeLabel ?? getDashboardLoadingBadgeLabel(pathname);

  return <>{resolvedBadgeLabel}</>;
}
