"use client";

import { create } from "zustand";

import type { GoalCelebrationEvent } from "@/features/partidos/lib/goal-events";

type GoalCelebrationState = {
  currentEvent: GoalCelebrationEvent | null;
  queue: GoalCelebrationEvent[];
  seenIds: string[];
  enqueueEvents: (events: GoalCelebrationEvent[]) => void;
  shiftQueue: () => void;
};

const MAX_SEEN_IDS = 50;

export const useGoalCelebrationStore = create<GoalCelebrationState>((set) => ({
  currentEvent: null,
  queue: [],
  seenIds: [],

  enqueueEvents: (events) =>
    set((state) => {
      if (events.length === 0) {
        return state;
      }

      const filtered = events.filter(
        (event) =>
          !state.seenIds.includes(event.id) &&
          state.currentEvent?.id !== event.id &&
          !state.queue.some((queued) => queued.id === event.id),
      );

      if (filtered.length === 0) {
        return state;
      }

      const nextSeenIds = [...state.seenIds, ...filtered.map((event) => event.id)]
        .slice(-MAX_SEEN_IDS);

      if (!state.currentEvent) {
        const [currentEvent, ...restQueue] = filtered;

        return {
          currentEvent,
          queue: [...state.queue, ...restQueue],
          seenIds: nextSeenIds,
        };
      }

      return {
        currentEvent: state.currentEvent,
        queue: [...state.queue, ...filtered],
        seenIds: nextSeenIds,
      };
    }),

  shiftQueue: () =>
    set((state) => {
      const [nextEvent, ...restQueue] = state.queue;

      return {
        currentEvent: nextEvent ?? null,
        queue: restQueue,
        seenIds: state.seenIds,
      };
    }),
}));
