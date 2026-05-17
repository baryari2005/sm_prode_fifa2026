"use client";

import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../../403/page";
import { PlantelManager } from "@/features/planteles/components/PlantelManager";


export default function PlantelesPage() {
  const canVerPlanteles = useCan("planteles", "ver");
  const canCrearPlanteles = useCan("planteles", "crear");

  if (!canVerPlanteles) {
    return <AccessDenied403Page />;
  }

  return <PlantelManager canCreate={canCrearPlanteles} />;
}