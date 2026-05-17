export type HelpPermission = {
  modulo: string;
  accion: string;
};

export type HelpGuide = {
  id: string;
  category: "solicitudes" | "documentos" | "gestion";
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  permission?: HelpPermission | HelpPermission[];
  steps: string[];
};

export const HELP_GUIDES: HelpGuide[] = [
  {
    id: "manage-roles-and-permissions",
    category: "gestion",
    title: "Como modificar roles y permisos",
    description: "Te orienta para crear roles, editar permisos y ajustar accesos del sistema.",
    href: "/roles",
    ctaLabel: "Ir a Roles",
    permission: [
      { modulo: "roles", accion: "ver" },
      { modulo: "roles", accion: "editar" },
      { modulo: "roles", accion: "crear" },
    ],
    steps: [
      "Entra en la pantalla de Roles para ver el listado disponible.",
      "Usa la opcion de crear si necesitas un rol nuevo o abre uno existente para editarlo.",
      "Ajusta nombre, descripcion, estado y los permisos que debe tener ese rol.",
      "Guarda los cambios y revisa que el rol quede actualizado en el listado.",
      "Si hace falta, luego asigna ese rol a usuarios desde la administracion de usuarios.",
    ],
  },
  {
    id: "manage-users",
    category: "gestion",
    title: "Como administrar usuarios",
    description: "Alta, edicion y revision general de usuarios del sistema.",
    href: "/users",
    ctaLabel: "Ir a Usuarios",
    permission: { modulo: "usuarios", accion: "ver" },
    steps: [
      "Ingresa en Administrar para ver el listado completo.",
      "Busca un usuario por nombre, correo o criterio disponible.",
      "Abre el detalle para editar datos personales, rol o informacion laboral.",
      "Usa importacion o exportacion si necesitas trabajar con muchos usuarios.",
    ],
  },
  {
    id: "import-users",
    category: "gestion",
    title: "Como importar usuarios",
    description: "Guia para cargar usuarios en lote desde la pantalla de importacion.",
    href: "/users/import",
    ctaLabel: "Ir a Importar usuarios",
    permission: { modulo: "usuarios", accion: "importar" },
    steps: [
      "Entra en la pantalla Importar usuarios.",
      "Elige el origen o archivo que vas a usar para la importacion.",
      "Carga el archivo y revisa la vista previa antes de confirmar.",
      "Corrige errores detectados si el sistema marca filas invalidas.",
      "Ejecuta la importacion y luego verifica el resultado final.",
    ],
  },
  {
    id: "export-users",
    category: "gestion",
    title: "Como exportar usuarios",
    description: "Paso a paso para descargar el listado de usuarios desde la vista de exportacion.",
    href: "/users/export",
    ctaLabel: "Ir a Exportar usuarios",
    permission: { modulo: "usuarios", accion: "exportar" },
    steps: [
      "Entra en la pantalla Exportar usuarios.",
      "Revisa el resumen y la informacion disponible antes de generar el archivo.",
      "Ejecuta la accion de exportar para descargar el listado.",
      "Guarda el archivo generado y valida que incluya los datos esperados.",
    ],
  },
];
