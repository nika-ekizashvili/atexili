"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton, Banner, Button, FieldLabel, Screen, TextInput } from "@/components/ui";

/** s4 — Phone verification. */
function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-[26px]">
        <h2 className="text-[30px] font-extrabold text-ink">დაადასტურე ნომერი</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
          გამოგიგზავნით 6-ნიშნა კოდს SMS-ით. ეს გვეხმარება ბოტების გაფილტვრაში.
        </p>
      </div>
      <div className="flex-1">
        <FieldLabel>ტელეფონის ნომერი</FieldLabel>
        <div className="flex gap-2.5">
          <div className="flex h-[52px] flex-none items-center gap-2 rounded-[14px] border-[1.5px] border-line-strong bg-surface px-3.5 text-base font-bold text-ink">
            🇬🇪 +995
          </div>
          <TextInput
            type="tel"
            inputMode="numeric"
            className="flex-1 font-semibold"
            placeholder="599 12 34 56"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mt-3.5">
          <Banner icon="🔒">ნომერს არავის ვუზიარებთ და პროფილზე არ ჩანს.</Banner>
        </div>
      </div>
      <Button
        disabled={phone.replace(/\D/g, "").length < 9}
        onClick={() => router.push(`/auth/otp?phone=${encodeURIComponent(phone)}`)}
      >
        კოდის გაგზავნა
      </Button>
    </Screen>
  );
}

export default function PhonePage() {
  return (
    <Suspense>
      <PhoneScreen />
    </Suspense>
  );
}
