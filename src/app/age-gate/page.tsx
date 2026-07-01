"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";

/** 18+ age gate — shown on launch, before onboarding/auth (ag1 + ag2). */
export default function AgeGatePage() {
  const router = useRouter();
  const passAgeGate = useApp((s) => s.passAgeGate);
  const [dob, setDob] = useState("1998-03-14");
  const [agreed, setAgreed] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / 3.15576e10) : 0;

  if (blocked) {
    return (
      <Screen className="pt-[calc(env(safe-area-inset-top)+36px)]">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[30px] bg-danger-soft text-[46px]">
            🚧
          </div>
          <div>
            <h2 className="text-[26px] font-extrabold text-ink">ჯერ ვერ შემოხვალ</h2>
            <p className="mx-auto mt-3 max-w-[280px] text-base font-medium leading-relaxed text-ink-label">
              ატეხილით სარგებლობა მხოლოდ <b>18 წლიდან</b> შეიძლება. მადლობა გაგებისთვის —
              დაგელოდებით! 🐾
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-[54px]" onClick={() => setBlocked(false)}>
          დახურვა
        </Button>
      </Screen>
    );
  }

  return (
    <Screen
      padded={false}
      className="px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+36px)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{ background: "radial-gradient(125% 100% at 50% 0%, #FADFD2 0%, rgba(251,245,239,0) 100%)" }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-[26px] text-center">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[34px] bg-primary shadow-[0_16px_32px_-12px_rgba(226,100,59,0.6)]">
          <span className="text-[44px] font-black tracking-tight text-white">18+</span>
        </div>
        <div>
          <h2 className="text-[28px] font-extrabold text-ink">ეს აპლიკაცია 18+ არის</h2>
          <p className="mx-auto mt-3 max-w-[280px] text-base font-medium leading-relaxed text-ink-label">
            ატეხილი ცხოველების პასუხისმგებლიან დაწყვილებას ეხმარება. გასაგრძელებლად დაადასტურე
            შენი ასაკი.
          </p>
        </div>
        <label className="flex w-full items-center justify-between rounded-[18px] border border-line bg-surface px-[18px] py-4">
          <span className="text-[15px] font-bold text-ink-label">დაბადების თარიღი</span>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="bg-transparent text-right text-base font-bold text-ink outline-none"
          />
        </label>
      </div>
      <div className="relative flex flex-col gap-3">
        <div className="mb-0.5 flex items-start gap-[9px]">
          <Checkbox checked={agreed} onChange={setAgreed} />
          <span className="text-left text-[13px] font-medium leading-relaxed text-ink-label">
            ვადასტურებ, რომ ვარ <b>18 წლის ან მეტის</b> და ვეთანხმები{" "}
            <b className="text-primary-hover">პირობებს</b>.
          </span>
        </div>
        <Button
          disabled={!agreed || !dob}
          onClick={() => {
            if (age < 18) setBlocked(true);
            else {
              passAgeGate();
              router.replace("/intro");
            }
          }}
        >
          დადასტურება
        </Button>
        <p className="mt-1.5 text-center text-xs font-medium leading-relaxed text-ink-faint">
          ასაკს ვამოწმებთ ბოტებისა და არასრულწლოვნების გასაფილტრად.
        </p>
      </div>
    </Screen>
  );
}
