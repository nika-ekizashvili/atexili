"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeartCat from "@/components/HeartCat";
import { OrDivider, PasswordField, SocialRow } from "@/components/auth";
import { BackButton, Button, FieldLabel, Screen, TextInput } from "@/components/ui";
import { useApp } from "@/lib/store";

/** s3 — Login. Logging in loads the seeded demo account. */
export default function LoginPage() {
  const router = useRouter();
  const login = useApp((s) => s.login);
  const [email, setEmail] = useState("nika@example.ge");
  const [password, setPassword] = useState("123456789");

  return (
    <Screen>
      <div className="mb-2 flex h-11 items-center">
        <BackButton />
      </div>
      <div className="mb-[30px] mt-3.5 flex flex-col items-center text-center">
        <HeartCat size={72} />
        <h2 className="mt-[18px] text-[28px] font-extrabold text-ink">კეთილი იყოს დაბრუნება</h2>
        <p className="mt-1.5 text-[15px] font-medium text-ink-muted">შედი, ვინ გელოდება.</p>
      </div>
      <div className="flex flex-1 flex-col gap-3.5">
        <div>
          <FieldLabel>ელ. ფოსტა</FieldLabel>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <PasswordField
          label="პაროლი"
          value={password}
          onChange={setPassword}
          labelRight={
            <Link href="/auth/forgot" className="text-[13px] font-bold text-primary-hover">
              დაგავიწყდა?
            </Link>
          }
        />
      </div>
      <Button
        disabled={!email.includes("@") || password.length < 6}
        onClick={() => {
          login();
          router.replace("/discover");
        }}
      >
        შესვლა
      </Button>
      <div className="my-[18px]">
        <OrDivider />
      </div>
      <SocialRow />
      <p className="mt-5 text-center text-sm font-medium text-ink-muted">
        არ გაქვს ანგარიში?{" "}
        <Link href="/auth/register" className="font-bold text-primary-hover">
          რეგისტრაცია
        </Link>
      </p>
    </Screen>
  );
}
