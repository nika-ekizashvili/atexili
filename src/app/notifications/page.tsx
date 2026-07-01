"use client";

import { useRouter } from "next/navigation";
import { Button, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";

/** nt1 — Notification permission priming (shown before the OS prompt). */
export default function NotificationPrimingPage() {
  const router = useRouter();
  const primeNotifications = useApp((s) => s.primeNotifications);

  const done = () => {
    primeNotifications();
    router.replace("/discover");
  };

  return (
    <Screen padded={false} className="px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+52px)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{ background: "radial-gradient(125% 100% at 50% 0%, #FADFD2 0%, rgba(251,245,239,0) 100%)" }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-[26px] text-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-primary text-[52px] shadow-[0_16px_32px_-12px_rgba(226,100,59,0.6)]">
          🔔
          <span className="absolute -right-1.5 -top-1.5 flex h-[30px] min-w-[30px] items-center justify-center rounded-full border-[3px] border-[#FBEAE0] bg-danger px-2 text-sm font-extrabold text-white">
            3
          </span>
        </div>
        <div>
          <h2 className="text-[28px] font-extrabold text-ink">არ გამოტოვო დამთხვევა</h2>
          <p className="mx-auto mt-3 max-w-[270px] text-base font-medium leading-relaxed text-ink-label">
            ჩართე შეტყობინებები და მაშინვე შეიტყობ ახალ დამთხვევასა და მესიჯზე.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-terracotta-100 text-xl">
              💛
            </span>
            <span className="text-[15px] font-semibold text-ink">ახალი დამთხვევა მყისვე</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-chip-green text-xl">
              💬
            </span>
            <span className="text-[15px] font-semibold text-ink">მესიჯები მფლობელებისგან</span>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-3">
        <Button onClick={done}>შეტყობინებების ჩართვა</Button>
        <Button variant="ghost" onClick={done}>
          მოგვიანებით
        </Button>
      </div>
    </Screen>
  );
}
