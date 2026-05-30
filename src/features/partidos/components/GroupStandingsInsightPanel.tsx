import type { ReactNode } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarClock,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlagImage } from "@/components/ui/flag-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatMatchHour,
  getGrupoNombre,
  getSeleccionResumen,
  PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { Seleccion } from "@/features/partidos/types/types";

const panelCardClassName =
  "rounded-[24px] border border-white/10 bg-white/[0.05] text-white shadow-none backdrop-blur";

interface GroupStandingsInsightPanelProps {
  grupoSeleccionado: string | null;
  partidos: PartidoConRelaciones[];
  selecciones: Seleccion[];
}

export function GroupStandingsInsightPanel({
  grupoSeleccionado,
  partidos,
  selecciones,
}: GroupStandingsInsightPanelProps) {
  const partidosDelGrupo = [...partidos]
    .filter((partido) => normalizeGroupKey(getGrupoNombre(partido)) === normalizeGroupKey(grupoSeleccionado))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const proximosPartidos = partidosDelGrupo
    .filter((partido) => !partido.resultado || partido.resultado.estado !== "FINALIZADO")
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <InsightCard
        icon={CalendarClock}
        title="Proximos partidos"
        eyebrow="Agenda del grupo"
      >
        {proximosPartidos.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-white/12 bg-white/[0.03] px-4 py-5 text-sm text-white/62">
            No hay partidos cargados para este grupo o ya se disputaron todos los encuentros.
          </div>
        ) : (
          <ScrollArea className="!h-[230px]">
            <div className="space-y-1">
              {proximosPartidos.map((partido) => {
                const local = getSeleccionResumen(partido, "local", selecciones);
                const visitante = getSeleccionResumen(partido, "visitante", selecciones);

                return (
                  <div
                    key={partido.id}
                    className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                      <span>
                        {format(new Date(partido.fecha), "dd MMM", { locale: es })
                          .replace(".", "")
                          .toUpperCase()}{" "}
                        - {formatMatchHour(partido.fecha)}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <FlagImage
                          bandera={local.bandera}
                          codigo={local.codigo}
                          nombre={local.nombre}
                          widthClassName="w-9"
                          heightClassName="h-6"
                          fallbackMode="emoji"
                          fallbackTextClassName="text-base"
                        />
                        <span className="truncate text-sm font-semibold text-white">{local.nombre}</span>
                      </div>
                      <span className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/34">
                        vs
                      </span>
                      <div className="flex min-w-0 items-center justify-end gap-2">
                        <span className="truncate text-right text-sm font-semibold text-white">{visitante.nombre}</span>
                        <FlagImage
                          bandera={visitante.bandera}
                          codigo={visitante.codigo}
                          nombre={visitante.nombre}
                          widthClassName="w-9"
                          heightClassName="h-6"
                          fallbackMode="emoji"
                          fallbackTextClassName="text-base"
                        />
                      </div>
                    </div>                    
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </InsightCard>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: typeof Trophy;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <Card className={panelCardClassName}>
      <CardHeader className="space-y-3 p-4 ">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#AEEBFF]/10 text-[#AEEBFF]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-bold text-white">
              {title}
            </CardTitle>
            <p className="mt-0 text-[11px] font-black uppercase tracking-[0.22em] text-[#AEEBFF]/82">
              {eyebrow}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

function normalizeGroupKey(value?: string | null) {
  if (!value) return null;
  return value.replace(/^grupo\s+/i, "").trim().toUpperCase();
}
