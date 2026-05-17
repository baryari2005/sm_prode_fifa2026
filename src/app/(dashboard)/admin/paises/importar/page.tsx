"use client";

import { useState } from "react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Card, CardContent } from "@/components/ui/card";
import { ImportarHeader } from "@/features/paises/components/ImportarHeader";
import {
  PaisesImportacionApi,
  type PaisesImportResponse,
} from "@/features/paises/components/PaisesImportacionApi";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";

export default function PaisesImportarPage() {
  const canVerPaises = useCan("paises", "ver");
  const canImport = useCan("paises", "importar");

  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<PaisesImportResponse | null>(null);

  if (!canVerPaises) {
    return <AccessDenied403Page />;
  }

  async function handleImport() {
    try {
      setImporting(true);
      const response =
        await axiosInstance.post<PaisesImportResponse>("/paises/import-api");

      setResult(response.data);
      toast.success(
        response.data.message ??
        "Selecciones sincronizadas correctamente desde la API"
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron importar las selecciones desde la API");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ImportarHeader
            canImport={canImport}
            importing={importing}
            onImport={() => void handleImport()}
          />          
          <PaisesImportacionApi result={result} />
        </CardContent>
      </Card>
    </div>
  );
}
