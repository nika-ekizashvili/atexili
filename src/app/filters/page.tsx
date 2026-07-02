"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DualSlider, Slider } from "@/components/Slider";
import { Button, Toggle } from "@/components/ui";
import { api } from "@/lib/api";
import { defaultFiltersFor, useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";
import type { Candidate, Filters, Species } from "@/lib/types";

const SPECIES: { value: Species; emoji: string; label: string }[] = [
  { value: "cat", emoji: "🐈", label: "კატა" },
  { value: "dog", emoji: "🐕", label: "ძაღლი" },
  { value: "bird", emoji: "🐦", label: "ფრინველი" },
  { value: "other", emoji: "🐾", label: "სხვა" },
];

/** fl1 — Filters (deck is pre-filtered; count updates live). */
export default function FiltersPage() {
  const router = useRouter();
  const ready = useBootstrapped();
  const s = useApp();
  const activePet = s.pets.find((p) => p.id === s.activePetId) ?? s.pets[0];
  const [draft, setDraft] = useState<Filters>(s.filters);
  const [count, setCount] = useState<number | null>(null);

  // live candidate count for the draft filters
  useEffect(() => {
    if (!ready || !activePet) return;
    const params = new URLSearchParams({
      petId: activePet.id,
      species: draft.species,
      gender: draft.gender,
      distanceKm: String(draft.distanceKm),
      ageMin: String(draft.ageRange[0]),
      ageMax: String(draft.ageRange[1]),
      verifiedOnly: String(draft.verifiedOnly),
    });
    let cancelled = false;
    void api<{ candidates: Candidate[] }>(`/api/deck?${params}`)
      .then((d) => {
        if (!cancelled) setCount(d.candidates.length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ready, activePet, draft]);

  const set = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }));

  if (!ready) return null;

  return (
    <div className="flex min-h-dvh flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="flex items-center justify-between px-[22px] pb-4 pt-2">
        <h2 className="text-[26px] font-extrabold text-ink">ფილტრები</h2>
        <button
          onClick={() => setDraft(defaultFiltersFor(activePet))}
          className="cursor-pointer text-sm font-bold text-primary-hover"
        >
          განულება
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-[22px] pb-32">
        {/* species */}
        <section>
          <div className="mb-3 text-sm font-extrabold text-ink">სახეობა</div>
          <div className="flex gap-2.5">
            {SPECIES.map((sp) => {
              const active = draft.species === sp.value;
              return (
                <button
                  key={sp.value}
                  onClick={() => set({ species: sp.value })}
                  className={`flex h-16 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-[160ms] ${
                    active
                      ? "border-2 border-primary bg-terracotta-50"
                      : "border-[1.5px] border-line bg-surface hover:border-terracotta-200"
                  }`}
                >
                  <span className="text-[22px]">{sp.emoji}</span>
                  <span className={`text-[13px] font-bold ${active ? "text-primary-hover" : "text-ink-muted"}`}>
                    {sp.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* breed */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-extrabold text-ink">ჯიში</div>
            <span className="text-[13px] font-semibold text-ink-muted">
              {activePet?.breed ?? "ბრიტანული მოკლებეწვიანი"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[14px] border border-line bg-surface px-4 py-3.5">
            <div>
              <div className="text-[15px] font-bold text-ink">ღიაა თავსებადი ჯიშებისთვის</div>
              <div className="mt-0.5 text-xs font-medium text-ink-faint">
                {draft.openToCompatibleBreeds ? "ჩართულია — თავსებადი ჯიშებიც" : "გამორთულია — მხოლოდ იგივე ჯიში"}
              </div>
            </div>
            <Toggle on={draft.openToCompatibleBreeds} onChange={(v) => set({ openToCompatibleBreeds: v })} />
          </div>
        </section>

        {/* gender */}
        <section>
          <div className="mb-3 text-sm font-extrabold text-ink">სქესი</div>
          <div className="flex gap-2.5">
            {(
              [
                { value: "male", label: "♂ მამრი" },
                { value: "female", label: "♀ მდედრი" },
                { value: "all", label: "ყველა" },
              ] as const
            ).map((g) => {
              const active = draft.gender === g.value;
              return (
                <button
                  key={g.value}
                  onClick={() => set({ gender: g.value })}
                  className={`flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[14px] text-[15px] font-bold transition-all duration-[160ms] ${
                    active
                      ? "border-2 border-primary bg-terracotta-50 text-primary-hover"
                      : "border-[1.5px] border-line bg-surface text-ink-muted hover:border-terracotta-200"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          {activePet && (
            <div className="mt-2 text-xs font-medium text-ink-faint">
              ნაგულისხმევად — საპირისპირო სქესი ({activePet.name}{" "}
              {activePet.gender === "female" ? "მდედრია" : "მამრია"}).
            </div>
          )}
        </section>

        {/* distance */}
        <section>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-sm font-extrabold text-ink">მანძილი</div>
            <span className="text-[13px] font-extrabold text-primary-hover">{draft.distanceKm} კმ-მდე</span>
          </div>
          <Slider min={1} max={50} value={draft.distanceKm} onChange={(v) => set({ distanceKm: v })} />
          <div className="flex justify-between text-[11px] font-semibold text-ink-faint">
            <span>1 კმ</span>
            <span>50 კმ</span>
          </div>
        </section>

        {/* age */}
        <section>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-sm font-extrabold text-ink">ასაკი</div>
            <span className="text-[13px] font-extrabold text-primary-hover">
              {draft.ageRange[0]} – {draft.ageRange[1]} წელი
            </span>
          </div>
          <DualSlider min={0} max={15} value={draft.ageRange} onChange={(v) => set({ ageRange: v })} />
        </section>

        {/* verified only */}
        <section className="flex items-center justify-between rounded-[14px] border border-line bg-surface px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-chip-gold text-lg">
              ★
            </span>
            <div>
              <div className="text-[15px] font-bold text-ink">მხოლოდ ვერიფიცირებული</div>
              <div className="text-xs font-medium text-ink-faint">badge-იანი პროფილები</div>
            </div>
          </div>
          <Toggle on={draft.verifiedOnly} onChange={(v) => set({ verifiedOnly: v })} />
        </section>
      </div>

      {/* sticky apply */}
      <div
        className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 px-[22px] pb-[calc(env(safe-area-inset-bottom)+24px)] pt-4"
        style={{ background: "linear-gradient(0deg,#FBF5EF 70%, rgba(251,245,239,0))" }}
      >
        <Button
          onClick={() => {
            s.setFilters(draft);
            router.back();
          }}
        >
          {count === null ? "კანდიდატების ჩვენება" : `${count} კანდიდატის ჩვენება`}
        </Button>
      </div>
    </div>
  );
}
