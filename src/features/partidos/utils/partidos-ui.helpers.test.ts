import assert from "node:assert/strict";

import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import {
  getPredictionStatusMeta,
  isPredictionBlocked,
  isPredictionClosed,
} from "@/features/partidos/utils/partidos-ui.helpers";

function buildPartido(
  overrides?: Partial<PartidoConRelaciones>,
): PartidoConRelaciones {
  return {
    id: "partido-1",
    footballDataId: null,
    fecha: new Date("2026-06-18T18:00:00.000Z"),
    estadio: null,
    ciudad: null,
    faseId: 1,
    seleccionLocalId: "local",
    seleccionVisitanteId: "visitante",
    activo: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

const openMatch = buildPartido({
  predictionMeta: {
    canEdit: true,
    isClosed: false,
    isBlocked: false,
    status: "pendiente",
    closeAt: "2026-06-18T17:00:00.000Z",
    evaluatedAt: "2026-06-18T16:30:00.000Z",
  },
});

assert.equal(isPredictionClosed(openMatch), false);
assert.equal(isPredictionBlocked(openMatch), false);
assert.deepEqual(getPredictionStatusMeta(openMatch), {
  label: "Pendiente",
  toneClassName: "bg-[#FFF7E1] text-[#9A6500]",
});

const closedMatch = buildPartido({
  predictionMeta: {
    canEdit: false,
    isClosed: true,
    isBlocked: true,
    status: "cerrado",
    closeAt: "2026-06-18T17:00:00.000Z",
    evaluatedAt: "2026-06-18T17:05:00.000Z",
  },
});

assert.equal(isPredictionClosed(closedMatch), true);
assert.equal(isPredictionBlocked(closedMatch), true);
assert.deepEqual(getPredictionStatusMeta(closedMatch), {
  label: "Pronostico cerrado",
  toneClassName: "bg-amber-50 text-amber-700",
});

const manipulatedClientClock = new Date("2026-06-18T15:00:00.000Z").getTime();

assert.equal(isPredictionClosed(closedMatch, 60, manipulatedClientClock), true);
assert.equal(isPredictionBlocked(closedMatch, 60, manipulatedClientClock), true);
assert.deepEqual(getPredictionStatusMeta(closedMatch, manipulatedClientClock), {
  label: "Pronostico cerrado",
  toneClassName: "bg-amber-50 text-amber-700",
});

console.log("Prediction timing tests passed");
