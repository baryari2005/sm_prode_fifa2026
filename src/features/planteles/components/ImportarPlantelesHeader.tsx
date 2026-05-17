"use client";

import { Download, Globe, Info, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ImportarHeaderProps = {
    canImport: boolean;
    importing: boolean;
    onImport: () => void;
};

export function ImportarPlantelesHeader({
    canImport,
    importing,
    onImport,
}: ImportarHeaderProps) {
    return (
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Globe className="h-6 w-6" />
                            Importacion masiva de planteles
                        </CardTitle>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>Ejecuta la recarga completa de los planteles desde la API y revisa el detalle por seleccion.</span>
                        <Info className="h-4 w-4 text-slate-400" />
                    </CardDescription>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
                    <Button
                        type="button"
                        onClick={onImport}
                        disabled={!canImport || importing}
                        className="rounded-2xl bg-[#39A935] font-semibold text-white hover:bg-[#247A28]"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {importing ? (
                            <span className="inline-flex items-center gap-2">
                                <RefreshCw className="animate-spin" size={16} />
                                Importando...
                            </span>
                        ) : (
                            "Importar todos los planteles"
                        )}
                    </Button>
                </div>
            </div>
        </CardHeader>
    );
}
