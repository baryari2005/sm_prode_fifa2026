import { CardHeader } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

export function ExportUsersHeader() {
  return (
    <CardHeader className="px-4 pb-4 pt-4 md:px-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-950">
          <FileSpreadsheet className="h-7 w-7 text-[#008C93]" />
          Exportar usuarios
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Generá archivos listos para descargar con la información consolidada del sistema.
        </p>
      </div>
    </CardHeader>
  );
}
