"use client";

import { useParams } from "next/navigation";
import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { useCan } from "@/hooks/useCan";
import { PlantelManager } from "@/features/planteles/components/PlantelManager";

export default function PlantelSeleccionPage() {
  const params = useParams<{ id: string }>();
  const canVer = useCan("paises", "ver");

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  return <PlantelManager initialSeleccionId={params.id} standalone />;
}
