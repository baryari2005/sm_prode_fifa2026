"use client";

import { useEffect } from "react";
import { useCan } from "@/hooks/useCan";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "../../403/page";
import { useReglasCruce } from "@/features/partidos/hooks/useReglasCruce";
import { ReglasCrucesOverview } from "@/features/cruces/ReglasCrucesOverview";

export default function ReglasCrucesPage() {  
  const canVer = useCan("partidos", "ver");  
  const canCrear = useCan("partidos", "crear");

  const { loading, loadData, reglas } = useReglasCruce();

  useEffect(() => {
    if (canVer) {
      loadData();
    }
  }, [canVer, loadData]);

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading source="Admin reglas cruces" />;
  }

  return (
    <ReglasCrucesOverview reglas={reglas} canCreate={canCrear} />
  );
}
