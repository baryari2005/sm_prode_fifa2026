export const THIRD_PLACE_SLOT_RULES = {
  "74": ["A", "B", "C", "D", "F"],
  "77": ["C", "D", "F", "G", "H"],
  "79": ["C", "E", "F", "H", "I"],
  "80": ["E", "H", "I", "J", "K"],
  "81": ["B", "E", "F", "I", "J"],
  "82": ["A", "E", "H", "I", "J"],
  "85": ["E", "F", "G", "I", "J"],
  "87": ["D", "E", "I", "J", "L"],
} as const;

export type ThirdPlaceSlotMatch = keyof typeof THIRD_PLACE_SLOT_RULES;

export type ThirdPlaceAssignment = Record<ThirdPlaceSlotMatch, string>;

function sortAssignments(entries: [ThirdPlaceSlotMatch, readonly string[]][]) {
  return [...entries].sort((left, right) => left[1].length - right[1].length);
}

export function resolveThirdPlaceAssignments(
  qualifiedThirdGroups: string[],
): ThirdPlaceAssignment | null {
  const allowedQualifiedEntries = sortAssignments(
    (Object.entries(THIRD_PLACE_SLOT_RULES) as [ThirdPlaceSlotMatch, readonly string[]][])
      .map(([matchNumber, allowedGroups]) => [
        matchNumber,
        allowedGroups.filter((group) => qualifiedThirdGroups.includes(group)),
      ]),
  );

  const usedGroups = new Set<string>();
  const assignments: Partial<ThirdPlaceAssignment> = {};

  function backtrack(index: number): boolean {
    if (index >= allowedQualifiedEntries.length) {
      return true;
    }

    const [matchNumber, candidates] = allowedQualifiedEntries[index];

    for (const group of candidates) {
      if (usedGroups.has(group)) continue;

      usedGroups.add(group);
      assignments[matchNumber] = group;

      if (backtrack(index + 1)) {
        return true;
      }

      usedGroups.delete(group);
      delete assignments[matchNumber];
    }

    return false;
  }

  if (!backtrack(0)) {
    return null;
  }

  return assignments as ThirdPlaceAssignment;
}
