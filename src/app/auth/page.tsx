"use client";

import Link from "next/link";
import HeartCat from "@/components/HeartCat";
import { OrDivider, SocialRow } from "@/components/auth";
import { Screen } from "@/components/ui";

/** s1 — Welcome. */
export default function WelcomePage() {
  return (
    <Screen padded={false} className="px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+52px)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{ background: "radial-gradient(125% 100% at 50% 0%, #FADFD2 0%, rgba(251,245,239,0) 100%)" }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <HeartCat size={108} />
        <div>
          <div className="font-display text-[44px] font-bold leading-none text-brand-dark">
            ატეხილი
          </div>
          <div className="mx-auto mt-3.5 max-w-[252px] text-[17px] font-medium leading-relaxed text-ink-label">
            იპოვე შენი ცხოველის იდეალური წყვილი — ერთი swipe-ის მოშორებით.
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-3">
        <Link
          href="/auth/register"
          className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-primary text-[17px] font-bold text-white shadow-glow transition-all duration-[160ms] hover:-translate-y-px hover:bg-primary-hover hover:shadow-glow-hover"
        >
          რეგისტრაცია
        </Link>
        <Link
          href="/auth/login"
          className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-terracotta-100 text-[17px] font-bold text-primary-hover transition-colors duration-[160ms] hover:bg-[#F6CDB9]"
        >
          შესვლა
        </Link>
        <div className="my-2">
          <OrDivider />
        </div>
        <SocialRow />
        <p className="mt-2.5 text-center text-xs leading-relaxed text-ink-faint">
          18+ · გაგრძელებით ეთანხმები <b className="text-ink-muted">პირობებსა</b> და{" "}
          <b className="text-ink-muted">კონფიდენციალურობას</b>.
        </p>
      </div>
    </Screen>
  );
}
