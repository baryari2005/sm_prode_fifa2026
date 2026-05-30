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
    accion: "ver_detalle",
    descripcion: "Ver detalle de partido desde pronosticos.",
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
  // Reglas Puntaje 
  {
    modulo: "reglas-puntaje",
    accion: "ver",
    descripcion: "Permite ver las reglas de puntaje pre establecidas.",
    icono: "eye",
  },
  {
    modulo: "reglas-puntaje",
    accion: "editar",
    descripcion: "Permite editar las reglas de puntaje.",
    icono: "pencil",
  },
  {
    modulo: "live-control",
    accion: "editar",
    descripcion: "Permite editar todo -- Dios Supremo.",
    icono: "layoutDashboard",
  },
  {
    modulo: "dashboard",
    accion: "ver_acceso_pronosticos",
    descripcion: "Permite ver accesos a pronosticos dentro del dashboard.",
    icono: "layoutDashboard",
  },
  {
    modulo: "dashboard",
    accion: "ver_acceso_ranking",
    descripcion: "Permite ver accesos al ranking dentro del dashboard.",
    icono: "layoutDashboard",
  },
  {
    modulo: "dashboard",
    accion: "ver_posicion_actual",
    descripcion: "Permite ver la card de posicion actual en el dashboard.",
    icono: "layoutDashboard",
  },
  {
    modulo: "dashboard",
    accion: "ver_puntos_obtenidos",
    descripcion: "Permite ver la card de puntos obtenidos en el dashboard.",
    icono: "layoutDashboard",
  },
  {
    modulo: "pronosticos",
    accion: "ver",
    descripcion: "Permite acceder a la seccion de pronosticos.",
    icono: "calendarDays",
  },
  {
    modulo: "ranking",
    accion: "ver",
    descripcion: "Permite acceder a la seccion de ranking.",
    icono: "listOrdered",
  },
  {
    modulo: "ranking",
    accion: "recalcular",
    descripcion: "Permite recalcular manualmente el ranking del Prode.",
    icono: "refreshCcw",
  },
  {
    modulo: "ayuda",
    accion: "ver_usuario",
    descripcion: "Permite acceder a la ayuda para usuarios del Prode.",
    icono: "circleHelp",
  },
  {
    modulo: "ayuda",
    accion: "ver_admin",
    descripcion: "Permite acceder a la ayuda administrativa del Prode.",
    icono: "shieldCheck",
  },
  {
    modulo: "ayuda",
    accion: "ver_reglas",
    descripcion: "Permite acceder a las reglas y condiciones del Prode.",
    icono: "bookOpen",
  },
];

const ROLES = [
  {
    nombre: "admin",
    descripcion: "Administrador del sistema con permisos editables por rol.",
    permisos: PERMISOS.map((permiso) => `${permiso.modulo}:${permiso.accion}`),
  },
  {
    nombre: "dev-sup",
    descripcion: "Desarrollador Supervisor",
    permisos: PERMISOS.map((permiso) => `${permiso.modulo}:${permiso.accion}`),
  },
  {
    nombre: "user",
    descripcion: "Usuario estándar con permisos limitados",
    permisos: [
      "dashboard:ver_acceso_pronosticos",
      "dashboard:ver_acceso_ranking",
      "dashboard:ver_posicion_actual",
      "dashboard:ver_puntos_obtenidos",
      "pronosticos:ver",
      "partidos:ver_detalle",
      "ranking:ver",
      "ayuda:ver_usuario",
      "ayuda:ver_reglas",
    ],
  },
];

async function main() {
  console.log("Iniciando seed de permisos, roles y usuario admin...");

  console.log("Creando permisos...");
  for (const permiso of PERMISOS) {
    await prisma.permiso.upsert({
      where: {
        modulo_accion: {
          modulo: permiso.modulo,
          accion: permiso.accion,
        },
      },
      update: {
        descripcion: permiso.descripcion,
        icono: permiso.icono,
      },
      create: {
        modulo: permiso.modulo,
        accion: permiso.accion,
        nombre: `${permiso.modulo}:${permiso.accion}`,
        descripcion: permiso.descripcion,
        icono: permiso.icono,
      },
    });
  }
  console.log(`✅ ${PERMISOS.length} permisos creados/actualizados`);

  console.log(`${PERMISOS.length} permisos creados o actualizados`);

  console.log("Creando roles...");
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
        OR: roleData.permisos.map((permisoStr) => {
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

    console.log(
      `Rol "${role.nombre}" creado con ${permisosToAssign.length} permisos`,
    );
  }

  console.log("Verificando usuario admin...");
  const adminRole = await prisma.rol.findFirst({
    where: { nombre: "admin" },
  });

  if (!adminRole) {
    throw new Error(
      "Rol 'admin' no encontrado. Verifica que el seed se ejecuto correctamente.",
    );
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

    console.log("Usuario admin creado (userId: admin, password: admin123)");
  } else {
    console.log("Usuario admin ya existe");
  }

  console.log("Seed completado exitosamente");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Error en el seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
