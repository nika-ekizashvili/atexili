"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight, MapPin, Star } from "lucide-react";
import { BackButton, Chip, FieldLabel, TextInput } from "@/components/ui";
import { useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";

/** ed1 — edit owner profile (pre-filled, top-right save). */
export default function EditOwnerPage() {
  const router = useRouter();
  const ready = useBootstrapped();
  const { owner, updateOwner, verification } = useApp();
  // fields fall back to the store value until edited, so a hard refresh
  // (bootstrap landing after mount) still pre-fills them
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [aboutDraft, setAboutDraft] = useState<string | null>(null);
  const name = nameDraft ?? owner.name;
  const about = aboutDraft ?? owner.about;

  if (!ready) return null;

  return (
    <div className="flex min-h-dvh flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="flex items-center justify-between px-[22px] pb-4 pt-2">
        <BackButton />
        <span className="text-[17px] font-extrabold text-ink">პროფილის რედაქტირება</span>
        <button
          onClick={() => {
            void updateOwner({ name: name.trim() || owner.name, about }).then(() => router.back());
          }}
          className="cursor-pointer text-[15px] font-extrabold text-primary-hover"
        >
          შენახვა
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[18px] px-[22px] pb-10">
        <div className="flex justify-center py-1.5">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary font-display text-[40px] font-bold text-white shadow-[0_12px_24px_-10px_rgba(226,100,59,0.55)]">
              {(name || owner.name).charAt(0) || "ნ"}
            </div>
            <button className="absolute -bottom-0.5 -right-0.5 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-label shadow-[0_4px_10px_-4px_rgba(82,31,18,0.25)]">
              <Camera size={15} />
            </button>
          </div>
        </div>

        <div>
          <FieldLabel>სახელი</FieldLabel>
          <TextInput
            value={name}
            onChange={(e) => setNameDraft(e.target.value)}
            className="font-semibold"
          />
        </div>

        <div>
          <FieldLabel>მდებარეობა</FieldLabel>
          <div className="flex h-[52px] w-full items-center justify-between rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4">
            <span className="flex items-center gap-[9px] text-base font-semibold text-ink">
              <MapPin size={17} className="text-primary" />
              {owner.location}
            </span>
            <ChevronRight size={18} className="text-ink-faint" />
          </div>
        </div>

        <div>
          <FieldLabel>ჩემ შესახებ</FieldLabel>
          <textarea
            value={about}
            onChange={(e) => setAboutDraft(e.target.value)}
            rows={3}
            className="min-h-24 w-full rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4 py-3.5 text-[15px] font-medium leading-normal text-ink outline-none transition-colors duration-[160ms] focus:border-primary"
          />
        </div>

        <Link
          href="/verification"
          className="flex items-center justify-between rounded-[14px] border border-line bg-surface px-4 py-3.5"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-chip-gold">
              <Star size={16} className="text-accent" fill="currentColor" />
            </span>
            <span className="text-[15px] font-bold text-ink">ვერიფიკაცია</span>
          </span>
          {verification === "verified" ? (
            <Chip tone="green" className="font-bold">
              ✓ დადასტურებული
            </Chip>
          ) : verification === "pending" ? (
            <Chip tone="gold" className="font-bold">
              ⏳ განხილვაშია
            </Chip>
          ) : (
            <Chip tone="terracotta" className="font-bold">
              მოითხოვე →
            </Chip>
          )}
        </Link>
      </div>
    </div>
  );
}
