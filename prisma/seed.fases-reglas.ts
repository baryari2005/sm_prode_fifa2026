import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fases = [
  {
    nombre: "Fase de Grupos",
    orden: 1,
    descripcion: "Primera fase del Mundial 2026: partidos por grupos.",
  },
  {
    nombre: "Dieciseisavos de Final",
    orden: 2,
    descripcion: "Ronda de 32 equipos.",
  },
  {
    nombre: "Octavos de Final",
    orden: 3,
    descripcion: "Ronda de 16 equipos.",
  },
  {
    nombre: "Cuartos de Final",
    orden: 4,
    descripcion: "Ronda de 8 equipos.",
  },
  {
    nombre: "Semifinal",
    orden: 5,
    descripcion: "Ronda de semifinales.",
  },
  {
    nombre: "Tercer Puesto",
    orden: 6,
    descripcion: "Partido por el tercer puesto.",
  },
  {
    nombre: "Final",
    orden: 7,
    descripcion: "Partido por el título.",
  },
];

const reglas = [
  {
    nombre: "Dieciseisavos - 2º Grupo A vs 2º Grupo B",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 73,
    localOrigen: "2º Grupo A",
    visitanteOrigen: "2º Grupo B",
    estadio: "Estadio Los Ángeles",
    fecha: new Date("2026-06-28T18:00:00.000Z"),
    orden: 1,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo E vs 3º Grupo A/B/C/D/F",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 74,
    localOrigen: "1º Grupo E",
    visitanteOrigen: "3º Grupo A/B/C/D/F",
    estadio: "Estadio Boston",
    fecha: new Date("2026-06-29T18:00:00.000Z"),
    orden: 2,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo F vs 2º Grupo C",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 75,
    localOrigen: "1º Grupo F",
    visitanteOrigen: "2º Grupo C",
    estadio: "Estadio Monterrey",
    fecha: new Date("2026-06-29T18:00:00.000Z"),
    orden: 3,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo C vs 2º Grupo F",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 76,
    localOrigen: "1º Grupo C",
    visitanteOrigen: "2º Grupo F",
    estadio: "Estadio Houston",
    fecha: new Date("2026-06-29T18:00:00.000Z"),
    orden: 4,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo I vs 3º Grupo C/D/F/G/H",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 77,
    localOrigen: "1º Grupo I",
    visitanteOrigen: "3º Grupo C/D/F/G/H",
    estadio: "Estadio Nueva York Nueva Jersey",
    fecha: new Date("2026-06-30T18:00:00.000Z"),
    orden: 5,
  },
  {
    nombre: "Dieciseisavos - 2º Grupo E vs 2º Grupo I",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 78,
    localOrigen: "2º Grupo E",
    visitanteOrigen: "2º Grupo I",
    estadio: "Estadio Dallas",
    fecha: new Date("2026-06-30T18:00:00.000Z"),
    orden: 6,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo A vs 3º Grupo C/E/F/H/I",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 79,
    localOrigen: "1º Grupo A",
    visitanteOrigen: "3º Grupo C/E/F/H/I",
    estadio: "Estadio Ciudad de México",
    fecha: new Date("2026-06-30T18:00:00.000Z"),
    orden: 7,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo L vs 3º Grupo E/H/I/J/K",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 80,
    localOrigen: "1º Grupo L",
    visitanteOrigen: "3º Grupo E/H/I/J/K",
    estadio: "Estadio Atlanta",
    fecha: new Date("2026-07-01T18:00:00.000Z"),
    orden: 8,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo D vs 3º Grupo B/E/F/I/J",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 81,
    localOrigen: "1º Grupo D",
    visitanteOrigen: "3º Grupo B/E/F/I/J",
    estadio: "Estadio Bahía de San Francisco",
    fecha: new Date("2026-07-01T18:00:00.000Z"),
    orden: 9,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo G vs 3º Grupo A/E/H/I/J",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 82,
    localOrigen: "1º Grupo G",
    visitanteOrigen: "3º Grupo A/E/H/I/J",
    estadio: "Estadio Seattle",
    fecha: new Date("2026-07-01T18:00:00.000Z"),
    orden: 10,
  },
  {
    nombre: "Dieciseisavos - 2º Grupo K vs 2º Grupo L",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 83,
    localOrigen: "2º Grupo K",
    visitanteOrigen: "2º Grupo L",
    estadio: "Estadio Toronto",
    fecha: new Date("2026-07-02T18:00:00.000Z"),
    orden: 11,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo H vs 2º Grupo J",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 84,
    localOrigen: "1º Grupo H",
    visitanteOrigen: "2º Grupo J",
    estadio: "Estadio Los Ángeles",
    fecha: new Date("2026-07-02T18:00:00.000Z"),
    orden: 12,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo B vs 3º Grupo E/F/G/I/J",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 85,
    localOrigen: "1º Grupo B",
    visitanteOrigen: "3º Grupo E/F/G/I/J",
    estadio: "Estadio BC Place Vancouver",
    fecha: new Date("2026-07-02T18:00:00.000Z"),
    orden: 13,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo J vs 2º Grupo H",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 86,
    localOrigen: "1º Grupo J",
    visitanteOrigen: "2º Grupo H",
    estadio: "Estadio Miami",
    fecha: new Date("2026-07-03T18:00:00.000Z"),
    orden: 14,
  },
  {
    nombre: "Dieciseisavos - 1º Grupo K vs 3º Grupo D/E/I/J/L",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 87,
    localOrigen: "1º Grupo K",
    visitanteOrigen: "3º Grupo D/E/I/J/L",
    estadio: "Estadio Kansas City",
    fecha: new Date("2026-07-03T18:00:00.000Z"),
    orden: 15,
  },
  {
    nombre: "Dieciseisavos - 2º Grupo D vs 2º Grupo G",
    faseNombre: "Dieciseisavos de Final",
    partidoNumero: 88,
    localOrigen: "2º Grupo D",
    visitanteOrigen: "2º Grupo G",
    estadio: "Estadio Dallas",
    fecha: new Date("2026-07-03T18:00:00.000Z"),
    orden: 16,
  },
  {
    nombre: "Octavos - Ganador Partido 73 vs Ganador Partido 74",
    faseNombre: "Octavos de Final",
    partidoNumero: 89,
    localOrigen: "Ganador Partido 73",
    visitanteOrigen: "Ganador Partido 74",
    orden: 1,
  },
  {
    nombre: "Octavos - Ganador Partido 75 vs Ganador Partido 76",
    faseNombre: "Octavos de Final",
    partidoNumero: 90,
    localOrigen: "Ganador Partido 75",
    visitanteOrigen: "Ganador Partido 76",
    orden: 2,
  },
  {
    nombre: "Octavos - Ganador Partido 77 vs Ganador Partido 78",
    faseNombre: "Octavos de Final",
    partidoNumero: 91,
    localOrigen: "Ganador Partido 77",
    visitanteOrigen: "Ganador Partido 78",
    orden: 3,
  },
  {
    nombre: "Octavos - Ganador Partido 79 vs Ganador Partido 80",
    faseNombre: "Octavos de Final",
    partidoNumero: 92,
    localOrigen: "Ganador Partido 79",
    visitanteOrigen: "Ganador Partido 80",
    orden: 4,
  },
  {
    nombre: "Octavos - Ganador Partido 81 vs Ganador Partido 82",
    faseNombre: "Octavos de Final",
    partidoNumero: 93,
    localOrigen: "Ganador Partido 81",
    visitanteOrigen: "Ganador Partido 82",
    orden: 5,
  },
  {
    nombre: "Octavos - Ganador Partido 83 vs Ganador Partido 84",
    faseNombre: "Octavos de Final",
    partidoNumero: 94,
    localOrigen: "Ganador Partido 83",
    visitanteOrigen: "Ganador Partido 84",
    orden: 6,
  },
  {
    nombre: "Octavos - Ganador Partido 85 vs Ganador Partido 86",
    faseNombre: "Octavos de Final",
    partidoNumero: 95,
    localOrigen: "Ganador Partido 85",
    visitanteOrigen: "Ganador Partido 86",
    orden: 7,
  },
  {
    nombre: "Octavos - Ganador Partido 87 vs Ganador Partido 88",
    faseNombre: "Octavos de Final",
    partidoNumero: 96,
    localOrigen: "Ganador Partido 87",
    visitanteOrigen: "Ganador Partido 88",
    orden: 8,
  },
  {
    nombre: "Cuartos - Ganador Partido 89 vs Ganador Partido 90",
    faseNombre: "Cuartos de Final",
    partidoNumero: 97,
    localOrigen: "Ganador Partido 89",
    visitanteOrigen: "Ganador Partido 90",
    orden: 1,
  },
  {
    nombre: "Cuartos - Ganador Partido 91 vs Ganador Partido 92",
    faseNombre: "Cuartos de Final",
    partidoNumero: 98,
    localOrigen: "Ganador Partido 91",
    visitanteOrigen: "Ganador Partido 92",
    orden: 2,
  },
  {
    nombre: "Cuartos - Ganador Partido 93 vs Ganador Partido 94",
    faseNombre: "Cuartos de Final",
    partidoNumero: 99,
    localOrigen: "Ganador Partido 93",
    visitanteOrigen: "Ganador Partido 94",
    orden: 3,
  },
  {
    nombre: "Cuartos - Ganador Partido 95 vs Ganador Partido 96",
    faseNombre: "Cuartos de Final",
    partidoNumero: 100,
    localOrigen: "Ganador Partido 95",
    visitanteOrigen: "Ganador Partido 96",
    orden: 4,
  },
  {
    nombre: "Semifinal - Ganador Partido 97 vs Ganador Partido 98",
    faseNombre: "Semifinal",
    partidoNumero: 101,
    localOrigen: "Ganador Partido 97",
    visitanteOrigen: "Ganador Partido 98",
    orden: 1,
  },
  {
    nombre: "Semifinal - Ganador Partido 99 vs Ganador Partido 100",
    faseNombre: "Semifinal",
    partidoNumero: 102,
    localOrigen: "Ganador Partido 99",
    visitanteOrigen: "Ganador Partido 100",
    orden: 2,
  },
  {
    nombre: "Tercer Puesto - Perdedor Partido 101 vs Perdedor Partido 102",
    faseNombre: "Tercer Puesto",
    partidoNumero: 103,
    localOrigen: "Perdedor Partido 101",
    visitanteOrigen: "Perdedor Partido 102",
    estadio: "Estadio Miami",
    orden: 1,
  },
  {
    nombre: "Final - Ganador Partido 101 vs Ganador Partido 102",
    faseNombre: "Final",
    partidoNumero: 104,
    localOrigen: "Ganador Partido 101",
    visitanteOrigen: "Ganador Partido 102",
    orden: 1,
  },
];

async function main() {
  console.log("🌱 Seed de fases y reglas de cruce...");

  const faseMap = new Map<string, number>();
  for (const fase of fases) {
    const stored = await prisma.fase.upsert({
      where: { nombre: fase.nombre },
      update: {
        orden: fase.orden,
        descripcion: fase.descripcion,
        activo: true,
      },
      create: {
        nombre: fase.nombre,
        orden: fase.orden,
        descripcion: fase.descripcion,
        activo: true,
      },
    });
    faseMap.set(fase.nombre, stored.id);
  }

  for (const regla of reglas) {
    const faseId = faseMap.get(regla.faseNombre);
    if (!faseId) {
      throw new Error(`Fase no encontrada para la regla: ${regla.faseNombre}`);
    }

    const existing = await prisma.reglaCruce.findFirst({
      where: {
        nombre: regla.nombre,
        faseId,
      },
    });

    const data = {
      nombre: regla.nombre,
      faseId,
      partidoNumero: regla.partidoNumero,
      localOrigen: regla.localOrigen,
      visitanteOrigen: regla.visitanteOrigen,
      estadio: regla.estadio ?? null,
      fecha: regla.fecha ?? null,
      orden: regla.orden,
      activo: true,
    };

    if (existing) {
      await prisma.reglaCruce.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.reglaCruce.create({
        data,
      });
    }
  }

  console.log("✅ Seed de fases y reglas completado.");
}

main()
  .catch((error) => {
    console.error("❌ Error en el seed de fases y reglas:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
