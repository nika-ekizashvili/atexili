"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import HeartCat from "@/components/HeartCat";
import { Button, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";

/** s8 — Account ready (HeartCat mood=calm + success badge). */
function SuccessScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const register = useApp((s) => s.register);
  const name = params.get("name") || "ნიკა";

  const finish = (to: string) => {
    register(name);
    router.replace(to);
  };

  return (
    <Screen padded={false} className="px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+52px)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{ background: "radial-gradient(125% 100% at 50% 0%, #E7F6EC 0%, rgba(251,245,239,0) 100%)" }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <HeartCat size={112} mood="calm" />
          <div className="absolute -bottom-1.5 -right-1.5 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#EFF7F1] bg-success text-white">
            <Check size={20} strokeWidth={4} />
          </div>
        </div>
        <div>
          <h2 className="text-[32px] font-extrabold text-ink">ანგარიში მზადაა!</h2>
          <p className="mx-auto mt-3 max-w-[250px] text-base font-medium leading-relaxed text-ink-label">
            ახლა კი მთავარი ნაწილი — დაამატე შენი პირველი ცხოველი და დაიწყე დაწყვილება.
          </p>
        </div>
      </div>
      <div className="relative flex flex-col gap-3">
        <Button onClick={() => finish("/onboarding/profile")}>ცხოველის დამატება</Button>
        <Button variant="ghost" onClick={() => finish("/pets")}>
          მოგვიანებით
        </Button>
      </div>
    </Screen>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessScreen />
    </Suspense>
  );
}
