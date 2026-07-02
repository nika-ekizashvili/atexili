"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight, MapPin } from "lucide-react";
import {
  BackButton,
  Banner,
  Button,
  FieldLabel,
  Screen,
  TextInput,
  WizardProgress,
} from "@/components/ui";
import { useApp } from "@/lib/store";

/** pr1 — Owner profile creation (step 1/2; step 2 is the add-pet wizard). */
export default function OwnerProfilePage() {
  const router = useRouter();
  const { owner, updateOwner } = useApp();
  const [name, setName] = useState(owner.name);
  const [location, setLocation] = useState(owner.location);

  return (
    <Screen>
      <div className="mb-4 flex h-11 items-center gap-3.5">
        <BackButton />
        <WizardProgress step={1} total={2} />
      </div>
      <div className="mb-[26px]">
        <h2 className="text-[30px] font-extrabold text-ink">შენი პროფილი</h2>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
          ეს მფლობელის ბარათია — ცხოველების უკან შენ დგახარ. მოკლედ შენ შესახებ.
        </p>
      </div>
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-primary font-display text-[44px] font-bold text-white shadow-[0_12px_24px_-10px_rgba(226,100,59,0.55)]">
            {name.trim().charAt(0) || "ნ"}
          </div>
          <button className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-label shadow-[0_4px_10px_-4px_rgba(82,31,18,0.25)]">
            <Camera size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <FieldLabel>სახელი</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} className="font-semibold" />
        </div>
        <div>
          <FieldLabel>მდებარეობა</FieldLabel>
          <div className="flex h-[52px] w-full items-center justify-between rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4">
            <span className="flex items-center gap-[9px] text-base font-semibold text-ink">
              <MapPin size={17} className="text-primary" />
              {location}
            </span>
            <ChevronRight size={18} className="text-ink-faint" />
          </div>
          <button
            onClick={() => setLocation("თბილისი, საქართველო")}
            className="mt-2.5 inline-flex cursor-pointer items-center gap-[7px] rounded-full bg-terracotta-100 px-[15px] py-[9px] text-[13px] font-bold text-primary-hover transition-colors duration-[160ms] hover:bg-[#F6CDB9]"
          >
            📡 მიმდინარე მდებარეობის გამოყენება
          </button>
        </div>
        <Banner icon="🔒">ზუსტ მისამართს არასდროს ვაჩვენებთ — მხოლოდ დაახლოებით მანძილს.</Banner>
      </div>
      <Button
        className="mt-[18px]"
        disabled={!name.trim()}
        onClick={() => {
          void updateOwner({ name: name.trim(), location }).then(() => router.push("/pets/new"));
        }}
      >
        გაგრძელება
      </Button>
    </Screen>
  );
}
