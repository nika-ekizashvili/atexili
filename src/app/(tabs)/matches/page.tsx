"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/ConversationList";
import PetPhoto from "@/components/PetPhoto";
import { Button, SectionLabel } from "@/components/ui";
import { getCandidate, useApp } from "@/lib/store";

/** ch1 — Matches: new-matches rail + conversation list. Empty → nt3. */
export default function MatchesPage() {
  const router = useRouter();
  const { matches } = useApp();

  if (matches.length === 0) {
    return (
      <div className="flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
        <div className="px-[22px] pb-1.5 pt-2">
          <h2 className="text-[30px] font-extrabold text-ink">დამთხვევები</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-[34px] text-center">
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[30px] bg-terracotta-100 text-[50px]">
            🐾
          </div>
          <div>
            <h3 className="text-[22px] font-extrabold text-ink">ჯერ დამთხვევა არ გაქვს</h3>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
              განაგრძე swipe — იდეალური წყვილი სადღაც ახლოსაა.
            </p>
          </div>
          <Button className="h-[50px] w-auto px-[26px] text-base" onClick={() => router.push("/discover")}>
            🔥 swipe-ის დაწყება
          </Button>
        </div>
      </div>
    );
  }

  const newMatches = matches
    .map(getCandidate)
    .filter((c): c is NonNullable<ReturnType<typeof getCandidate>> => !!c);

  return (
    <div className="flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="px-[22px] pb-1.5 pt-2">
        <h2 className="text-[30px] font-extrabold text-ink">დამთხვევები</h2>
      </div>

      {/* new matches rail */}
      <div className="pb-[18px] pt-3.5">
        <div className="px-[22px] pb-3">
          <SectionLabel tone="terracotta">ახალი დამთხვევები</SectionLabel>
        </div>
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-[22px]">
          {newMatches.map((c) => (
            <Link key={c.id} href={`/chats/${c.id}`} className="flex flex-none flex-col items-center gap-1.5">
              <PetPhoto
                photo={c.photos[0]}
                emojiSize={30}
                className="h-[66px] w-[66px] rounded-full border-[3px] border-primary"
              />
              <span className="text-xs font-bold text-ink-label">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* conversations */}
      <div className="flex-1 rounded-t-[26px] bg-surface px-[22px] pt-5 shadow-[0_-6px_20px_-12px_rgba(82,31,18,0.16)]">
        <SectionLabel>მიმოწერა</SectionLabel>
        <ConversationList />
      </div>
    </div>
  );
}
