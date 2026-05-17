export function fromYmdLocal(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toYmdLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatEnumLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w|(?:\s)\w/g, (match) => match.toUpperCase());
}

export function formatSimpleCapitalized(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}