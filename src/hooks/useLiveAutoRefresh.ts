"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseLiveAutoRefreshOptions = {
  enabled: boolean;
  intervalSeconds?: number;
  onRefresh: () => Promise<void> | void;
};

export function useLiveAutoRefresh({
  enabled,
  intervalSeconds = 60,
  onRefresh,
}: UseLiveAutoRefreshOptions) {
  const [nextRefreshIn, setNextRefreshIn] = useState(intervalSeconds);
  const [lastRefreshAt, setLastRefreshAt] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefreshRef = useRef(onRefresh);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    try {
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      await onRefreshRef.current();
      setLastRefreshAt(new Date());
      setNextRefreshIn(intervalSeconds);
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [intervalSeconds]);

  useEffect(() => {
    if (!enabled) {
      setNextRefreshIn(intervalSeconds);
      return;
    }

    setNextRefreshIn(intervalSeconds);

    const intervalId = window.setInterval(() => {
      setNextRefreshIn((prev) => {
        if (prev <= 1) {
          void triggerRefresh();
          return intervalSeconds;
        }

        return prev - 1;
      });
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [enabled, intervalSeconds, triggerRefresh]);

  return {
    nextRefreshIn,
    lastRefreshAt,
    isRefreshing,
    triggerRefresh,
  };
}
