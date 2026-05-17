export function resolveBanderaSrc(
  bandera?: string | null,
  codigo?: string | null
): string | null {
  const value = bandera?.trim();
  const normalizedCode = codigo?.trim().toUpperCase();

  if (!value) {
    return null;
  }

  if (value.startsWith("http") || value.startsWith("/")) {
    const lower = value.toLowerCase();
    const isImageFile =
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".svg");

    if (isImageFile || !normalizedCode) {
      return value;
    }

    const separator = value.endsWith("/") ? "" : "/";
    return `${value}${separator}${normalizedCode}.png`;
  }

  return null;
}
