"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import Loading from "../../loading";
import AccessDenied403Page from "../../403/page";
import { useReglasCruce } from "@/features/partidos/hooks/useReglasCruce";
import { ReglasCrucesHeader } from "@/features/cruces/ReglasCrucesHeader";
import { ReglasCruceList } from "@/features/cruces/ReglasCruceList";

export default function ReglasCrucesPage() {  
  const canVer = useCan("partidos", "ver");  
    const canCrear = false;

  const {  loading, loadData } = useReglasCruce();

  useEffect(() => {
    if (canVer) {
      loadData();
    }
  }, [canVer, loadData]);

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ReglasCrucesHeader cantCreate={!canCrear} />
          <ReglasCruceList />
        </CardContent>
      </Card>
    </div>
  );
}
