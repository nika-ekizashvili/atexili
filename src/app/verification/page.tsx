"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { BackButton, Banner, Button, Screen } from "@/components/ui";
import { useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";

/** I — verification: v1 request → v2 pending timeline. */
export default function VerificationPage() {
  const router = useRouter();
  const ready = useBootstrapped();
  const { verification, submitVerification } = useApp();
  const [petDocUploaded, setPetDocUploaded] = useState(false);

  if (!ready) return null;

  if (verification === "pending" || verification === "verified") {
    return (
      <Screen padded={false} className="px-[26px] pb-11 pt-[calc(env(safe-area-inset-top)+28px)]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{ background: "radial-gradient(125% 100% at 50% 0%, #FBF0D6 0%, rgba(251,245,239,0) 100%)" }}
        />
        <div className="relative mb-1.5 flex h-11 items-center">
          <BackButton />
        </div>
        <div className="relative flex flex-1 flex-col items-center justify-center gap-[22px] text-center">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-accent text-5xl shadow-[0_16px_32px_-14px_rgba(232,169,60,0.7)]">
            {verification === "verified" ? "✓" : "⏳"}
          </div>
          <div>
            <h2 className="text-[28px] font-extrabold text-ink">
              {verification === "verified" ? "ვერიფიცირებულია!" : "განხილვაშია"}
            </h2>
            <p className="mx-auto mt-2.5 max-w-[260px] text-[15px] font-medium leading-relaxed text-ink-label">
              {verification === "verified"
                ? "პროფილს ახლა გოლდ badge ახლავს ყველგან."
                : "დოკუმენტები მიღებულია. შედეგს 24–48 საათში შეგატყობინებთ."}
            </p>
          </div>
          {/* status timeline */}
          <div className="mt-1.5 w-full rounded-[20px] border border-line bg-surface p-5">
            <TimelineRow
              state="done"
              title="გაგზავნილია"
              sub="დღეს, 14:20"
            />
            <TimelineRow
              state={verification === "verified" ? "done" : "active"}
              title="მიმდინარეობს განხილვა"
              sub="გუნდი ამოწმებს დოკუმენტებს"
            />
            <TimelineRow
              state={verification === "verified" ? "done" : "todo"}
              title="badge-ის მინიჭება"
              sub="დადასტურების შემდეგ"
              last
            />
          </div>
        </div>
        <Button variant="outline" className="relative h-[52px]" onClick={() => router.back()}>
          დახურვა
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="mb-1.5 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-6 mt-2.5 flex flex-col items-center text-center">
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-[26px] bg-chip-gold text-[44px] shadow-[0_12px_26px_-12px_rgba(232,169,60,0.6)]">
          🛡️
        </div>
        <h2 className="mt-[18px] text-[27px] font-extrabold text-ink">
          მიიღე ვერიფიცირებული badge
        </h2>
        <p className="mt-2 text-[15px] font-medium leading-normal text-ink-muted">
          ვერიფიცირებული პროფილები 3-ჯერ მეტ მოწონებას იღებენ და მეტ ნდობას იმსახურებენ.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="text-[13px] font-extrabold tracking-wide text-ink-label">
          საჭირო დოკუმენტები
        </div>
        {/* owner ID — uploaded */}
        <div className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-success bg-surface p-4">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-chip-green text-xl">
            🪪
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-ink">მფლობელის პირადობა</div>
            <div className="text-[13px] font-semibold text-success">ატვირთულია ✓</div>
          </div>
          <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-success text-white">
            <Check size={14} strokeWidth={4} />
          </span>
        </div>
        {/* pet doc */}
        <div
          className={`flex items-center gap-3.5 rounded-2xl bg-surface p-4 ${
            petDocUploaded ? "border-[1.5px] border-success" : "border-[1.5px] border-dashed border-line-strong"
          }`}
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-fill text-xl">
            📄
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-ink">ცხოველის დოკუმენტი</div>
            <div
              className={`text-[13px] ${petDocUploaded ? "font-semibold text-success" : "font-medium text-ink-faint"}`}
            >
              {petDocUploaded ? "ატვირთულია ✓" : "წარმომავლობა ან ვეტ-პასპორტი"}
            </div>
          </div>
          {petDocUploaded ? (
            <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-success text-white">
              <Check size={14} strokeWidth={4} />
            </span>
          ) : (
            <button
              onClick={() => setPetDocUploaded(true)}
              className="flex-none cursor-pointer rounded-full bg-terracotta-100 px-3.5 py-2 text-[13px] font-bold text-primary-hover transition-colors duration-[160ms] hover:bg-[#F6CDB9]"
            >
              ატვირთვა
            </button>
          )}
        </div>
        <div className="mt-1">
          <Banner icon="🔒">დოკუმენტები მხოლოდ განხილვისთვისაა — არასდროს ქვეყნდება პროფილზე.</Banner>
        </div>
      </div>
      <Button
        className="mt-4"
        disabled={!petDocUploaded}
        onClick={() => void submitVerification()}
      >
        გაგზავნა განსახილველად
      </Button>
    </Screen>
  );
}

function TimelineRow({
  state,
  title,
  sub,
  last,
}: {
  state: "done" | "active" | "todo";
  title: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3.5 ${last ? "" : "pb-4"}`}>
      <span
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
          state === "done"
            ? "bg-success text-white"
            : state === "active"
              ? "bg-accent text-white"
              : "bg-line text-ink-faint"
        }`}
      >
        {state === "done" ? (
          <Check size={15} strokeWidth={4} />
        ) : state === "active" ? (
          "◔"
        ) : (
          <Star size={14} fill="currentColor" />
        )}
      </span>
      <div className="flex-1 text-left">
        <div className={`text-[15px] font-bold ${state === "todo" ? "text-ink-faint" : "text-ink"}`}>
          {title}
        </div>
        <div
          className={`text-xs ${
            state === "active"
              ? "font-semibold text-chip-gold-text"
              : state === "todo"
                ? "font-medium text-neutral-300"
                : "font-medium text-ink-faint"
          }`}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
