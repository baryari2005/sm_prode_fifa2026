"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdownNow(
  initialNowMs?: number | null,
  intervalMs = 30000,
) {
  const [now, setNow] = useState(() => initialNowMs ?? Date.now());
  const baseNowRef = useRef(initialNowMs ?? Date.now());
  const monotonicStartRef = useRef(0);

  useEffect(() => {
    const nextBaseNow = initialNowMs ?? Date.now();
    baseNowRef.current = nextBaseNow;
    monotonicStartRef.current = window.performance.now();
    setNow(nextBaseNow);
  }, [initialNowMs]);

  useEffect(() => {
    monotonicStartRef.current = window.performance.now();

    const timer = window.setInterval(() => {
      const elapsedMs = window.performance.now() - monotonicStartRef.current;
      setNow(baseNowRef.current + elapsedMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}
