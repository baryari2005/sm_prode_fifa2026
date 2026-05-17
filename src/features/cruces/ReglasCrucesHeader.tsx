import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Network } from "lucide-react";
import Link from "next/link";

export function ReglasCrucesHeader({
    cantCreate,
    title = "Reglas de Cruces",
    icon: Icon = Network,
    description = "Definí cómo se arman los cruces de eliminación directa según la posición en los grupos.",
}: {
    cantCreate: boolean;
    title?: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
}) {
    return (
        <>
            <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Icon className="h-6 w-6" />
                                {title}
                            </CardTitle>
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>{description}</span>
                            <Info className="h-4 w-4 text-slate-400" />
                        </CardDescription>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
                        {!cantCreate && (
                            <Link href="/admin/reglas-cruces/nuevo">
                                <Button
                                    type="button"
                                    className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    Nueva regla
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </CardHeader>
        </>
    );
}