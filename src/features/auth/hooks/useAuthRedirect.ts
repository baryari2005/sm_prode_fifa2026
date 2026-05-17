"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type UseAuthRedirectParams = {
  triedMe: boolean;
  token: string | null | undefined;
  user: unknown;
  nextParam?: string;
};

export function useAuthRedirect({
  triedMe,
  token,
  user,
  nextParam,
}: UseAuthRedirectParams) {
  const router = useRouter();
  const lastReplaceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!triedMe || !token || !user) return;

    const destination = nextParam || "/";

    if (lastReplaceRef.current === destination) return;

    lastReplaceRef.current = destination;
    router.replace(destination);
  }, [triedMe, token, user, nextParam, router]);
}