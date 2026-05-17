import Link from "next/link";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ShieldCheck, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  canCreate: boolean;
};

export function RolesHeader({ canCreate }: Props) {
  return (
    <>
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShieldCheck className="h-6 w-6" />
                Roles
              </CardTitle>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Configurá perfiles y permisos para ordenar el acceso al sistema.</span>
              <Info className="h-4 w-4 text-slate-400" />
            </CardDescription>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            {canCreate && (
              <Link href="/roles/new">
                <Button
                  type="button"
                  className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                >
                  <ShieldPlus className="w-4 h-4 mr-2" />
                  Nuevo Rol
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader >
    </>
  );
}
