import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Info, Languages, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

export function PaisHeader({
    cantCreate,
    updatingLanguage = false,
    onUpdateLanguage,
}: {
    cantCreate: boolean;
    updatingLanguage?: boolean;
    onUpdateLanguage?: () => void;
}) {
    return (
        <>
            <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Globe className="h-6 w-6" />
                                Selecciones
                            </CardTitle>
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Gestioná selecciones, códigos y banderas disponibles para el fixture.</span>
                            <Info className="h-4 w-4 text-slate-400" />
                        </CardDescription>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
                        {onUpdateLanguage ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onUpdateLanguage}
                                disabled={updatingLanguage}
                                className="h-11 rounded-2xl border-slate-200 bg-white"
                            >
                                {updatingLanguage ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Modificando...
                                    </>
                                ) : (
                                    <>
                                        <Languages className="mr-2 h-4 w-4" />
                                        Modificar idioma
                                    </>
                                )}
                            </Button>
                        ) : null}
                        {!cantCreate && (
                            <Link href="/admin/paises/nuevo">
                                <Button
                                    type="button"
                                    className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva selección
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </CardHeader>
        </>
    );
}
