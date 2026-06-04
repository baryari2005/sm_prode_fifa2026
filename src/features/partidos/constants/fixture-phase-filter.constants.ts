export type FixturePhaseSlug =
  | "grupos"
  | "dieciseisavos"
  | "octavos"
  | "cuartos"
  | "semis"
  | "tercer-puesto"
  | "final";

export const FIXTURE_PHASE_LABELS: Record<FixturePhaseSlug, string> = {
  grupos: "Fase de grupos",
  dieciseisavos: "Dieciseisavos",
  octavos: "Octavos",
  cuartos: "Cuartos",
  semis: "Semifinales",
  "tercer-puesto": "3° y 4° puesto",
  final: "Final",
};

export const FIXTURE_PHASE_NAME_BY_SLUG: Record<FixturePhaseSlug, string> = {
  grupos: "Fase de Grupos",
  dieciseisavos: "Dieciseisavos de Final",
  octavos: "Octavos de Final",
  cuartos: "Cuartos de Final",
  semis: "Semifinal",
  "tercer-puesto": "Tercer Puesto",
  final: "Final",
};

export const FIXTURE_PHASE_OPTIONS: {
  label: string;
  slug: FixturePhaseSlug;
  href: string;
}[] = [
  {
    label: "Grupos",
    slug: "grupos",
    href: "/admin/partidos?fase=grupos",
  },
  {
    label: "Dieciseisavos",
    slug: "dieciseisavos",
    href: "/admin/partidos?fase=dieciseisavos",
  },
  {
    label: "Octavos",
    slug: "octavos",
    href: "/admin/partidos?fase=octavos",
  },
  {
    label: "Cuartos",
    slug: "cuartos",
    href: "/admin/partidos?fase=cuartos",
  },
  {
    label: "Semis",
    slug: "semis",
    href: "/admin/partidos?fase=semis",
  },
  {
    label: "3° y 4° puesto",
    slug: "tercer-puesto",
    href: "/admin/partidos?fase=tercer-puesto",
  },
  {
    label: "Final",
    slug: "final",
    href: "/admin/partidos?fase=final",
  },
];

export function normalizeFixtureText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getFixturePhaseSlugFromText(
  value?: string | null
): FixturePhaseSlug | null {
  const text = normalizeFixtureText(value);

  if (!text) return null;

  if (
    text === "grupos" ||
    text.includes("fase de grupos") ||
    text.includes("grupo") ||
    text.includes("group stage")
  ) {
    return "grupos";
  }

  if (
    text.includes("dieciseis") ||
    text.includes("16avos") ||
    text.includes("ronda de 32") ||
    text.includes("round of 32")
  ) {
    return "dieciseisavos";
  }

  if (
    text.includes("octav") ||
    text.includes("ronda de 16") ||
    text.includes("round of 16")
  ) {
    return "octavos";
  }

  if (
    text.includes("cuart") ||
    text.includes("quarter")
  ) {
    return "cuartos";
  }

  if (
    text.includes("semi") ||
    text.includes("semifinal")
  ) {
    return "semis";
  }

  if (
    text.includes("tercer") ||
    text.includes("3°") ||
    text.includes("3er") ||
    text.includes("third place")
  ) {
    return "tercer-puesto";
  }

  if (text === "final" || text.includes("final")) {
    return "final";
  }

  return null;
}

export function getFixturePhaseLabel(slug: FixturePhaseSlug | null) {
  if (!slug) return "Fixture";

  return FIXTURE_PHASE_LABELS[slug] ?? "Fixture";
}
