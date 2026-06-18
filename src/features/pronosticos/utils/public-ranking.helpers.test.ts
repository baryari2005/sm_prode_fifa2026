import assert from "node:assert/strict";

import {
  isPublicRankingParticipant,
  isPublicRankingRole,
} from "@/features/pronosticos/utils/public-ranking.helpers";

assert.equal(isPublicRankingRole("user"), true);
assert.equal(isPublicRankingRole("USER"), true);
assert.equal(isPublicRankingRole("admin"), false);
assert.equal(isPublicRankingRole("dev-sup"), false);

assert.equal(
  isPublicRankingParticipant({
    rol: { nombre: "user" },
  }),
  true,
);

assert.equal(
  isPublicRankingParticipant({
    rol: { nombre: "admin" },
  }),
  false,
);

console.log("Public ranking helpers tests passed");
