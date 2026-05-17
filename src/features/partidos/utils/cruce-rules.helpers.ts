import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";

export type OrigenRegla =
  | {
      type: "POSICION";
      position: number;
      groups: string[];
      raw: string;
    }
  | {
      type: "GANADOR_PARTIDO";
      partidoNumero: number;
      raw: string;
    }
  | {
      type: "PERDEDOR_PARTIDO";
      partidoNumero: number;
      raw: string;
    }
  | {
      type: "DESCONOCIDO";
      raw: string;
    };

export type OrigenResolucion = {
  label: string;
  resolved: boolean;
  teamName?: string;
  bandera?: string | null;
  codigo?: string | null;
};

export function parseOrigenRegla(raw: string): OrigenRegla {
  const normalized = raw.trim();

  const posicionMatch = normalized.match(/^([1-3])º Grupo ([A-Z](?:\/[A-Z])*)$/i);
  if (posicionMatch) {
    return {
      type: "POSICION",
      position: Number(posicionMatch[1]),
      groups: posicionMatch[2]
        .split("/")
        .map((grupo) => grupo.toUpperCase()),
      raw,
    };
  }

  const ganadorMatch = normalized.match(/^Ganador Partido (\d+)$/i);
  if (ganadorMatch) {
    return {
      type: "GANADOR_PARTIDO",
      partidoNumero: Number(ganadorMatch[1]),
      raw,
    };
  }

  const perdedorMatch = normalized.match(/^Perdedor Partido (\d+)$/i);
  if (perdedorMatch) {
    return {
      type: "PERDEDOR_PARTIDO",
      partidoNumero: Number(perdedorMatch[1]),
      raw,
    };
  }

  return {
    type: "DESCONOCIDO",
    raw,
  };
}

export function obtenerOrigenResolucion(
  origen: OrigenRegla,
  posiciones: PosicionEquipo[]
): OrigenResolucion {
  if (origen.type === "POSICION") {
    if (origen.position === 3 && origen.groups.length > 1) {
      return {
        label: origen.raw,
        resolved: false,
      };
    }

    const grupo = origen.groups[0];
    const equipos = posiciones.filter(
      (eq) => eq.grupo?.toUpperCase() === grupo.toUpperCase()
    );

    const equipo = equipos[origen.position - 1];

    if (!equipo) {
      return {
        label: origen.raw,
        resolved: false,
      };
    }

    return {
      label: equipo.nombre,
      resolved: true,
      teamName: equipo.nombre,
      bandera: equipo.bandera,
      codigo: equipo.codigo,
    };
  }

  return {
    label: origen.raw,
    resolved: false,
  };
}
