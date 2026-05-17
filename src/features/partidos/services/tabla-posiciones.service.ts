// src/features/partidos/services/tabla-posiciones.service.ts

import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import { Seleccion } from "@/features/partidos/types/types";

export interface PosicionEquipo {
  posicion: number;
  seleccionId: string;
  nombre: string;
  codigo: string;
  bandera: string | null;
  grupo: string | null;
  puntos: number;
  partidosJugados: number;
  ganancias: number;
  empates: number;
  derrotas: number;
  golesAFavor: number;
  golesEnContra: number;
  diferencial: number;
}

type TablaPosicionesApiResponse = {
  tabla?: PosicionEquipo[];
};

export function calcularTablaPosiciones(
  partidos: PartidoConRelaciones[],
  selecciones: Seleccion[]
): PosicionEquipo[] {
  const equipos: Map<string, PosicionEquipo> = new Map();

  // Inicializar equipos
  selecciones.forEach((seleccion) => {
    equipos.set(seleccion.id, {
      posicion: 0,
      seleccionId: seleccion.id,
      nombre: seleccion.nombre,
      codigo: seleccion.codigo,
      bandera: seleccion.bandera,
      grupo: seleccion.grupo,
      puntos: 0,
      partidosJugados: 0,
      ganancias: 0,
      empates: 0,
      derrotas: 0,
      golesAFavor: 0,
      golesEnContra: 0,
      diferencial: 0,
    });
  });

  // Procesar partidos finalizados
  partidos.forEach((partido) => {
    const resultado = partido.resultado;

    if (!resultado || resultado.estado !== "FINALIZADO") {
      return;
    }

    const equipoLocal = equipos.get(partido.seleccionLocalId);
    const equipoVisitante = equipos.get(partido.seleccionVisitanteId);

    if (!equipoLocal || !equipoVisitante) {
      return;
    }

    const golesLocal = resultado.golesLocal;
    const golesVisitante = resultado.golesVisitante;

    // Actualizar partidos jugados y goles
    equipoLocal.partidosJugados++;
    equipoVisitante.partidosJugados++;

    equipoLocal.golesAFavor += golesLocal;
    equipoLocal.golesEnContra += golesVisitante;

    equipoVisitante.golesAFavor += golesVisitante;
    equipoVisitante.golesEnContra += golesLocal;

    // Actualizar puntos y resultados
    if (golesLocal > golesVisitante) {
      // Gana local
      equipoLocal.ganancias++;
      equipoLocal.puntos += 3;

      equipoVisitante.derrotas++;
    } else if (golesLocal < golesVisitante) {
      // Gana visitante
      equipoVisitante.ganancias++;
      equipoVisitante.puntos += 3;

      equipoLocal.derrotas++;
    } else {
      // Empate
      equipoLocal.empates++;
      equipoLocal.puntos += 1;

      equipoVisitante.empates++;
      equipoVisitante.puntos += 1;
    }

    equipoLocal.diferencial =
      equipoLocal.golesAFavor - equipoLocal.golesEnContra;
    equipoVisitante.diferencial =
      equipoVisitante.golesAFavor - equipoVisitante.golesEnContra;
  });

  return ordenarTablaPosiciones(Array.from(equipos.values()));
}

export function agruparTablaPorGrupo(
  tabla: PosicionEquipo[]
): Map<string | null, PosicionEquipo[]> {
  const grupos: Map<string | null, PosicionEquipo[]> = new Map();

  tabla.forEach((equipo) => {
    const grupo = equipo.grupo || "Sin Grupo";
    if (!grupos.has(grupo)) {
      grupos.set(grupo, []);
    }
    grupos.get(grupo)!.push(equipo);
  });

  return grupos;
}

export function ordenarTablaPosiciones(tabla: PosicionEquipo[]): PosicionEquipo[] {
  const ordenada = [...tabla].sort((a, b) => {
    if (a.grupo !== b.grupo) {
      return (a.grupo || "").localeCompare(b.grupo || "");
    }

    if (a.posicion > 0 && b.posicion > 0 && a.posicion !== b.posicion) {
      return a.posicion - b.posicion;
    }

    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }

    if (b.diferencial !== a.diferencial) {
      return b.diferencial - a.diferencial;
    }

    if (b.golesAFavor !== a.golesAFavor) {
      return b.golesAFavor - a.golesAFavor;
    }

    return a.nombre.localeCompare(b.nombre);
  });

  const posicionesPorGrupo = new Map<string, number>();

  return ordenada.map((equipo) => {
    const grupo = equipo.grupo || "Sin Grupo";
    const siguientePosicion = (posicionesPorGrupo.get(grupo) || 0) + 1;
    posicionesPorGrupo.set(grupo, siguientePosicion);

    return {
      ...equipo,
      posicion: equipo.posicion > 0 ? equipo.posicion : siguientePosicion,
    };
  });
}

export async function getTablaPosicionesOficial(): Promise<PosicionEquipo[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch("/api/tabla-posiciones", {
    method: "GET",
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(
      errorData?.message || "Error al cargar la tabla oficial de posiciones"
    );
  }

  const data = (await res.json()) as TablaPosicionesApiResponse;

  return ordenarTablaPosiciones(data.tabla || []);
}
