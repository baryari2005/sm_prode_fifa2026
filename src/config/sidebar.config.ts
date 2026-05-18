import {
  Award,
  CalendarDays,
  Download,
  Flag,
  GitMerge,
  Goal,
  Grid2x2,
  Home,
  LayoutGrid,
  ListOrdered,
  Network,
  RotateCcw,
  Rows3,
  ShieldCheck,
  Split,
  Trophy,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { ComponentType, SVGProps } from "react";

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarSubItemConfig = {
  title: string;
  href: string;
  permission?: { modulo: string; accion: string };
  icon: SidebarIcon;
  children?: SidebarSubItemConfig[];
};

export type SidebarItemConfig = {
  section: string;
  title: string;
  href: string;
  icon: SidebarIcon;
  permission?: { modulo: string; accion: string };
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
    icon: Flag,
    permission: { modulo: "paises", accion: "ver" },
    children: [
      {
        title: "Gestionar selecciones",
        href: "",
        permission: { modulo: "paises", accion: "ver" },
        icon: Flag,
        children: [
          {
            title: "Ver",
            href: "/admin/paises",
            permission: { modulo: "paises", accion: "ver" },
            icon: Flag,
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
        title: "Gestionar planteles",
        href: "",
        permission: { modulo: "planteles", accion: "ver" },
        icon: Users,
        children: [
          {
            title: "Ver",
            href: "/admin/planteles",
            permission: { modulo: "planteles", accion: "ver" },
            icon: Users,
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
    href: "/pronosticos",
    icon: CalendarDays,
    children: [
      {
        title: "Carga Masiva",
        href: "/pronosticos/rapido",
        icon: Zap,
      },
      {
        title: "Fase de Grupos",
        href: "/pronosticos?fase=grupos",
        icon: Grid2x2,
      },
      {
        title: "Dieciseisavos de final",
        href: "/pronosticos?fase=dieciseisavos",
        icon: Rows3,

      },
      {
        title: "Octavos de final",
        href: "/pronosticos?fase=octavos",
        icon: GitMerge,
      },
      {
        title: "Cuartos de final",
        href: "/pronosticos?fase=cuartos",
        icon: LayoutGrid,
      },
      {
        title: "Semifinal",
        href: "/pronosticos?fase=semis",
        icon: Split,
      },
      {
        title: "3er y 4to puesto",
        href: "/pronosticos?fase=tercer-puesto",
        icon: Award,
      },
      {
        title: "Final",
        href: "/pronosticos?fase=final",
        icon: Trophy,
      },
    ],
  },
  {
    section: "Mundial",
    title: "Mi Ranking",
    href: "/ranking",
    icon: ListOrdered,
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
    href: "/admin/partidos",
    icon: CalendarDays,
    permission: { modulo: "partidos", accion: "ver" },
    children: [
      {
        title: "Fase de Grupos",
        href: "/admin/partidos?fase=grupos",
        permission: { modulo: "partidos", accion: "ver" },
        icon: Grid2x2,
      },
      {
        title: "Dieciseisavos de final",
        href: "/admin/partidos?fase=dieciseisavos",
        permission: { modulo: "partidos", accion: "ver" },
        icon: Rows3,
      },
      {
        title: "Octavos de final",
        href: "/admin/partidos?fase=octavos",
        permission: { modulo: "partidos", accion: "ver" },
        icon: GitMerge,
      },
      {
        title: "Cuartos de final",
        href: "/admin/partidos?fase=cuartos",
        permission: { modulo: "partidos", accion: "ver" },
        icon: LayoutGrid,
      },
      {
        title: "Semifinal",
        href: "/admin/partidos?fase=semis",
        permission: { modulo: "partidos", accion: "ver" },
        icon: Split,
      },
      {
        title: "3er y 4to puesto",
        href: "/admin/partidos?fase=tercer-puesto",
        permission: { modulo: "partidos", accion: "ver" },
        icon: Award,
      },
      {
        title: "Final",
        href: "/admin/partidos?fase=final",
        permission: { modulo: "partidos", accion: "ver" },
        icon: Trophy,
      },
    ],
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
    title: "Simular Cruces",
    href: "/admin/cruces",
    icon: Zap,
    permission: { modulo: "partidos", accion: "ver" },
  },
];
