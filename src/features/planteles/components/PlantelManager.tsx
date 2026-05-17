"use client";

import { useRouter } from "next/navigation";

import Loading from "@/app/(dashboard)/loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { PlantelHeader } from "./PlantelHeader";
import { PlantelManagerProps } from "../types/plantel-manager.types";
import { usePlantelManager } from "../hooks/usePlantelManager";
import { PlantelSelectorSummary } from "./PlantelSelectorSummary";
import { PlantelList } from "@/features/planteles/components/PlantelList";
import { PlantelReferences } from "./PlantelReferences";
import { Separator } from "@/components/ui/separator";

export function PlantelManager({
  initialSeleccionId,
  standalone = false,
  canCreate = true,
}: PlantelManagerProps) {
  const router = useRouter();

  const {
    selecciones,
    selectedSeleccionId,
    selectedSeleccion,
    refreshToken,
    loadingInitial,
    importing,
    importingApi,
    importReport,
    stats,
    setSelectedSeleccionId,
    setTotalJugadores,
    handleDelete,
    handleImport,
    handleImportFromApi,
  } = usePlantelManager({ initialSeleccionId });

  const returnTo =
    standalone && selectedSeleccionId
      ? `/admin/paises/${selectedSeleccionId}/plantel`
      : "/admin/planteles";

  function handleBack() {
    router.push("/admin/paises");
  }

  function handleOpenMassImport() {
    router.push("/admin/planteles/importar");
  }

  function handleCreatePlayer() {
    if (!selectedSeleccionId) return;

    router.push(
      `/admin/planteles/nuevo?seleccionId=${selectedSeleccionId}&returnTo=${encodeURIComponent(
        returnTo
      )}`
    );
  }

  function handleEditPlayer(playerId: string) {
    router.push(
      `/admin/planteles/${playerId}?returnTo=${encodeURIComponent(returnTo)}`
    );
  }

  if (loadingInitial) {
    return <Loading />;
  }

  return (
    <div className="grid min-w-0 gap-6 overflow-x-hidden">
      <Card className="min-w-0 overflow-hidden border-white/70 bg-white shadow-sm">
        <CardContent className="min-w-0 space-y-6 p-4 md:p-6">
          <PlantelHeader            
            canCreate={canCreate}
            selectedSeleccionId={selectedSeleccionId}
            selectedSeleccion={selectedSeleccion}
            importing={importing}            
            onBack={handleBack}
            onCreatePlayer={handleCreatePlayer}
            onImport={handleImport}
            onOpenMassImport={handleOpenMassImport}
            />
          <PlantelSelectorSummary
            selecciones={selecciones}
            selectedSeleccionId={selectedSeleccionId}
            selectedSeleccion={selectedSeleccion}
            totalJugadores={stats.totalJugadores}
            onSeleccionChange={setSelectedSeleccionId}
            importingApi={importingApi}
            canCreate={canCreate}
            onImportFromApi={() => void handleImportFromApi()}
          />
          {importReport && importReport.items.length > 0 ? (
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm md:p-5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-emerald-950">
                  {importReport.title}
                </h3>
                <p className="text-sm text-emerald-900/80">
                  {importReport.description}
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {importReport.items.map((item) => (
                  <article
                    key={`${item.source}-${item.seleccionId}`}
                    className="rounded-2xl border border-emerald-200 bg-white/90 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.seleccionNombre}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.source === "file"
                            ? "Origen: archivo"
                            : "Origen: API"}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="border-emerald-200 bg-emerald-100 text-emerald-900"
                      >
                        {item.imported} nuevos
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                      <span>Plantel anterior removido</span>
                      <strong>{item.cleared}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          <div className="min-w-0 border-t border-slate-200/80 pt-4 pb-4:">
          {selectedSeleccionId ? (
             <PlantelList
               seleccionId={selectedSeleccionId}
               seleccionCodigo={selectedSeleccion?.codigo}
               seleccionNombre={selectedSeleccion?.nombre ?? "Selección"}
               refresh={refreshToken}
               onEdit={(player) => handleEditPlayer(player.id)}
               onDelete={(playerId) => void handleDelete(playerId)}
               onTotalChange={setTotalJugadores}
             />
           ) : null}
          </div>
          <Separator />
          <PlantelReferences />
        </CardContent>
      </Card>
    </div>
  );
}
