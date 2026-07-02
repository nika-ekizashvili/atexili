"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./store";

/**
 * Ensures the API bootstrap ran (for deep links outside the tab shell).
 * Redirects to the launch flow when there is no session.
 */
export function useBootstrapped(): boolean {
  const router = useRouter();
  const { hasHydrated, authed, bootstrapped, loadBootstrap } = useApp();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!authed) {
      router.replace("/");
      return;
    }
    if (!bootstrapped) void loadBootstrap();
  }, [hasHydrated, authed, bootstrapped, loadBootstrap, router]);

  return hasHydrated && authed && bootstrapped;
}
