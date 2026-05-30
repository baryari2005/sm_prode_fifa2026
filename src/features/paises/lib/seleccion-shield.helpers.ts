import { withBrandAssetVersion } from "@/config/brand-images";

export function getSeleccionShieldSrc(codigo?: string | null) {
  return getSeleccionShieldSrcCandidates(codigo)[0] ?? null;
}

export function getSeleccionShieldSrcCandidates(codigo?: string | null) {
  const normalizedCode = codigo?.trim().toLowerCase();
  const upperCode = codigo?.trim().toUpperCase();

  if (!normalizedCode) {
    return [];
  }

  const candidates = [
    `/selecciones/escudos/${normalizedCode}.png`,
    `/mascotas/confederaciones/escudos/${normalizedCode}.png`,
    upperCode ? `/selecciones/escudos/${upperCode}.png` : null,
    upperCode ? `/mascotas/confederaciones/escudos/${upperCode}.png` : null,
  ].filter((value): value is string => Boolean(value));

  return candidates.map((path) => withBrandAssetVersion(path));
}
