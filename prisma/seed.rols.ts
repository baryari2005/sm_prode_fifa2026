/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const PERMISOS = [
  // Legajo
  {
    modulo: "legajo",
    accion: "ver",
    descripcion: "Permite visualizar la información del legajo.",
    icono: "fileText",
  },
  {
    modulo: "legajo",
    accion: "editar",
    descripcion: "Permite modificar la información del legajo.",
    icono: "pencil",
  },

  // Roles
  {
    modulo: "roles",
    accion: "ver",
    descripcion: "Permite visualizar roles y permisos disponibles.",
    icono: "eye",
  },
  {
    modulo: "roles",
    accion: "crear",
    descripcion: "Permite crear nuevos roles.",
    icono: "plus",
  },
  {
    modulo: "roles",
    accion: "editar",
    descripcion: "Permite modificar la configuración de un rol.",
    icono: "pencil",
  },
  {
    modulo: "roles",
    accion: "eliminar",
    descripcion: "Permite eliminar roles del sistema.",
    icono: "trash",
  },

  // Usuarios
  {
    modulo: "usuarios",
    accion: "ver",
    descripcion: "Permite visualizar el listado y detalle de usuarios.",
    icono: "eye",
  },
  {
    modulo: "usuarios",
    accion: "crear",
    descripcion: "Permite dar de alta nuevos usuarios en el sistema.",
    icono: "plus",
  },
  {
    modulo: "usuarios",
    accion: "editar",
    descripcion: "Permite modificar los datos de un usuario existente.",
    icono: "pencil",
  },
  {
    modulo: "usuarios",
    accion: "eliminar",
    descripcion: "Permite eliminar usuarios del sistema.",
    icono: "trash",
  },
  {
    modulo: "usuarios",
    accion: "importar",
    descripcion: "Permite importar usuarios desde archivos externos.",
    icono: "upload",
  },
  {
    modulo: "usuarios",
    accion: "exportar",
    descripcion: "Permite exportar usuarios a un archivo.",
    icono: "download",
  },

  // Partidos
  {
    modulo: "partidos",
    accion: "ver",
    descripcion: "Permite visualizar partidos y sus detalles.",
    icono: "eye",
  },
  {
    modulo: "partidos",
    accion: "crear",
    descripcion: "Permite crear nuevos partidos.",
    icono: "plus",
  },
  {
    modulo: "partidos",
    accion: "editar",
    descripcion: "Permite modificar información de partidos.",
    icono: "pencil",
  },
  {
    modulo: "partidos",
    accion: "importar",
    descripcion: "Permite importar partidos desde archivos externos.",
    icono: "upload",
  },
  {
    modulo: "partidos",
    accion: "resetear",
    descripcion: "Permite resetear todos los partidos del fixture.",
    icono: "refreshCcw",
  },

  // Resultados
  {
    modulo: "resultados",
    accion: "ver",
    descripcion: "Permite visualizar resultados de partidos.",
    icono: "eye",
  },
  {
    modulo: "resultados",
    accion: "crear",
    descripcion: "Permite crear resultados para partidos.",
    icono: "plus",
  },
  {
    modulo: "resultados",
    accion: "editar",
    descripcion: "Permite modificar resultados de partidos.",
    icono: "pencil",
  },
  {
    modulo: "resultados",
    accion: "importar",
    descripcion: "Permite importar resultados desde archivos externos.",
    icono: "upload",
  },


  // Países
  {
    modulo: "paises",
    accion: "ver",
    descripcion: "Permite visualizar el listado de selecciones.",
    icono: "eye",
  },
  {
    modulo: "paises",
    accion: "crear",
    descripcion: "Permite crear nuevas selecciones.",
    icono: "plus",
  },
  {
    modulo: "paises",
    accion: "editar",
    descripcion: "Permite modificar información de selecciones (nombre, banderas, etc).",
    icono: "pencil",
  },
  {
    modulo: "paises",
    accion: "eliminar",
    descripcion: "Permite eliminar selecciones del sistema.",
    icono: "trash",
  },
  {
    modulo: "paises",
    accion: "importar",
    descripcion: "Permite importar selecciones desde archivos externos.",
    icono: "upload",
  },
  {
    modulo: "planteles",
    accion: "ver",
    descripcion: "Permite visualizar planteles y sus detalles.",
    icono: "eye",
  },
  {
    modulo: "planteles",
    accion: "crear",
    descripcion: "Permite crear nuevos planteles.",
    icono: "plus",
  },
  {
    modulo: "planteles",
    accion: "editar",
    descripcion: "Permite modificar información de planteles.",
    icono: "pencil",
  },
  {
    modulo: "planteles",
    accion: "eliminar",
    descripcion: "Permite eliminar planteles del sistema.",
    icono: "trash",
  },
   {
    modulo: "planteles",
    accion: "importar",
    descripcion: "Permite importar planteles desde archivos externos.",
    icono: "upload",
  },
];

const ROLES = [
  {
    nombre: "admin",
    descripcion: "Administrador del sistema con acceso completo",
    permisos: PERMISOS.map(p => `${p.modulo}:${p.accion}`), // Todos los permisos
  },
  {
    nombre: "user",
    descripcion: "Usuario estándar con permisos limitados",
    permisos: [
      "legajo:ver",
      "usuarios:ver",
      "usuarios:editar", // Solo editar su propio perfil
    ],
  },
];

async function main() {
  console.log("🌱 Iniciando seed de permisos, roles y usuario admin...");

  // 1. Crear permisos
  console.log("📝 Creando permisos...");
  for (const p of PERMISOS) {
    await prisma.permiso.upsert({
      where: {
        modulo_accion: {
          modulo: p.modulo,
          accion: p.accion,
        },
      },
      update: {
        descripcion: p.descripcion,
        icono: p.icono,
      },
      create: {
        modulo: p.modulo,
        accion: p.accion,
        nombre: `${p.modulo}:${p.accion}`,
        descripcion: p.descripcion,
        icono: p.icono,
      },
    });
  }
  console.log(`✅ ${PERMISOS.length} permisos creados/actualizados`);

  // 2. Crear roles y asignar permisos
  console.log("👥 Creando roles...");
  for (const roleData of ROLES) {
    const role = await prisma.rol.upsert({
      where: { nombre: roleData.nombre },
      update: { descripcion: roleData.descripcion },
      create: {
        nombre: roleData.nombre,
        descripcion: roleData.descripcion,
      },
    });

    // Limpiar permisos existentes del rol
    await prisma.rolPermiso.deleteMany({
      where: { rolId: role.id },
    });

    // Obtener permisos a asignar
    const permisosToAssign = await prisma.permiso.findMany({
      where: {
        OR: roleData.permisos.map(permisoStr => {
          const [modulo, accion] = permisoStr.split(":");
          return { modulo, accion };
        }),
      },
    });

    // Crear asociaciones rol-permiso
    await prisma.rolPermiso.createMany({
      data: permisosToAssign.map((permiso) => ({
        rolId: role.id,
        permisoId: permiso.id,
      })),
      skipDuplicates: true,
    });

    console.log(`✅ Rol "${role.nombre}" creado con ${permisosToAssign.length} permisos`);
  }

  // 3. Crear usuario admin si no existe
  console.log("👤 Verificando usuario admin...");
  const adminRole = await prisma.rol.findFirst({
    where: { nombre: "admin" },
  });

  if (!adminRole) {
    throw new Error("Rol 'admin' no encontrado. Verifica que el seed se ejecutó correctamente.");
  }

  const existingAdmin = await prisma.usuario.findFirst({
    where: { userId: "admin" },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash("admin123", 10);

    await prisma.usuario.create({
      data: {
        userId: "admin",
        email: "admin@local",
        password: hashedPassword,
        nombre: "Administrador",
        apellido: "Sistema",
        rolId: adminRole.id,
        mustChangePassword: false,
        aprobado: true,
      },
    });
    console.log("✅ Usuario admin creado (userId: admin, password: admin123)");
  } else {
    console.log("ℹ️ Usuario admin ya existe");
  }

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error en el seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
