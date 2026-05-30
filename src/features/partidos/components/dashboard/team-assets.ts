export type ConfederationSlug =
  | "afc"
  | "caf"
  | "concacaf"
  | "conmebol"
  | "uefa";

export type TeamAsset = {
  slug: string;
  nombre: string;
  escudo: string;
  confederacion: ConfederationSlug;
  confederacionAsset: string;
  glow: string;
};

const teamAssetEntries = [
  ["alg", "Argelia", "caf"],
  ["arg", "Argentina", "conmebol"],
  ["aus", "Australia", "afc"],
  ["aut", "Austria", "uefa"],
  ["bel", "Belgica", "uefa"],
  ["bih", "Bosnia y Herzegovina", "uefa"],
  ["bra", "Brasil", "conmebol"],
  ["can", "Canada", "concacaf"],
  ["civ", "Costa de Marfil", "caf"],
  ["cod", "Republica Democratica del Congo", "caf"],
  ["col", "Colombia", "conmebol"],
  ["cpv", "Cabo Verde", "caf"],
  ["cro", "Croacia", "uefa"],
  ["cur", "Curazao", "concacaf"],
  ["cze", "Republica Checa", "uefa"],
  ["ecu", "Ecuador", "conmebol"],
  ["egy", "Egipto", "caf"],
  ["eng", "Inglaterra", "uefa"],
  ["esp", "Espana", "uefa"],
  ["fra", "Francia", "uefa"],
  ["ger", "Alemania", "uefa"],
  ["gha", "Ghana", "caf"],
  ["hai", "Haiti", "concacaf"],
  ["irn", "Iran", "afc"],
  ["irq", "Irak", "afc"],
  ["jor", "Jordania", "afc"],
  ["jpn", "Japon", "afc"],
  ["kor", "Corea del Sur", "afc"],
  ["ksa", "Arabia Saudita", "afc"],
  ["mar", "Marruecos", "caf"],
  ["mex", "Mexico", "concacaf"],
  ["ned", "Paises Bajos", "uefa"],
  ["nor", "Noruega", "uefa"],
  ["nzl", "Nueva Zelanda", "afc"],
  ["pan", "Panama", "concacaf"],
  ["par", "Paraguay", "conmebol"],
  ["por", "Portugal", "uefa"],
  ["qat", "Qatar", "afc"],
  ["rsa", "Sudafrica", "caf"],
  ["sco", "Escocia", "uefa"],
  ["sen", "Senegal", "caf"],
  ["sui", "Suiza", "uefa"],
  ["swe", "Suecia", "uefa"],
  ["tun", "Tunez", "caf"],
  ["tur", "Turquia", "uefa"],
  ["ury", "Uruguay", "conmebol"],
  ["usa", "Estados Unidos", "concacaf"],
  ["uzb", "Uzbekistan", "afc"],
] as const satisfies readonly (readonly [string, string, ConfederationSlug])[];

const teamAssetsList: TeamAsset[] = teamAssetEntries.map(([slug, nombre, confederacion]) => ({
  slug,
  nombre,
  escudo: `/mascotas/confederaciones/escudos/${slug}.png`,
  confederacion,
  confederacionAsset: `/mascotas/confederaciones/${confederacion}.png`,
  glow:
    slug === "mex"
      ? "rgba(34,197,94,0.52)"
      : slug === "rsa"
        ? "rgba(250,204,21,0.28)"
        : slug === "arg"
          ? "rgba(125,211,252,0.34)"
          : slug === "bra"
            ? "rgba(250,204,21,0.3)"
            : slug === "usa"
              ? "rgba(96,165,250,0.3)"
              : slug === "esp"
                ? "rgba(248,113,113,0.28)"
                : slug === "fra"
                  ? "rgba(96,165,250,0.28)"
                  : slug === "eng"
                    ? "rgba(239,68,68,0.22)"
                    : slug === "por"
                      ? "rgba(239,68,68,0.24)"
                      : slug === "mar"
                        ? "rgba(239,68,68,0.22)"
                        : slug === "jpn"
                          ? "rgba(248,113,113,0.22)"
                          : slug === "kor"
                            ? "rgba(248,113,113,0.24)"
                            : slug === "gha"
                              ? "rgba(250,204,21,0.24)"
                              : slug === "sen"
                                ? "rgba(34,197,94,0.26)"
                                : slug === "col"
                                  ? "rgba(250,204,21,0.24)"
                                  : slug === "ecu"
                                    ? "rgba(250,204,21,0.22)"
                                    : slug === "ury"
                                      ? "rgba(125,211,252,0.26)"
                                      : slug === "par"
                                        ? "rgba(239,68,68,0.2)"
                                        : slug === "cro"
                                          ? "rgba(239,68,68,0.22)"
                                          : "rgba(174,235,255,0.22)",
}));

export const TEAM_ASSETS: Record<string, TeamAsset> = Object.fromEntries(
  teamAssetsList.map((team) => [team.slug, team]),
);

export function resolveTeamAsset(slug?: string | null) {
  if (!slug) {
    return null;
  }

  return TEAM_ASSETS[slug.trim().toLowerCase()] ?? null;
}
