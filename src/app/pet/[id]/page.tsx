"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Flag, Heart, RotateCcw, X } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import MatchOverlay from "@/components/swipe/MatchOverlay";
import { PhotoPill, SectionLabel, VerifiedBadge } from "@/components/ui";
import { getCandidate, useApp } from "@/lib/store";

/** F — full pet profile (tap-to-expand from the deck). */
export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const s = useApp();
  const candidate = getCandidate(id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const pet = s.pets.find((p) => p.id === s.activePetId) ?? s.pets[0];

  if (!candidate) return null;

  const like = () => {
    const isMatch = s.likeCurrent(candidate);
    if (isMatch) setMatched(true);
    else router.back();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* photo header */}
      <div className="relative flex-none">
        <button
          className="block w-full cursor-pointer"
          onClick={() => setPhotoIndex((photoIndex + 1) % candidate.photos.length)}
        >
          <PetPhoto photo={candidate.photos[photoIndex]} emojiSize={150} className="h-[468px]" />
        </button>
        {/* story segments */}
        <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+12px)] flex gap-1.5">
          {candidate.photos.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i === photoIndex ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
        {/* top controls */}
        <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+26px)] flex items-center justify-between">
          <button
            aria-label="უკან"
            onClick={() => router.back()}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[rgba(46,38,32,0.35)] text-white backdrop-blur-md"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="საჩივარი"
            onClick={() => router.push(`/report/${candidate.id}`)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[rgba(46,38,32,0.35)] text-white backdrop-blur-md"
          >
            <Flag size={17} />
          </button>
        </div>
        {/* scrim + name */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px]"
          style={{ background: "linear-gradient(0deg, rgba(120,48,27,0.6), transparent)" }}
        />
        <div className="absolute inset-x-5 bottom-[26px]">
          <div className="flex items-center gap-2">
            <span className="text-[32px] font-extrabold text-white">{candidate.name}</span>
            <span className="text-[26px] font-semibold text-white/90">{candidate.ageYears}</span>
            {candidate.verified && <VerifiedBadge size={24} />}
          </div>
          <div className="mt-2.5 flex gap-2">
            <PhotoPill>📍 {candidate.distanceKm} კმ</PhotoPill>
            <span className="inline-flex items-center gap-[5px] rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-primary-hover">
              {candidate.intent === "mate" ? "💕 ეძებს დაწყვილებას" : "✅ ხელმისაწვდომია"}
            </span>
          </div>
        </div>
      </div>

      {/* details sheet */}
      <div className="relative -mt-6 flex flex-1 flex-col gap-[22px] rounded-t-[26px] bg-cream px-[22px] pt-6">
        <section>
          <SectionLabel tone="terracotta">ბიო</SectionLabel>
          <p className="text-[15px] font-medium leading-relaxed text-ink-body">{candidate.bio}</p>
        </section>

        <section>
          <SectionLabel tone="terracotta">ჯანმრთელობა</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {candidate.health.vaccinated && (
              <HealthLine icon="💉" iconBg="bg-chip-green" label="ვაქცინაცია — სრული კურსი" />
            )}
            {candidate.health.tested && (
              <HealthLine icon="🧬" iconBg="bg-chip-green" label="გენეტიკური ტესტები" />
            )}
            {candidate.health.docs && (
              <HealthLine icon="📄" iconBg="bg-chip-gold" label="წარმომავლობის დოკუმენტი" />
            )}
          </div>
        </section>

        <section>
          <SectionLabel tone="terracotta">დეტალები</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5">
            <DetailCell label="სახეობა" value="🐈 კატა" />
            <DetailCell label="ჯიში" value={candidate.breed.split(" ")[0]} />
            <DetailCell label="სქესი" value={candidate.gender === "male" ? "♂ მამრი" : "♀ მდედრი"} />
            <DetailCell label="ასაკი" value={`${candidate.ageYears} წლის`} />
          </div>
        </section>

        {/* owner */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink-muted font-display text-lg font-bold text-white">
            {candidate.ownerName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-[5px]">
              <span className="text-[15px] font-bold text-ink">{candidate.ownerName}</span>
              {candidate.ownerVerified && <VerifiedBadge size={16} />}
            </div>
            <div className="text-xs font-medium text-ink-faint">
              მფლობელი{candidate.ownerVerified ? " · ვერიფიცირებული" : ""}
            </div>
          </div>
          <ChevronRight size={20} className="text-neutral-300" />
        </div>

        {/* sticky action bar */}
        <div
          className="sticky bottom-0 -mx-[22px] mt-auto flex items-center justify-center gap-[18px] px-[22px] pb-[calc(env(safe-area-inset-bottom)+22px)] pt-3.5"
          style={{ background: "linear-gradient(0deg, #FBF5EF 72%, rgba(251,245,239,0))" }}
        >
          <button
            aria-label="გამოტოვება"
            onClick={() => {
              s.advanceDeck();
              router.back();
            }}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-nope shadow-[0_8px_18px_-8px_rgba(82,31,18,0.32)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <X size={26} strokeWidth={2.6} />
          </button>
          <button
            aria-label="დაბრუნება"
            onClick={() => router.back()}
            className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-rewind shadow-[0_6px_14px_-8px_rgba(82,31,18,0.3)] transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw size={20} strokeWidth={2.4} />
          </button>
          <button
            aria-label="მოწონება"
            onClick={like}
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-like text-white shadow-glow-like transition-transform duration-[160ms] hover:-translate-y-0.5 active:scale-95"
          >
            <Heart size={30} fill="currentColor" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {matched && pet && (
          <MatchOverlay pet={pet} candidate={candidate} onClose={() => router.back()} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HealthLine({ icon, iconBg, label }: { icon: string; iconBg: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-line bg-surface px-[15px] py-[13px]">
      <span className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] text-[17px] ${iconBg}`}>
        {icon}
      </span>
      <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
      <Check size={17} strokeWidth={4} className="text-success" />
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface px-[15px] py-[13px]">
      <div className="text-xs font-semibold text-ink-faint">{label}</div>
      <div className="mt-0.5 text-[15px] font-bold text-ink">{value}</div>
    </div>
  );
}
