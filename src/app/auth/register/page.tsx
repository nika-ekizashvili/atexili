"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/auth";
import { BackButton, Button, Checkbox, FieldLabel, Screen, TextInput } from "@/components/ui";

/** s2 — Register. */
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const valid = name.trim() && email.includes("@") && password.length >= 8 && agreed;

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-[22px]">
        <h2 className="text-[30px] font-extrabold text-ink">შექმენი ანგარიში</h2>
        <p className="mt-1.5 text-[15px] font-medium text-ink-muted">
          ჯერ შენ — ცხოველებს მოგვიანებით დაამატებ.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3.5">
        <div>
          <FieldLabel>სახელი</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="ნიკა" />
        </div>
        <div>
          <FieldLabel>ელ. ფოსტა</FieldLabel>
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nika@example.ge"
          />
        </div>
        <PasswordField label="პაროლი" value={password} onChange={setPassword} meter />
        <div className="mt-1 flex items-start gap-2.5">
          <Checkbox checked={agreed} onChange={setAgreed} />
          <span className="text-[13px] font-medium leading-relaxed text-ink-label">
            ვეთანხმები <b className="text-primary-hover">მოხმარების პირობებსა</b> და{" "}
            <b className="text-primary-hover">კონფიდენციალურობის პოლიტიკას</b>.
          </span>
        </div>
      </div>
      <Button
        className="mt-[18px]"
        disabled={!valid}
        onClick={() => router.push(`/auth/phone?name=${encodeURIComponent(name.trim())}`)}
      >
        გაგრძელება
      </Button>
      <p className="mt-4 text-center text-sm font-medium text-ink-muted">
        უკვე გაქვს ანგარიში?{" "}
        <Link href="/auth/login" className="font-bold text-primary-hover">
          შესვლა
        </Link>
      </p>
    </Screen>
  );
}
