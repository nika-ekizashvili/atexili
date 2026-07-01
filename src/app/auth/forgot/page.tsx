"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackButton, Button, FieldLabel, Screen, TextInput } from "@/components/ui";

/** s6 — Forgot password. */
export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-7 mt-1.5 flex flex-col items-center text-center">
        <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-terracotta-100 text-[34px]">
          🔑
        </div>
        <h2 className="mt-[18px] text-[28px] font-extrabold text-ink">დაგავიწყდა პაროლი?</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
          შეიყვანე ელ. ფოსტა და გამოგიგზავნით აღდგენის ბმულს.
        </p>
      </div>
      <div className="flex-1">
        <FieldLabel>ელ. ფოსტა</FieldLabel>
        <TextInput
          type="email"
          placeholder="nika@example.ge"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button disabled={!email.includes("@")} onClick={() => router.push("/auth/reset")}>
        აღდგენის ბმულის გაგზავნა
      </Button>
      <p className="mt-4 text-center text-sm font-medium text-ink-muted">
        გაგახსენდა?{" "}
        <Link href="/auth/login" className="font-bold text-primary-hover">
          შესვლა
        </Link>
      </p>
    </Screen>
  );
}
