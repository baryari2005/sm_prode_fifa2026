"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

export function usePendingUsers(enabled = false, pollIntervalMs = 30000) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      setLoading(false);
      return;
    }

    let alive = true;

    const loadPendingUsers = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get("/admin/pending-users");
        if (!alive) return;

        setCount(Number(response.data?.count ?? 0));
      } catch {
        if (!alive) return;
        setCount(0);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadPendingUsers();
    const intervalId = window.setInterval(loadPendingUsers, pollIntervalMs);

    return () => {
      alive = false;
      window.clearInterval(intervalId);
    };
  }, [enabled, pollIntervalMs]);

  return { count, loading };
}
