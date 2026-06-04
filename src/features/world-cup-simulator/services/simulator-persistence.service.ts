import bcrypt from "bcryptjs";
import { EstadoPartido } from "@prisma/client";

import { prisma } from "@/lib/db";
import { recalculateRanking } from "@/features/pronosticos/services/ranking-recalculation.service";
import {
  FIXTURE_PHASE_NAME_BY_SLUG,
  type FixturePhaseSlug,
} from "@/features/partidos/constants/fixture-phase-filter.constants";
import { generateKnockoutPartidosForPhase } from "@/features/partidos/services/partido.service";

const MOCK_USER_PREFIX = "mock-prode-fase";
const DEFAULT_MOCK_PASSWORD = "mock123456";

type MockUser = {
  id: string;
  userId: string;
  email: string;
  nombre: string | null;
  apellido: string | null;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getPhaseName(slug: FixturePhaseSlug) {
  return FIXTURE_PHASE_NAME_BY_SLUG[slug];
}

async function ensureMockUsers(userCount = 4): Promise<MockUser[]> {
  const role = await prisma.rol.findFirst({
    where: { nombre: "user" },
    select: { id: true },
  });

  if (!role) {
    throw new Error("No se encontro el rol user.");
  }

  const passwordHash = await bcrypt.hash(DEFAULT_MOCK_PASSWORD, 10);
  const users: MockUser[] = [];

  for (let index = 1; index <= userCount; index += 1) {
    const userId = `${MOCK_USER_PREFIX}-${index}`;
    const email = `${userId}@local.test`;

    const user = await prisma.usuario.upsert({
      where: { email },
      update: {
        userId,
        password: passwordHash,
        rolId: role.id,
        aprobado: true,
        deletedAt: null,
        nombre: `Mock ${index}`,
        apellido: "Prode",
      },
      create: {
        userId,
        email,
        password: passwordHash,
        rolId: role.id,
        aprobado: true,
        nombre: `Mock ${index}`,
        apellido: "Prode",
      },
      select: {
        id: true,
        userId: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });

    users.push(user);
  }

  return users;
}

export async function generateAllKnockoutMatches() {
  const phases: Array<Exclude<FixturePhaseSlug, "grupos">> = [
    "dieciseisavos",
    "octavos",
    "cuartos",
    "semis",
    "tercer-puesto",
    "final",
  ];

  const results = [];

  for (const phase of phases) {
    const result = await generateKnockoutPartidosForPhase(phase);
    results.push({
      fase: phase,
      phaseName: result.phaseName,
      generatedCount: result.generatedCount,
      skippedCount: result.skippedCount,
    });
  }

  return results;
}

export async function simulatePhaseResults(phaseSlug: FixturePhaseSlug) {
  const phaseName = getPhaseName(phaseSlug);
  const phase = await prisma.fase.findFirst({
    where: {
      nombre: phaseName,
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  if (!phase) {
    throw new Error(`No se encontro la fase ${phaseName}.`);
  }

  const matches = await prisma.partido.findMany({
    where: {
      faseId: phase.id,
      activo: true,
    },
    include: {
      resultado: true,
    },
    orderBy: [{ fecha: "asc" }, { createdAt: "asc" }],
  });

  const simulatedMatches = await prisma.$transaction(async (tx) => {
    await tx.resultado.deleteMany({
      where: {
        partidoId: {
          in: matches.map((match) => match.id),
        },
      },
    });

    const updated = [];

    for (const match of matches) {
      const golesLocal = getRandomInt(5);
      const golesVisitante = getRandomInt(5);
      let penalesLocal: number | null = null;
      let penalesVisitante: number | null = null;

      if (phaseSlug !== "grupos" && golesLocal === golesVisitante) {
        penalesLocal = 3 + getRandomInt(3);
        penalesVisitante = 3 + getRandomInt(3);

        if (penalesLocal === penalesVisitante) {
          penalesVisitante += 1;
        }
      }

      const payload = {
        golesLocal,
        golesVisitante,
        penalesLocal,
        penalesVisitante,
        estado: EstadoPartido.FINALIZADO,
        tiempoJuego: 90,
        observaciones: "Simulacion automatica desde simulador",
      };

      const resultado = await tx.resultado.create({
        data: {
          partidoId: match.id,
          ...payload,
        },
      });

      updated.push({
        partidoId: match.id,
        resultadoId: resultado.id,
      });
    }

    return updated;
  });

  await recalculateRanking({
    source: "live-control",
    force: true,
    soloNoCalculados: false,
  });

  return {
    phaseName,
    updatedCount: simulatedMatches.length,
  };
}

export async function generateMockPredictionsForPhase(
  phaseSlug: FixturePhaseSlug,
  userCount = 4,
) {
  const phaseName = getPhaseName(phaseSlug);
  const phase = await prisma.fase.findFirst({
    where: {
      nombre: phaseName,
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  if (!phase) {
    throw new Error(`No se encontro la fase ${phaseName}.`);
  }

  const [users, matches] = await Promise.all([
    ensureMockUsers(userCount),
    prisma.partido.findMany({
      where: {
        faseId: phase.id,
        activo: true,
      },
      include: {
        resultado: true,
      },
      orderBy: [{ fecha: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  if (matches.length === 0) {
    return {
      phaseName,
      usersCreated: users.length,
      predictionsCreated: 0,
      users,
    };
  }

  const records = [];

  for (const [userIndex, user] of users.entries()) {
    for (const [matchIndex, match] of matches.entries()) {
      const pattern = (userIndex + matchIndex) % 4;
      let golesLocal = 0;
      let golesVisitante = 0;

      if (match.resultado) {
        if (pattern === 0) {
          golesLocal = match.resultado.golesLocal;
          golesVisitante = match.resultado.golesVisitante;
        } else if (pattern === 1) {
          golesLocal =
            match.resultado.golesLocal > match.resultado.golesVisitante ? 2 : 1;
          golesVisitante =
            match.resultado.golesLocal > match.resultado.golesVisitante ? 0 : 2;
          if (match.resultado.golesLocal === match.resultado.golesVisitante) {
            golesLocal = 1;
            golesVisitante = 1;
          }
        } else if (pattern === 2) {
          golesLocal = match.resultado.golesVisitante;
          golesVisitante = match.resultado.golesLocal;
        } else {
          golesLocal = getRandomInt(5);
          golesVisitante = getRandomInt(5);
        }
      } else {
        golesLocal = (userIndex + matchIndex) % 5;
        golesVisitante = (userIndex * 2 + matchIndex) % 5;
      }

      records.push({
        usuarioId: user.id,
        partidoId: match.id,
        golesLocal,
        golesVisitante,
        puntosOtorgados: 0,
        aciertoTipo: null,
        calculadoAt: null,
      });
    }
  }

  await prisma.$transaction([
    prisma.prediccionPartido.deleteMany({
      where: {
        usuarioId: {
          in: users.map((user) => user.id),
        },
        partidoId: {
          in: matches.map((match) => match.id),
        },
      },
    }),
    prisma.prediccionPartido.createMany({
      data: records,
    }),
  ]);

  return {
    phaseName,
    usersCreated: users.length,
    predictionsCreated: users.length * matches.length,
    users,
  };
}

export async function recalculateRankingForPhase(phaseSlug: FixturePhaseSlug) {
  const phaseName = getPhaseName(phaseSlug);
  const phase = await prisma.fase.findFirst({
    where: {
      nombre: phaseName,
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  if (!phase) {
    throw new Error(`No se encontro la fase ${phaseName}.`);
  }

  const result = await recalculateRanking({
    source: "live-control",
    force: true,
    soloNoCalculados: false,
    faseId: phase.id,
  });

  return {
    phaseName,
    ...result,
  };
}
