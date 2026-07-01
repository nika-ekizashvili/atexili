"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/lib/store";

/** Shell for the four top-level destinations — persistent bottom nav. */
export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { hasHydrated, authed } = useApp();

  useEffect(() => {
    if (hasHydrated && !authed) router.replace("/");
  }, [hasHydrated, authed, router]);

  if (!hasHydrated) return null;

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(env(safe-area-inset-bottom)+74px)]">
      {children}
      <BottomNav />
    </div>
  );
}
