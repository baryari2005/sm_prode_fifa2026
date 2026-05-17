import type { Stat } from "@/features/dashboard/types/types";
import type { DashboardStatsParams } from "../../types/dashboardBuilders";
import { buildDocumentsStat } from "./buildDocumentsStat";
import { buildHolidayStat } from "./buildHolidayStat";

export function buildDashboardStats({
  documents,
  holiday,
}: DashboardStatsParams): Stat[] {
  return [
    buildDocumentsStat(documents),
    buildHolidayStat(holiday),
  ];
}