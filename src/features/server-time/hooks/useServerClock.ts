"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { getServerTime } from "@/features/server-time/services/server-time.service";

const RESYNC_INTERVAL_MS = 60_000;

export function useServerClock() {
  const [serverNowIso, setServerNowIso] = useState<string | null>(null);
  const [serverNowBaseMs, setServerNowBaseMs] = useState<number | null>(null);
  const [serverOffsetMinutes, setServerOffsetMinutes] = useState(-180);
  const [loading, setLoading] = useState(true);

  const syncClock = useCallback(async () => {
    const data = await getServerTime();
    setServerNowIso(data.serverNow);
    setServerNowBaseMs(data.serverNowMs);
    setServerOffsetMinutes(data.serverOffsetMinutes);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getServerTime();
        if (!active) return;
        setServerNowIso(data.serverNow);
        setServerNowBaseMs(data.serverNowMs);
        setServerOffsetMinutes(data.serverOffsetMinutes);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void syncClock();
    }, RESYNC_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [syncClock]);

  const referenceNow =
    typeof serverNowBaseMs === "number"
      ? serverNowBaseMs
      : serverNowIso
        ? new Date(serverNowIso).getTime()
        : null;
  const serverNowMs = useCountdownNow(referenceNow, 1000);

  const timeLabel = useMemo(() => {
    if (!referenceNow) return "--:--:--";

    const normalizedDate = new Date(
      serverNowMs + serverOffsetMinutes * 60 * 1000,
    );
    const hours = String(normalizedDate.getUTCHours()).padStart(2, "0");
    const minutes = String(normalizedDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(normalizedDate.getUTCSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [referenceNow, serverNowMs, serverOffsetMinutes]);

  return {
    loading,
    serverNowIso,
    serverNowMs: referenceNow ? serverNowMs : null,
    timeLabel,
  };
}
