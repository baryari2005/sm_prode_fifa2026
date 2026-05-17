"use client";

import { useState } from "react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Card, CardContent } from "@/components/ui/card";
import { ImportarPartidosHeader } from "@/features/partidos/components/ImportarPartidosHeader";
import { PartidosImportacionApi } from "@/features/partidos/components/PartidosImportacionApi";
import type { FixturePhaseSlug } from "@/features/partidos/constants/fixture-phase-filter.constants";
import {
  cargarPartidosDesdeApiDetallado,
  type CargaPartidosApiResult,
} from "@/features/partidos/services/partidos.service";
import { useCan } from "@/hooks/useCan";

export default function PartidosImportarPage() {
  const canVerPartidos = useCan("partidos", "ver");
  const canCrearPartidos = useCan("partidos", "crear");
  const [importing, setImporting] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<FixturePhaseSlug | "todas">(
    "todas"
  );
  const [result, setResult] = useState<CargaPartidosApiResult | null>(null);

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  async function handleImport() {
    try {
      setImporting(true);
      const response = await cargarPartidosDesdeApiDetallado(selectedPhase);
      setResult(response);
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "No se pudo importar el fixture"
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ImportarPartidosHeader
            canImport={canCrearPartidos}
            importing={importing}
            selectedPhase={selectedPhase}
            onPhaseChange={setSelectedPhase}
            onImport={() => void handleImport()}
          />
          <PartidosImportacionApi result={result} />
        </CardContent>
      </Card>
    </div>
  );
}
