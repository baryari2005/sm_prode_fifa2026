"use client";

import { IncidentTimelineItem } from "./IncidentTimelineItem";
import { incidentTimelineMock } from "./incidents-mock.data";

export function IncidentTimeline() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Timeline del partido
        </p>
        <p className="mt-2 text-sm text-white/68">
          Incidencias ya cargadas en una linea de tiempo compacta, lista para editar o eliminar.
        </p>
      </div>

      <div className="space-y-3">
        {incidentTimelineMock.map((item) => (
          <IncidentTimelineItem key={`${item.minute}-${item.type}-${item.player}`} item={item} />
        ))}
      </div>
    </div>
  );
}
