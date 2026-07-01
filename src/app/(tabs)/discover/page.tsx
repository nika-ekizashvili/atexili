"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Plus, RotateCcw, Settings, SlidersHorizontal, Star, X } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import Sheet from "@/components/Sheet";
import MatchOverlay from "@/components/swipe/MatchOverlay";
import SwipeCard from "@/components/swipe/SwipeCard";
import { Button } from "@/components/ui";
import { selectDeck, useApp } from "@/lib/store";
import type { Candidate } from "@/lib/types";

/** sw1 — the swipe deck, plus sw2 — the pet switcher sheet. */
export default function DiscoverPage() {
  const router = useRouter();
  const s = useApp();
  const pet = s.pets.find((p) => p.id === s.activePetId) ?? s.pets[0];
  const deck = useMemo(
    () => selectDeck({ filters: s.filters, blocked: s.blocked }),
    [s.filters, s.blocked],
  );
  const current: Candidate | undefined = deck[s.deckIndex];
  const next: Candidate | undefined = deck[s.deckIndex + 1];

  const [commit, setCommit] = useState<-1 | 1 | null>(null);
  const [matched, setMatched] = useState<Candidate | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    if (s.hasHydrated && s.authed && s.pets.length === 0) router.replace("/pets");
  }, [s.hasHydrated, s.authed, s.pets.length, router]);

  if (!pet) return null;

  const activeFilterCount =
    (s.filters.gender !== "all" ? 1 : 0) +
    (s.filters.distanceKm < 50 ? 1 : 0) +
    (s.filters.verifiedOnly ? 1 : 0) +
    (s.filters.openToCompatibleBreeds ? 1 : 0);

  const onCommitted = (dir: -1 | 1) => {
    setCommit(null);
    if (!current) return;
    if (dir === 1) {
      const isMatch = s.likeCurrent(current);
      if (isMatch) setMatched(current);
    } else {
      s.advanceDeck();
    }
  };

  return (
    <div className="flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      {/* top bar: pet switcher + settings/filters */}
      <div className="flex items-center justify-between px-5 pb-3 pt-2">
        <button
          className="flex cursor-pointer items-center gap-2.5 text-left"
          onClick={() => setSwitcherOpen(true)}
        >
          <PetPhoto
            photo={pet.photos[0]}
            emojiSize={20}
            className="h-10 w-10 rounded-full border-2 border-white shadow-[0_2px_8px_-2px_rgba(82,31,18,0.25)]"
          />
          <span>
            <span className="block text-[11px] font-semibold leading-none text-ink-faint">
              ათვალიერებ როგორც
            </span>
            <span className="mt-1 flex items-center gap-1 text-base font-extrabold leading-tight text-ink">
              {pet.name} <ChevronDown size={13} className="text-ink-faint" />
            </span>
          </span>
        </button>
        <div className="flex gap-2.5">
          <Link
            href="/settings"
            aria-label="პარამეტრები"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-label shadow-[0_2px_8px_-4px_rgba(82,31,18,0.2)] transition-colors duration-[160ms] hover:bg-terracotta-100"
          >
            <Settings size={19} />
          </Link>
          <Link
            href="/filters"
            aria-label="ფილტრები"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-label shadow-[0_2px_8px_-4px_rgba(82,31,18,0.2)] transition-colors duration-[160ms] hover:bg-terracotta-100"
          >
            <SlidersHorizontal size={19} />
            {activeFilterCount > 0 && (
              <span className="absolute -right-[3px] -top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-cream bg-primary text-[10px] font-extrabold text-white">
                {activeFilterCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* deck stage */}
      <div className="relative flex-1 px-5 pt-2">
        {current ? (
          <div className="relative h-[496px]">
            {next && (
              <div className="absolute inset-x-7 top-4 scale-[0.94] overflow-hidden rounded-[26px] bg-surface opacity-90 shadow-[0_12px_28px_-16px_rgba(82,31,18,0.28)]">
                <PetPhoto photo={next.photos[0]} emojiSize={96} className="h-[300px]" />
                <div className="h-[120px]" />
              </div>
            )}
            <SwipeCard
              key={current.id}
              candidate={current}
              commit={commit}
              onCommitted={onCommitted}
            />
          </div>
        ) : (
          <div className="flex h-[496px] flex-col items-center justify-center gap-[18px] px-2.5 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-terracotta-100 text-[44px]">
              🐾
            </div>
            <div>
              <h3 className="text-[22px] font-extrabold text-ink">ამ წრეში ესაა ყველა</h3>
              <p className="mx-auto mt-2 max-w-[260px] text-[15px] font-medium leading-normal text-ink-muted">
                გაზარდე მანძილი ან შეცვალე ფილტრები, რომ მეტი კანდიდატი ნახო.
              </p>
            </div>
            <Button className="w-auto px-6" onClick={() => router.push("/filters")}>
              ფილტრების შეცვლა
            </Button>
          </div>
        )}
      </div>

      {/* action buttons */}
      {current && (
        <div className="flex items-center justify-center gap-4 px-5 pb-2.5 pt-3.5">
          <button
            aria-label="დაბრუნება"
            onClick={() => s.rewindDeck()}
            className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-rewind shadow-[0_6px_14px_-8px_rgba(82,31,18,0.3)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw size={22} strokeWidth={2.4} />
          </button>
          <button
            aria-label="გამოტოვება"
            onClick={() => setCommit(-1)}
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-nope shadow-[0_8px_18px_-8px_rgba(82,31,18,0.32)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <X size={28} strokeWidth={2.6} />
          </button>
          <button
            aria-label="მოწონება"
            onClick={() => setCommit(1)}
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-like text-white shadow-glow-like transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <Heart size={28} fill="currentColor" />
          </button>
          <button
            aria-label="სუპერ მოწონება"
            onClick={() => setCommit(1)}
            className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-primary shadow-[0_6px_14px_-8px_rgba(82,31,18,0.3)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <Star size={20} fill="currentColor" />
          </button>
        </div>
      )}

      {/* sw2 — pet switcher sheet */}
      <Sheet open={switcherOpen} onClose={() => setSwitcherOpen(false)}>
        <h3 className="mb-1 text-[22px] font-extrabold text-ink">ვისი სახელით ათვალიერებ?</h3>
        <p className="mb-[18px] text-sm font-medium text-ink-muted">
          დასტა შერჩეული ცხოველის ფილტრებით განახლდება.
        </p>
        <div className="flex flex-col gap-3">
          {s.pets.map((p) => {
            const active = p.id === pet.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  s.setActivePet(p.id);
                  s.setFilters({ species: p.species, gender: p.gender === "female" ? "male" : "female" });
                  setSwitcherOpen(false);
                }}
                className={`flex cursor-pointer items-center gap-3.5 rounded-[18px] p-3.5 text-left transition-colors duration-[160ms] ${
                  active
                    ? "border-2 border-primary bg-terracotta-50"
                    : "border-[1.5px] border-line bg-surface hover:border-terracotta-200"
                }`}
              >
                <PetPhoto photo={p.photos[0]} emojiSize={28} className="h-14 w-14 flex-none rounded-[14px]" />
                <span className="flex-1">
                  <span className="block text-[17px] font-extrabold text-ink">{p.name}</span>
                  <span className="block text-[13px] font-medium text-ink-muted">
                    {speciesLabel(p.species)} · {p.breed.split(" ")[0]} ·{" "}
                    {p.gender === "female" ? "მდედრი" : "მამრი"}
                  </span>
                </span>
                <span
                  className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full ${
                    active ? "bg-primary text-white" : "border-2 border-line-strong bg-surface"
                  }`}
                >
                  {active && "✓"}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => router.push("/pets/new")}
            className="flex h-[58px] cursor-pointer items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed border-line-strong text-[15px] font-bold text-ink-muted transition-colors duration-[160ms] hover:border-terracotta-200"
          >
            <Plus size={20} className="text-primary" />
            ცხოველის დამატება
          </button>
        </div>
      </Sheet>

      {/* match overlay */}
      <AnimatePresence>
        {matched && (
          <MatchOverlay pet={pet} candidate={matched} onClose={() => setMatched(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function speciesLabel(species: string) {
  return { cat: "კატა", dog: "ძაღლი", bird: "ფრინველი", other: "სხვა" }[species] ?? species;
}
