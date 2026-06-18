export const PUBLIC_RANKING_ROLE = "user";

export type PublicRankingRoleCandidate = {
  rol?: {
    nombre?: string | null;
  } | null;
};

export function isPublicRankingRole(roleName?: string | null) {
  return (roleName ?? "").trim().toLowerCase() === PUBLIC_RANKING_ROLE;
}

export function isPublicRankingParticipant(
  user?: PublicRankingRoleCandidate | null,
) {
  return isPublicRankingRole(user?.rol?.nombre);
}
