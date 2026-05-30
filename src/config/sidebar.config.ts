import {
  CalendarDays,
  CircleHelp,
  Download,
  Eye,
  Globe2,
  Goal,
  Home,
  ListOrdered,
  Network,
  RotateCcw,
  ShieldCheck,
  Trophy,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { ComponentType, SVGProps } from "react";

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;
type SidebarPermission = { modulo: string; accion: string };

export type SidebarSubItemConfig = {
  title: string;
  href: string;
  permission?: SidebarPermission | SidebarPermission[];
  icon: SidebarIcon;
  children?: SidebarSubItemConfig[];
};

export type SidebarItemConfig = {
  section: string;
  title: string;
  href: string;
  icon: SidebarIcon;
  permission?: SidebarPermission | SidebarPermission[];
  badgeKey?: string;
  children?: SidebarSubItemConfig[];
};

export const SIDEBAR_CONFIG: SidebarItemConfig[] = [
  {
    section: "General",
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    section: "Gestion Usuarios",
    title: "Administrar",
    href: "/users",
    icon: UserCog,
    permission: { modulo: "usuarios", accion: "ver" },
  },
  {
    section: "Gestion Usuarios",
    title: "Roles y Permisos",
    href: "/roles",
    icon: ShieldCheck,
    permission: { modulo: "roles", accion: "ver" },
  },
  {
    section: "Gestion Mundial",
    title: "Selecciones",
    href: "",
    icon: Globe2,
    permission: { modulo: "paises", accion: "ver" },
    children: [
      {
        title: "Selección",
        href: "",
        permission: { modulo: "paises", accion: "ver" },
        icon: Globe2,
        children: [
          {
            title: "Ver",
            href: "/admin/paises",
            permission: { modulo: "paises", accion: "ver" },
            icon: Eye,
          },
          {
            title: "Importar",
            href: "/admin/paises/importar",
            permission: { modulo: "paises", accion: "importar" },
            icon: Download,
          },
        ],
      },
      {
        title: "Planteles",
        href: "",
        permission: { modulo: "planteles", accion: "ver" },
        icon: Users,
        children: [
          {
            title: "Ver",
            href: "/admin/planteles",
            permission: { modulo: "planteles", accion: "ver" },
            icon: Eye,
          },
          {
            title: "Importar",
            href: "/admin/planteles/importar",
            permission: { modulo: "planteles", accion: "importar" },
            icon: Download,
          }
        ],
      },
    ],
  },
  {
    section: "Gestion Mundial",
    title: "Gestionar fixture",
    href: "/admin/partidos/gestionar",
    permission: { modulo: "partidos", accion: "ver" },
    icon: CalendarDays,
    children: [
      {
        title: "Importar fixture por fase",
        href: "/admin/partidos/importar",
        permission: { modulo: "partidos", accion: "crear" },
        icon: Download,
      },
      {
        title: "Actualizar resultados por fase",
        href: "/admin/partidos/gestionar",
        permission: { modulo: "resultados", accion: "actualizar" },
        icon: Zap,
      },
      {
        title: "Reglas de cruces",
        href: "/admin/reglas-cruces",
        permission: { modulo: "partidos", accion: "crear" },
        icon: Network,
      },
      {
        title: "Reset total mundial",
        href: "/admin/partidos/reimportar",
        permission: { modulo: "partidos", accion: "resetear" },
        icon: RotateCcw,
      },
      {
        title: "Reglas de puntaje",
        href: "/admin/reglas-puntaje",
        icon: Trophy,
        permission: { modulo: "reglas-puntaje", accion: "ver" },
      }
    ],
  },
  {
    section: "Mundial",
    title: "Mis Pronosticos",
    href: "/pronosticos/rapido",
    icon: CalendarDays,
    permission: { modulo: "pronosticos", accion: "ver" },
    // children: [
    //   {
    //     title: "Cargar Pronosticos",
    //     href: "/pronosticos/rapido",
    //     icon: Zap,
    //     permission: { modulo: "pronosticos", accion: "ver" },
    //   },
      // {
      //   title: "Fase de Grupos",
      //   href: "/pronosticos?fase=grupos",
      //   icon: Grid2x2,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "Dieciseisavos de final",
      //   href: "/pronosticos?fase=dieciseisavos",
      //   icon: Rows3,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "Octavos de final",
      //   href: "/pronosticos?fase=octavos",
      //   icon: GitMerge,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "Cuartos de final",
      //   href: "/pronosticos?fase=cuartos",
      //   icon: LayoutGrid,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "Semifinal",
      //   href: "/pronosticos?fase=semis",
      //   icon: Split,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "3er y 4to puesto",
      //   href: "/pronosticos?fase=tercer-puesto",
      //   icon: Award,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
      // {
      //   title: "Final",
      //   href: "/pronosticos?fase=final",
      //   icon: Trophy,
      //   permission: { modulo: "pronosticos", accion: "ver" },
      // },
    // ],
  },
  {
    section: "Mundial",
    title: "Mi Ranking",
    href: "/ranking",
    icon: ListOrdered,
    permission: { modulo: "ranking", accion: "ver" },
  },
  {
    section: "Live Control",
    title: "Live Control",
    href: "/admin/live-control",
    icon: ShieldCheck,
    permission: { modulo: "live-control", accion: "editar" },
  },
  {
    section: "Mundial",
    title: "Tabla de Posiciones",
    href: "/admin/tabla-posiciones",
    icon: ListOrdered,
    permission: { modulo: "partidos", accion: "ver" },
  },
  {
    section: "Mundial",
    title: "Fixture",
    href: "/admin/partidos?fase=grupos",
    icon: CalendarDays,
    permission: { modulo: "partidos", accion: "ver" },
    // children: [
    //   {
    //     title: "Partidos",
    //     href: "/admin/partidos?fase=grupos",
    //     permission: { modulo: "partidos", accion: "ver" },
    //     icon: Grid2x2,
    //   },
      // {
      //   title: "Dieciseisavos de final",
      //   href: "/admin/partidos?fase=dieciseisavos",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: Rows3,
      // },
      // {
      //   title: "Octavos de final",
      //   href: "/admin/partidos?fase=octavos",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: GitMerge,
      // },
      // {
      //   title: "Cuartos de final",
      //   href: "/admin/partidos?fase=cuartos",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: LayoutGrid,
      // },
      // {
      //   title: "Semifinal",
      //   href: "/admin/partidos?fase=semis",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: Split,
      // },
      // {
      //   title: "3er y 4to puesto",
      //   href: "/admin/partidos?fase=tercer-puesto",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: Award,
      // },
      // {
      //   title: "Final",
      //   href: "/admin/partidos?fase=final",
      //   permission: { modulo: "partidos", accion: "ver" },
      //   icon: Trophy,
      // },
    // ],
  },
  {
    section: "Mundial",
    title: "Goleadores",
    href: "/admin/goleadores",
    icon: Goal,
    permission: { modulo: "partidos", accion: "ver" },
  },
  {
    section: "Mundial",
    title: "Simulador de cruces",
    href: "/simulador-mundial",
    icon: Zap,
    permission: { modulo: "partidos", accion: "ver" },
  },
  {
    section: "Ayuda y reglas",
    title: "Ayuda",
    href: "/ayuda/usuario",
    icon: CircleHelp,
    permission: { modulo: "ayuda", accion: "ver_usuario" },
  },
  {
    section: "Ayuda y reglas",
    title: "Ayuda",
    href: "/ayuda/admin",
    icon: CircleHelp,
    permission: { modulo: "ayuda", accion: "ver_admin" },
  },
  {
    section: "Ayuda y reglas",
    title: "Reglas y condiciones",
    href: "/reglas-y-condiciones",
    icon: Trophy,
    permission: { modulo: "ayuda", accion: "ver_reglas" },
  },
];
