"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import HeartCat from "@/components/HeartCat";

/** Launch router: 18+ age gate → intro → auth → app. */
export default function Home() {
  const router = useRouter();
  const { hasHydrated, agePassed, introSeen, authed } = useApp();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!agePassed) router.replace("/age-gate");
    else if (!introSeen) router.replace("/intro");
    else if (!authed) router.replace("/auth");
    else router.replace("/discover");
  }, [hasHydrated, agePassed, introSeen, authed, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <HeartCat size={108} />
    </div>
  );
}
