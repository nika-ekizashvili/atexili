"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import AddPhotoTile from "@/components/AddPhotoTile";
import PetPhoto from "@/components/PetPhoto";
import Sheet from "@/components/Sheet";
import {
  BackButton,
  Banner,
  Button,
  Chip,
  FieldLabel,
  PhotoPill,
  Screen,
  Segmented,
  SelectRow,
  TextInput,
  Toggle,
  VerifiedBadge,
  WizardProgress,
} from "@/components/ui";
import { BREEDS, GRADIENTS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";
import type { Gender, Intent, PhotoPlaceholder, Species } from "@/lib/types";

const SPECIES: { value: Species; emoji: string; label: string }[] = [
  { value: "cat", emoji: "🐈", label: "კატა" },
  { value: "dog", emoji: "🐕", label: "ძაღლი" },
  { value: "bird", emoji: "🐦", label: "ფრინველი" },
  { value: "other", emoji: "🐾", label: "სხვა" },
];

const PLACEHOLDER_POOL = [
  GRADIENTS.peachGold,
  GRADIENTS.coralWarm,
  GRADIENTS.sandGold,
  GRADIENTS.coralRust,
  GRADIENTS.sandCoral,
  GRADIENTS.taupe,
];

/** D — Add Pet wizard, 6 steps (p1–p6). */
export default function AddPetPage() {
  const router = useRouter();
  const ready = useBootstrapped();
  const { pets, addPet, notifPrimed } = useApp();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);

  const [species, setSpecies] = useState<Species>("cat");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [birthdate, setBirthdate] = useState("");
  const [ageYears, setAgeYears] = useState(0);
  const [photos, setPhotos] = useState<PhotoPlaceholder[]>([]);
  const [health, setHealth] = useState({ vaccinated: true, tested: true, docs: false });
  const [healthTags, setHealthTags] = useState<string[]>(["ვაქცინირებული", "დეჰელმინთიზაცია"]);
  const [intent, setIntent] = useState<Intent>("mate");
  const [breedSheet, setBreedSheet] = useState(false);

  const speciesEmoji = SPECIES.find((s) => s.value === species)!.emoji;

  const changeBirthdate = (value: string) => {
    setBirthdate(value);
    setAgeYears(
      value ? Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3.15576e10)) : 0,
    );
  };

  const canContinue =
    step === 1 ||
    (step === 2 && name.trim() && breed && birthdate) ||
    (step === 3 && photos.length >= 1) ||
    step >= 4;

  const publish = async () => {
    setBusy(true);
    const isFirst = pets.length === 0;
    try {
      await addPet({
        name: name.trim(),
        species,
        breed,
        gender,
        birthdate,
        photos,
        bio: "მეგობრული და მოსიყვარულე — უყვარს თამაში და ყურადღება 🐾",
        health,
        healthTags,
        intent,
      });
      router.replace(isFirst && !notifPrimed ? "/notifications" : "/pets");
    } catch {
      setBusy(false);
    }
  };

  if (!ready) return null;

  const headings: Record<number, [string, string]> = {
    1: ["რომელი ცხოველია?", "დასტას სახეობის მიხედვით ვფილტრავთ — კატა კატასთან, ძაღლი ძაღლთან."],
    2: ["ცხოველის დეტალები", "ეს ინფო ბარათზე გამოჩნდება."],
    3: ["დაამატე ფოტოები", "მინიმუმ 1 საჭიროა — 3+ ბევრად უკეთეს შედეგს იძლევა."],
    4: ["ჯანმრთელობა", "არასავალდებულო, მაგრამ ნდობას მკვეთრად მატებს."],
    5: ["რას ეძებ?", "ნებისმიერ დროს შეცვლი პროფილიდან."],
    6: ["ასე გამოჩნდება", "ბოლო შემოწმება — მერე დასტაში ხვდება."],
  };

  return (
    <Screen>
      <div className="mb-[22px] flex h-11 items-center gap-3.5">
        <BackButton onClick={() => (step > 1 ? setStep(step - 1) : router.back())} />
        <WizardProgress step={step} total={6} />
      </div>
      <div className="mb-[22px]">
        <h2 className="text-[30px] font-extrabold text-ink">{headings[step][0]}</h2>
        <p className="mt-2 text-[15px] font-medium leading-normal text-ink-muted">
          {headings[step][1]}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
          className="flex flex-1 flex-col"
        >
          {/* p1 — species */}
          {step === 1 && (
            <div className="grid grid-cols-2 content-start gap-3.5">
              {SPECIES.map((sp) => {
                const active = sp.value === species;
                return (
                  <button
                    key={sp.value}
                    onClick={() => {
                      setSpecies(sp.value);
                      setBreed("");
                    }}
                    className={`relative flex h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] transition-all duration-[160ms] ${
                      active
                        ? "border-2 border-primary bg-terracotta-50 shadow-[0_8px_18px_-10px_rgba(226,100,59,0.4)]"
                        : "border-[1.5px] border-line bg-surface hover:border-terracotta-200"
                    }`}
                  >
                    <span className="text-[44px]">{sp.emoji}</span>
                    <span className="text-[17px] font-bold text-ink">{sp.label}</span>
                    {active && (
                      <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                        <Check size={14} strokeWidth={4} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* p2 — basics */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>სახელი</FieldLabel>
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ლუნა"
                  className="font-semibold"
                />
              </div>
              <div>
                <FieldLabel>ჯიში</FieldLabel>
                <SelectRow
                  value={breed || <span className="text-ink-faint">აირჩიე ჯიში</span>}
                  onClick={() => setBreedSheet(true)}
                />
              </div>
              <div>
                <FieldLabel>სქესი</FieldLabel>
                <Segmented
                  options={[
                    { value: "female", label: "♀ მდედრი" },
                    { value: "male", label: "♂ მამრი" },
                  ]}
                  value={gender}
                  onChange={setGender}
                />
              </div>
              <div>
                <FieldLabel>დაბადების თარიღი</FieldLabel>
                <div className="flex h-[52px] w-full items-center justify-between rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4">
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => changeBirthdate(e.target.value)}
                    className="flex-1 bg-transparent text-base font-semibold text-ink outline-none"
                  />
                  {birthdate && (
                    <span className="text-sm font-semibold text-ink-muted">{ageYears} წლის</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* p3 — photos */}
          {step === 3 && (
            <>
              <div className="grid flex-1 grid-cols-3 content-start gap-3">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    title="წაშლა"
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <PetPhoto photo={photo} emojiSize={40} className="h-full w-full" />
                    {i === 0 && (
                      <span className="absolute inset-x-0 bottom-0 bg-[rgba(82,31,18,0.5)] py-1 text-center text-[11px] font-bold text-white">
                        მთავარი
                      </span>
                    )}
                  </button>
                ))}
                {Array.from({ length: Math.max(0, 6 - photos.length) }, (_, i) => (
                  <AddPhotoTile
                    key={`empty-${i}`}
                    style={{ aspectRatio: "3/4" }}
                    fallback={{
                      gradient: PLACEHOLDER_POOL[(photos.length + i) % PLACEHOLDER_POOL.length],
                      emoji: (photos.length + i) % 3 === 2 ? "🐾" : speciesEmoji,
                    }}
                    onAdd={(photo) => setPhotos((prev) => [...prev, photo])}
                  />
                ))}
              </div>
              <div className="my-4">
                <Banner icon="💡">ბუნებრივი შუქი და მკვეთრი ფოტო — მეტი მარჯვენა swipe.</Banner>
              </div>
            </>
          )}

          {/* p4 — health */}
          {step === 4 && (
            <div className="flex flex-col gap-3">
              <HealthRow
                icon="💉"
                iconBg="bg-chip-green"
                title="ვაქცინაცია"
                sub="სრული კურსი გავლილი"
                on={health.vaccinated}
                onChange={(v) => setHealth({ ...health, vaccinated: v })}
              />
              <HealthRow
                icon="🧬"
                iconBg="bg-chip-green"
                title="ჯანმრთელობის ტესტები"
                sub="გენეტიკა, სკრინინგი"
                on={health.tested}
                onChange={(v) => setHealth({ ...health, tested: v })}
              />
              <HealthRow
                icon="📄"
                iconBg="bg-fill"
                title="დოკუმენტი / რეგისტრაცია"
                sub="წარმომავლობა, პასპორტი"
                on={health.docs}
                onChange={(v) => setHealth({ ...health, docs: v })}
              />
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-3 text-sm font-bold text-ink-label">ჯანმრთელობის ტეგები</div>
                <div className="flex flex-wrap gap-2">
                  {healthTags.map((t) => (
                    <button key={t} onClick={() => setHealthTags(healthTags.filter((x) => x !== t))} className="cursor-pointer">
                      <Chip tone="green" className="px-3.5 py-2 text-[13px]">
                        ✓ {t}
                      </Chip>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const extras = ["ჩიპი", "სტერილიზაცია", "ალერგიების გარეშე"];
                      const nextTag = extras.find((e) => !healthTags.includes(e));
                      if (nextTag) setHealthTags([...healthTags, nextTag]);
                    }}
                    className="cursor-pointer"
                  >
                    <Chip tone="muted" className="px-3.5 py-2 text-[13px]">
                      ＋ დამატება
                    </Chip>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* p5 — intent */}
          {step === 5 && (
            <div className="flex flex-col gap-3.5">
              <IntentCard
                emoji="💕"
                emojiBg="bg-primary"
                title="ეძებს დაწყვილებას"
                sub={`აქტიურად ეძებ პარტნიორს ${name.trim() || "მისთვის"}${name.trim() ? "სთვის" : ""}.`}
                active={intent === "mate"}
                onClick={() => setIntent("mate")}
              />
              <IntentCard
                emoji="✅"
                emojiBg="bg-chip-green"
                title="ხელმისაწვდომია"
                sub="ღიაა შეთავაზებებისთვის, თუმცა არ ჩქარობს."
                active={intent === "available"}
                onClick={() => setIntent("available")}
              />
            </div>
          )}

          {/* p6 — publish preview */}
          {step === 6 && (
            <div className="flex flex-1 items-start justify-center">
              <div className="w-full overflow-hidden rounded-3xl bg-surface shadow-[0_20px_40px_-16px_rgba(82,31,18,0.28)]">
                <PetPhoto
                  photo={photos[0] ?? { gradient: GRADIENTS.peachGold, emoji: speciesEmoji }}
                  emojiSize={96}
                  className="h-[290px]"
                >
                  <div className="absolute inset-x-3.5 bottom-3.5 flex flex-wrap gap-2">
                    <PhotoPill>
                      {speciesEmoji} {SPECIES.find((sp) => sp.value === species)!.label} ·{" "}
                      {breed.split(" ")[0] || "—"}
                    </PhotoPill>
                    <PhotoPill>
                      <MapPin size={12} className="text-primary" /> 3.2 კმ
                    </PhotoPill>
                  </div>
                </PetPhoto>
                <div className="px-[18px] py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[22px] font-extrabold text-ink">{name || "—"}</span>
                    <span className="text-lg font-semibold text-ink-muted">{ageYears}</span>
                    <VerifiedBadge size={20} />
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium leading-normal text-ink-label">
                    მეგობრული და მოსიყვარულე — უყვარს თამაში და ყურადღება 🐾
                  </p>
                  <div className="mt-3 flex gap-2">
                    {health.vaccinated && <Chip tone="green">✓ ვაქცინა</Chip>}
                    <Chip tone="terracotta">
                      {intent === "mate" ? "💕 ეძებს დაწყვილებას" : "✅ ხელმისაწვდომია"}
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex flex-col gap-1">
        <Button
          disabled={!canContinue || busy}
          onClick={() => (step < 6 ? setStep(step + 1) : void publish())}
        >
          {step < 6 ? "გაგრძელება" : busy ? "..." : "გამოქვეყნება"}
        </Button>
        {step === 6 && (
          <Button variant="ghost" className="h-12" onClick={() => setStep(2)}>
            რედაქტირება
          </Button>
        )}
      </div>

      {/* breed picker */}
      <Sheet open={breedSheet} onClose={() => setBreedSheet(false)}>
        <h3 className="mb-4 text-[22px] font-extrabold text-ink">აირჩიე ჯიში</h3>
        <div className="flex max-h-[50dvh] flex-col gap-2.5 overflow-y-auto pb-2">
          {BREEDS[species].map((b) => (
            <button
              key={b}
              onClick={() => {
                setBreed(b);
                setBreedSheet(false);
              }}
              className={`flex h-[52px] cursor-pointer items-center justify-between rounded-[14px] px-4 text-base font-semibold transition-colors duration-[160ms] ${
                breed === b
                  ? "border-2 border-primary bg-terracotta-50 text-primary-hover"
                  : "border-[1.5px] border-line bg-surface text-ink hover:border-terracotta-200"
              }`}
            >
              {b}
              {breed === b && <Check size={18} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </Sheet>
    </Screen>
  );
}

function HealthRow({
  icon,
  iconBg,
  title,
  sub,
  on,
  onChange,
}: {
  icon: string;
  iconBg: string;
  title: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-[11px] text-xl ${iconBg}`}>
          {icon}
        </span>
        <div>
          <div className="text-base font-bold text-ink">{title}</div>
          <div className="text-[13px] font-medium text-ink-muted">{sub}</div>
        </div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function IntentCard({
  emoji,
  emojiBg,
  title,
  sub,
  active,
  onClick,
}: {
  emoji: string;
  emojiBg: string;
  title: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-[20px] p-5 text-left transition-all duration-[160ms] ${
        active
          ? "border-2 border-primary bg-terracotta-50 shadow-[0_8px_18px_-10px_rgba(226,100,59,0.4)]"
          : "border-[1.5px] border-line bg-surface hover:border-terracotta-200"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span className={`flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[15px] text-[26px] ${emojiBg}`}>
          {emoji}
        </span>
        <span className="flex-1">
          <span className="block text-lg font-extrabold text-ink">{title}</span>
          <span className="mt-0.5 block text-sm font-medium text-ink-muted">{sub}</span>
        </span>
        <span
          className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full ${
            active ? "bg-primary text-white" : "border-2 border-line-strong bg-surface"
          }`}
        >
          {active && <Check size={15} strokeWidth={4} />}
        </span>
      </div>
    </button>
  );
}
