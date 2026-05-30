"use client";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { useCan } from "@/hooks/useCan";
import { SimulatorPage } from "@/features/world-cup-simulator/components/SimulatorPage";

export default function SimuladorMundialPage() {
  const canView = useCan("partidos", "ver");

  if (!canView) {
    return <AccessDenied403Page />;
  }

  return <SimulatorPage />;
}
