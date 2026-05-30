import { brandImages } from "@/config/brand-images";

type ConfederationMascotKey =
  | "conmebol"
  | "concacaf"
  | "uefa"
  | "afc"
  | "caf"
  | "fallback";

function normalizeConfederation(confederacion?: string | null) {
  return confederacion?.trim().toUpperCase() ?? "";
}

function getConfederationMascotKey(
  confederacion?: string | null,
): ConfederationMascotKey {
  switch (normalizeConfederation(confederacion)) {
    case "CONMEBOL":
      return "conmebol";
    case "CONCACAF":
      return "concacaf";
    case "UEFA":
      return "uefa";
    case "AFC":
      return "afc";
    case "CAF":
      return "caf";
    default:
      return "fallback";
  }
}

export function getMascotForSeleccion(confederacion?: string | null) {
  const key = getConfederationMascotKey(confederacion);
  return brandImages.mascots.byConfederation[key];
}

export const CONFEDERATION_MASCOT_PATHS = {
  conmebol: "/public/mascotas/confederaciones/conmebol.png",
  concacaf: "/public/mascotas/confederaciones/concacaf.png",
  uefa: "/public/mascotas/confederaciones/uefa.png",
  afc: "/public/mascotas/confederaciones/afc.png",
  caf: "/public/mascotas/confederaciones/caf.png",
} as const;
