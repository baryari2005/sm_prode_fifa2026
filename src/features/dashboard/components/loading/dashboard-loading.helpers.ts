export function getDashboardLoadingBadgeLabel(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Loading home";
  if (pathname.startsWith("/ranking")) return "Loading ranking";
  if (pathname.startsWith("/pronosticos/rapido")) return "Loading pronostico rapido";
  if (pathname.startsWith("/pronosticos")) return "Loading pronosticos";
  if (pathname.startsWith("/users")) return "Loading usuarios";
  if (pathname.startsWith("/roles")) return "Loading roles";
  if (pathname.startsWith("/permissions")) return "Loading permisos";
  if (pathname.startsWith("/soporte")) return "Loading soporte";
  if (pathname.startsWith("/ayuda/admin")) return "Loading ayuda admin";
  if (pathname.startsWith("/ayuda/usuario")) return "Loading ayuda usuario";
  if (pathname.startsWith("/admin/live-control/tools")) return "Loading tools live";
  if (pathname.startsWith("/admin/live-control")) return "Loading live control";
  if (pathname.startsWith("/admin/tabla-posiciones")) {
    return "Loading tabla posiciones";
  }
  if (pathname.startsWith("/admin/reglas-puntaje")) {
    return "Loading reglas puntaje";
  }
  if (pathname.startsWith("/admin/reglas-cruces")) {
    return "Loading reglas cruces";
  }
  if (pathname.startsWith("/admin/cruces")) return "Loading cruces";
  if (pathname.startsWith("/admin/goleadores")) return "Loading goleadores";
  if (pathname.startsWith("/admin/planteles")) return "Loading planteles";
  if (pathname.startsWith("/admin/paises")) return "Loading paises";
  if (pathname.startsWith("/admin/partidos")) return "Loading partidos";
  if (pathname.startsWith("/admin")) return "Loading admin";

  return "Loading dashboard";
}
