"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/lib/store";

/** Shell for the four top-level destinations — persistent bottom nav. */
export default function TabsLayout({ children }: { children: React.ReactNode }) {
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

  if (!hasHydrated || !authed) return null;

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(env(safe-area-inset-bottom)+74px)]">
      {children}
      <BottomNav />
    </div>
  );
}
