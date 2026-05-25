import { FlagImage } from "@/components/ui/flag-image";

import type { SeleccionOption } from "../types";

export function SeleccionFlag({
  seleccion,
  size = "md",
}: {
  seleccion: SeleccionOption | null;
  size?: "sm" | "md";
}) {
  return (
    <FlagImage
      bandera={seleccion?.bandera}
      codigo={seleccion?.codigo}
      nombre={seleccion?.nombre ?? "selección"}
      widthClassName={size === "sm" ? "w-8" : "w-10"}
      heightClassName={size === "sm" ? "h-6" : "h-8"}
      fallbackTextClassName="text-[10px]"
    />
  );
}
