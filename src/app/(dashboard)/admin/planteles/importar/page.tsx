"use client";

import { useState } from "react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Card, CardContent } from "@/components/ui/card";
import { ImportarPlantelesHeader } from "@/features/planteles/components/ImportarPlantelesHeader";
import {
  ImportResponse,
  PlantelesImportacionMasiva,
} from "@/features/planteles/components/PlantelesImportacionMasiva";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";

export default function PlantelesImportarPage() {
  const canVerPlanteles = useCan("planteles", "ver");
  const canImport = useCan("planteles", "importar");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);

  if (!canVerPlanteles) {
    return <AccessDenied403Page />;
  }

  async function handleImport() {
    try {
      setImporting(true);

      const response = await axiosInstance.post<ImportResponse>(
        "/planteles/import-api"
      );
      setResult(response.data);

      toast.success(
        response.data.message ?? "Importacion de planteles completada"
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo completar la importacion masiva de planteles");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ImportarPlantelesHeader
            canImport={canImport}
            importing={importing}
            onImport={() => void handleImport()}
          />
          <PlantelesImportacionMasiva result={result} />
        </CardContent>
      </Card>
    </div>
  );
}
