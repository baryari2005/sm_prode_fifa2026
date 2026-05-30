"use client";

import {
  BookOpen,
  CalendarDays,
  CircleHelp,
  Eye,
  KeyRound,
  LayoutDashboard,
  ListOrdered,
  Medal,
  Plus,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  Trophy,
  Trash2,
  Upload,
  Download,
  Search,
  FileSignature,
  FileText,
  CheckCircle2,
  XCircle,
  Ban,
  CalendarPlus,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  eye: Eye,
  plus: Plus,
  pencil: Pencil,
  trash: Trash2,
  upload: Upload,
  download: Download,
  search: Search,
  fileSignature: FileSignature,
  fileText: FileText,
  checkCircle: CheckCircle2,
  xCircle: XCircle,
  ban: Ban,
  calendarPlus: CalendarPlus,
  refreshCcw: RefreshCcw,
  layoutDashboard: LayoutDashboard,
  calendarDays: CalendarDays,
  listOrdered: ListOrdered,
  circleHelp: CircleHelp,
  shieldCheck: ShieldCheck,
  bookOpen: BookOpen,
};

type Props = {
  name?: string | null;
  modulo?: string | null;
  accion?: string | null;
  className?: string;
};

function resolvePermissionIcon(
  name?: string | null,
  modulo?: string | null,
  accion?: string | null,
): LucideIcon {
  const normalizedModulo = modulo?.trim().toLowerCase();
  const normalizedAccion = accion?.trim().toLowerCase();

  if (normalizedModulo === "dashboard") {
    switch (normalizedAccion) {
      case "ver_acceso_pronosticos":
        return CalendarDays;
      case "ver_acceso_ranking":
        return ListOrdered;
      case "ver_posicion_actual":
        return Medal;
      case "ver_puntos_obtenidos":
        return Trophy;
      default:
        break;
    }
  }

  if (normalizedAccion === "ver") {
    return Eye;
  }

  if (normalizedAccion === "editar") {
    return Pencil;
  }

  if (name) {
    return iconMap[name] ?? KeyRound;
  }

  return KeyRound;
}

export function PermissionIcon({
  name,
  modulo,
  accion,
  className = "h-4 w-4 text-muted-foreground",
}: Props) {
  const Icon = resolvePermissionIcon(name, modulo, accion);

  return <Icon className={className} />;
}
