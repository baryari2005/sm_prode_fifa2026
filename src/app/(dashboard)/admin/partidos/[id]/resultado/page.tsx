"use client";

import { RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";

import { ResultadoManualHeader } from "@/features/partidos/components/resultados/ResultadoManualHeader";
import { ResultadoResumenEditableCard } from "@/features/partidos/components/resultados/ResultadoResumenEditableCard";
import { ResultadoTabs } from "@/features/partidos/components/resultados/ResultadoTabs";

import { useResultadoPartidoPage } from "@/features/partidos/hooks/useResultadoPartidoPage";

export default function ResultadoPartidoPage() {
  const {
    partido,
    resultado,
    form,

    plantelLocal,
    plantelVisitante,

    loading,
    saving,
    importingStats,
    importingGoals,

    canVer,
    canSubmit,

    localNombre,
    visitanteNombre,
    localCodigo,
    visitanteCodigo,
    escudoLocalUrl,
    escudoVisitanteUrl,
    headerDescription,

    updateForm,
    updateLocalStat,
    updateVisitanteStat,
    updateLocalLineup,
    updateVisitanteLineup,
    updateLocalGoalDetails,
    updateVisitanteGoalDetails,

    handleImportStats,
    handleImportGoals,
    handleSave,

    cancel,
  } = useResultadoPartidoPage();

  if (loading) {
    return <Loading />;
  }

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (!partido) {
    return null;
  }

  const fechaTexto = partido.fecha
    ? new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(partido.fecha))
    : undefined;

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <ResultadoManualHeader headerDescription={headerDescription} />

        <ResultadoResumenEditableCard
          competencia="Mundial 2026"
          fechaTexto={fechaTexto}
          local={{
            nombre: localNombre,
            escudoUrl: escudoLocalUrl,
          }}
          visitante={{
            nombre: visitanteNombre,
            escudoUrl: escudoVisitanteUrl,
          }}
          form={form}
          plantelLocal={plantelLocal}
          plantelVisitante={plantelVisitante}
          importing={importingGoals}
          onChange={updateForm}
          onLocalGoalsChange={updateLocalGoalDetails}
          onVisitanteGoalsChange={updateVisitanteGoalDetails}
          onImportGoals={handleImportGoals}
        />

        <ResultadoTabs
          localNombre={localNombre}
          visitanteNombre={visitanteNombre}
          localCodigo={localCodigo}
          visitanteCodigo={visitanteCodigo}
          localBanderaUrl={escudoLocalUrl}
          visitanteBanderaUrl={escudoVisitanteUrl}
          estadisticasLocal={form.estadisticasLocal}
          estadisticasVisitante={form.estadisticasVisitante}
          alineacionLocal={form.alineacionLocal}
          alineacionVisitante={form.alineacionVisitante}
          plantelLocal={plantelLocal}
          plantelVisitante={plantelVisitante}
          importingStats={importingStats}
          onImportStats={handleImportStats}
          onLocalStatChange={updateLocalStat}
          onVisitanteStatChange={updateVisitanteStat}
          onLocalLineupChange={updateLocalLineup}
          onVisitanteLineupChange={updateVisitanteLineup}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={cancel}>
            Cancelar
          </Button>

          <Button onClick={handleSave} disabled={!canSubmit || saving}>
            {saving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {saving
              ? "Guardando..."
              : resultado
                ? "Actualizar resultado"
                : "Guardar resultado"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
