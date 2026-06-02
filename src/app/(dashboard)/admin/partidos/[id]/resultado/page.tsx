"use client";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import AccessDenied403Page from "@/app/(dashboard)/403/page";

import { useResultadoPartidoPage } from "@/features/partidos/hooks/useResultadoPartidoPage";
import { ResultadoPartidoDashboardView } from "@/features/partidos/components/components/resultados/ResultadoPartidoDashboardView";


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

    canVer,
    persistedResultLocked,
    canEditCurrentResult,

    localNombre,
    visitanteNombre,
    escudoLocalUrl,
    escudoVisitanteUrl,

    updateForm,
    updateLocalStat,
    updateVisitanteStat,
    updateIncidencias,

    handleImportStats,
    handleSave,

    cancel,
  } = useResultadoPartidoPage();

  if (loading) {
    return <DashboardLoading badgeLabel="Cargando estadisticas..." />;
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
    <ResultadoPartidoDashboardView
      partido={partido}
      resultado={resultado}
      form={form}
      plantelLocal={plantelLocal}
      plantelVisitante={plantelVisitante}
      saving={saving}
      importingStats={importingStats}
      isResultLocked={persistedResultLocked}
      canEditCurrentResult={canEditCurrentResult}
      localNombre={localNombre}
      visitanteNombre={visitanteNombre}
      escudoLocalUrl={escudoLocalUrl}
      escudoVisitanteUrl={escudoVisitanteUrl}      
      fechaTexto={fechaTexto}
      updateForm={updateForm}
      updateLocalStat={updateLocalStat}
      updateVisitanteStat={updateVisitanteStat}
      updateIncidencias={updateIncidencias}
      handleImportStats={handleImportStats}
      handleSave={handleSave}
      cancel={cancel}
    />
  );
}
