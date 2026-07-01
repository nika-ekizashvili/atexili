"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { BackButton, Button, Screen } from "@/components/ui";
import { getCandidate, useApp } from "@/lib/store";
import type { ReportReason } from "@/lib/types";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "fake", label: "ყალბი ან შეცდომაში შემყვანი პროფილი" },
  { value: "abusive", label: "შეურაცხმყოფელი ან აგრესიული ქცევა" },
  { value: "spam", label: "სპამი ან თაღლითობა" },
  { value: "inappropriate", label: "არასათანადო შინაარსი" },
  { value: "not_real_animal", label: "არ არის რეალური ცხოველი" },
  { value: "other", label: "სხვა მიზეზი" },
];

/** sf1 — anonymous single-select report. */
export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { report } = useApp();
  const candidate = getCandidate(id);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Screen>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-chip-green text-[44px]">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-ink">საჩივარი გაგზავნილია</h2>
            <p className="mx-auto mt-2 max-w-[260px] text-[15px] font-medium leading-relaxed text-ink-muted">
              მადლობა. გუნდი მალე განიხილავს — შენი ვინაობა ანონიმური რჩება.
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-[52px]" onClick={() => router.back()}>
          დახურვა
        </Button>
      </Screen>
    );
  }

  return (
    <Screen padded={false} className="px-[22px] pb-11 pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="mb-3.5 flex h-11 items-center justify-between">
        <BackButton />
        <span className="text-base font-extrabold text-ink">საჩივარი</span>
        <span className="w-10" />
      </div>
      <div className="mb-[18px]">
        <h2 className="text-2xl font-extrabold text-ink">
          რა მოხდა {candidate ? `${candidate.name}ს` : "ამ"} პროფილზე?
        </h2>
        <p className="mt-2 text-sm font-medium leading-normal text-ink-muted">
          შენი საჩივარი ანონიმურია. მძიმე შემთხვევებს გუნდი განიხილავს.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {REASONS.map((r) => {
          const active = reason === r.value;
          return (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={`flex cursor-pointer items-center gap-3 rounded-[14px] p-[15px] text-left transition-all duration-[160ms] ${
                active
                  ? "border-2 border-primary bg-terracotta-50"
                  : "border-[1.5px] border-line bg-surface hover:border-terracotta-200"
              }`}
            >
              <span className={`flex-1 text-[15px] text-ink ${active ? "font-bold" : "font-semibold"}`}>
                {r.label}
              </span>
              <span
                className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                  active ? "bg-primary text-white" : "border-2 border-line-strong"
                }`}
              >
                {active && <Check size={13} strokeWidth={4} />}
              </span>
            </button>
          );
        })}
      </div>
      <Button
        variant="destructive"
        className="mt-4"
        disabled={!reason}
        onClick={() => {
          if (reason) report(id, reason);
          setSent(true);
        }}
      >
        საჩივრის გაგზავნა
      </Button>
    </Screen>
  );
}
