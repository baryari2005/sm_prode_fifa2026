import { Bolt, Info } from "lucide-react";
import { ResultadoManualHeaderProps } from "../../types/resultado-manual-header.types";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultadoManualHeader({
  headerDescription,
}: ResultadoManualHeaderProps) {
  return (    
    <>
      <CardHeader className="border-b border-white/10 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-xl text-white md:text-2xl">
                <Bolt className="h-6 w-6 shrink-0 text-[#AEEBFF]" />
                Carga manual del resultado
              </CardTitle>
            </div>

            <CardDescription
              className="flex flex-wrap items-center gap-2 text-sm text-white/65"
              icon={<Info className="h-4 w-4 text-white/40" />}
            >
              <span>Partido: {headerDescription}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </>
  );
}



