"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton, Button, Screen } from "@/components/ui";
import { api } from "@/lib/api";

/** s5 — OTP entry (6 boxes, resend countdown). */
function OtpScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "599 12 34 56";
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(24);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-[30px]">
        <h2 className="text-[30px] font-extrabold text-ink">შეიყვანე კოდი</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
          კოდი გაიგზავნა ნომერზე <b className="text-ink-label">+995 {phone}</b>
        </p>
      </div>
      <div className="flex-1">
        {/* hidden real input drives the six boxes */}
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoFocus
          className="absolute h-0 w-0 opacity-0"
        />
        <div className="flex justify-between gap-[9px]" onClick={() => inputRef.current?.focus()}>
          {Array.from({ length: 6 }, (_, i) => {
            const digit = code[i];
            const active = i === code.length;
            return (
              <div
                key={i}
                className={`flex h-[60px] flex-1 items-center justify-center rounded-[14px] bg-surface text-[26px] font-extrabold ${
                  active
                    ? "border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(226,100,59,0.12)]"
                    : "border-[1.5px] border-line-strong text-ink"
                }`}
              >
                {digit ?? (active ? <span className="h-[26px] w-0.5 animate-pulse rounded-sm bg-primary" /> : null)}
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          {countdown > 0 ? (
            <>
              <span className="text-sm font-semibold text-ink-faint">ხელახლა გაგზავნა </span>
              <span className="text-sm font-bold text-ink-label">0:{String(countdown).padStart(2, "0")}</span>
            </>
          ) : (
            <button
              onClick={() => setCountdown(24)}
              className="cursor-pointer text-sm font-bold text-primary-hover"
            >
              ხელახლა გაგზავნა
            </button>
          )}
        </div>
      </div>
      <Button
        disabled={code.length !== 6}
        onClick={() => {
          void api("/api/me", { method: "PATCH", body: { phone: `+995 ${phone}` } }).catch(() => {});
          router.push("/auth/success");
        }}
      >
        დადასტურება
      </Button>
    </Screen>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpScreen />
    </Suspense>
  );
}
