import type { PartidoDetalleViewModel } from "@/features/partidos/types/partido-detalle.types";

import { PartidoDetalleHeader } from "./PartidoDetalleHeader";
import { PartidoDetalleSurface } from "./PartidoDetalleSurface";
import { PartidoDetalleTabs } from "./PartidoDetalleTabs";

type PartidoDetalleViewProps = {
  detalle: PartidoDetalleViewModel;
  readonly?: boolean;
  showAdminActions?: boolean;
};

export function PartidoDetalleView({
  detalle,
  readonly = false,
  showAdminActions = false,
}: PartidoDetalleViewProps) {
  return (
    <div
      data-readonly={readonly ? "true" : "false"}
      data-show-admin-actions={showAdminActions ? "true" : "false"}
    >
      <PartidoDetalleSurface contentClassName="space-y-6 p-4 md:p-6">
        <PartidoDetalleHeader
          partidoId={detalle.partidoId}
          local={detalle.local.nombre}
          visitante={detalle.visitante.nombre}
          marcador={detalle.marcador}
          escudoLocalUrl={detalle.local.escudoUrl}
          escudoVisitanteUrl={detalle.visitante.escudoUrl}
          competencia={detalle.competencia}
          fechaTexto={detalle.fechaTexto}
          estado={detalle.estado}
          fase={detalle.fase}
          grupo={detalle.grupo}
          jornada={detalle.jornada}
        />

        <PartidoDetalleTabs
          local={detalle.local}
          visitante={detalle.visitante}
          statsLocal={detalle.statsLocal}
          statsVisitante={detalle.statsVisitante}
          lineupLocal={detalle.lineupLocal}
          lineupVisitante={detalle.lineupVisitante}
        />
      </PartidoDetalleSurface>
    </div>
  );
}
