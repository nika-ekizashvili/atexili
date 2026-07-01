"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/auth";
import { BackButton, Button, Screen } from "@/components/ui";

/** s7 — Reset password. */
export default function ResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const valid = password.length >= 8 && confirm === password;

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-6">
        <h2 className="text-[30px] font-extrabold text-ink">ახალი პაროლი</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
          მინიმუმ 8 სიმბოლო. აირჩიე ისეთი, რომ დაიმახსოვრო.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <PasswordField label="ახალი პაროლი" value={password} onChange={setPassword} meter />
        <PasswordField
          label="გაიმეორე პაროლი"
          value={confirm}
          onChange={setConfirm}
          confirmMatch={password}
        />
      </div>
      <Button disabled={!valid} onClick={() => router.replace("/auth/login")}>
        პაროლის შენახვა
      </Button>
    </Screen>
  );
}
