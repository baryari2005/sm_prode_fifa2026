"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExportUsersHeader } from "./ExportUsersHeader";
import { ExportUsersAction } from "./ExportUsersAction";
import { ExportUsersStats } from "./ExportUsersStats";
import { useExportUsers } from "../hooks/useExportUsers";

export function ExportUsersView() {
  const { loading, stats, handleExport } = useExportUsers();

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <ExportUsersHeader />

        <CardContent className="space-y-6 p-4 pt-0 md:p-6 md:pt-0">
          <p className="text-sm text-slate-500">
            Genera un archivo Excel con dos hojas: <b>Usuarios</b> y <b>Legajos de empleados</b>.
          </p>

          <ExportUsersAction loading={loading} onExport={handleExport} />

          <Separator />

          <ExportUsersStats stats={stats} />
        </CardContent>
      </Card>
    </div>
  );
}
