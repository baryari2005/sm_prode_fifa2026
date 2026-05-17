import type { ReglaCruce } from "@/features/partidos/types/types";
import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";

import { CrucesFaseGroup } from "./brackets/CrucesFaseGroup";
import { groupReglasByFase, sortReglasCruce } from "./brackets/brackets.helpers";

interface BracketsScheduleProps {
  reglas: ReglaCruce[];
  posiciones: PosicionEquipo[];
}

export function BracketsSchedule({ reglas, posiciones }: BracketsScheduleProps) {
  const fases = groupReglasByFase(sortReglasCruce(reglas));

  return (
    <div className="space-y-6">
      {fases.map(({ faseNombre, reglas }) => (
        <CrucesFaseGroup
          key={faseNombre}
          faseNombre={faseNombre}
          reglas={reglas}
          posiciones={posiciones}
        />
      ))}
    </div>
  );
}