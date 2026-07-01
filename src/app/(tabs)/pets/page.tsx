"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import { Button, Chip, VerifiedBadge } from "@/components/ui";
import { useApp } from "@/lib/store";

/** pr2 — My Pets hub (the ჩემი tab). Empty → nt5. */
export default function MyPetsPage() {
  const router = useRouter();
  const { owner, pets, activePetId, setActivePet } = useApp();
  const active = pets.find((p) => p.id === activePetId) ?? pets[0];

  if (pets.length === 0) {
    return (
      <div className="flex flex-1 flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
        <div className="px-[22px] pb-1.5 pt-2">
          <h2 className="text-[30px] font-extrabold text-ink">ჩემი ცხოველები</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-[34px] text-center">
          <div
            className="flex h-[104px] w-[104px] items-center justify-center rounded-[30px] text-[50px]"
            style={{ background: "linear-gradient(135deg,#F5BFA6,#E8A93C)" }}
          >
            🐈
          </div>
          <div>
            <h3 className="text-[22px] font-extrabold text-ink">ჯერ ცხოველი არ დაგიმატებია</h3>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-muted">
              დაამატე შენი პირველი ცხოველი, რომ დაიწყო დათვალიერება და დაწყვილება.
            </p>
          </div>
          <Button className="h-[50px] w-auto px-[26px] text-base" onClick={() => router.push("/pets/new")}>
            ＋ ცხოველის დამატება
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[22px] pt-[calc(env(safe-area-inset-top)+24px)]">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[30px] font-extrabold text-ink">ჩემი ცხოველები</h2>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {pets.length} პროფილი აქტიურია
          </p>
        </div>
        <Link
          href="/profile/edit"
          aria-label="ჩემი პროფილი"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-[19px] font-bold text-white"
        >
          {owner.name.charAt(0) || "ნ"}
        </Link>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3.5">
        {pets.map((pet) => (
          <Link
            key={pet.id}
            href={`/pets/${pet.id}/edit`}
            className="rounded-[20px] border border-line bg-surface p-3.5 shadow-[0_8px_20px_-14px_rgba(82,31,18,0.25)] transition-transform duration-[160ms] hover:-translate-y-px"
          >
            <div className="flex items-center gap-3.5">
              <PetPhoto photo={pet.photos[0]} emojiSize={38} className="h-[76px] w-[76px] flex-none rounded-2xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[19px] font-extrabold text-ink">{pet.name}</span>
                  <span className="text-base font-semibold text-ink-muted">{pet.ageYears}</span>
                  {pet.verified && <VerifiedBadge size={19} />}
                </div>
                <div className="mt-[3px] text-[13px] font-medium text-ink-muted">
                  {speciesLabel(pet.species)} · {pet.breed} ·{" "}
                  {pet.gender === "female" ? "მდედრი" : "მამრი"}
                </div>
                <div className="mt-2 flex gap-1.5">
                  <Chip tone="terracotta" className="font-bold">
                    {pet.intent === "mate" ? "💕 ეძებს დაწყვილებას" : "✅ ხელმისაწვდომია"}
                  </Chip>
                </div>
              </div>
              <ChevronRight size={20} className="flex-none text-neutral-300" />
            </div>
            <div className="mt-3.5 flex gap-2.5 border-t border-fill pt-3.5">
              <Stat n={24} label="მოწონება" />
              <span className="w-px bg-fill" />
              <Stat n={5} label="დამთხვევა" />
              <span className="w-px bg-fill" />
              <Stat n={3} label="ახალი ჩატი" />
            </div>
          </Link>
        ))}

        <Link
          href="/pets/new"
          className="flex h-[60px] items-center justify-center gap-2.5 rounded-[20px] border-2 border-dashed border-line-strong text-base font-bold text-ink-muted transition-colors duration-[160ms] hover:border-terracotta-200 hover:text-primary-hover"
        >
          <Plus size={22} className="text-primary" strokeWidth={2} />
          კიდევ ცხოველის დამატება
        </Link>
      </div>

      {active && (
        <Button
          className="mb-4 mt-4"
          onClick={() => {
            setActivePet(active.id);
            router.push("/discover");
          }}
        >
          🔥 დაიწყე swipe {active.name}ს სახელით
        </Button>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-lg font-extrabold text-ink">{n}</div>
      <div className="text-[11px] font-semibold text-ink-faint">{label}</div>
    </div>
  );
}

function speciesLabel(species: string) {
  return { cat: "კატა", dog: "ძაღლი", bird: "ფრინველი", other: "სხვა" }[species] ?? species;
}
