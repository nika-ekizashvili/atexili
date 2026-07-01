"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button, Screen } from "@/components/ui";
import PetPhoto from "@/components/PetPhoto";
import { GRADIENTS } from "@/lib/data";
import { useApp } from "@/lib/store";

/* Onboarding: 3 slides explaining the core idea (in1–in3). */

function SlideOne() {
  return (
    <div className="relative">
      <div className="w-[180px] -rotate-4 overflow-hidden rounded-3xl bg-surface shadow-[0_24px_48px_-18px_rgba(82,31,18,0.35)]">
        <PetPhoto photo={{ gradient: GRADIENTS.peachGold, emoji: "🐈" }} emojiSize={80} className="h-[180px]" />
        <div className="px-3.5 py-3">
          <div className="text-lg font-extrabold text-ink">ლუნა, 2</div>
          <div className="text-xs font-semibold text-ink-muted">კატა · ბრიტანული</div>
        </div>
      </div>
      <div className="absolute -right-[26px] -top-3.5 rotate-6 rounded-full bg-primary px-3.5 py-2 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(226,100,59,0.6)]">
        = ცხოველი 🐾
      </div>
    </div>
  );
}

function SlideTwo() {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line bg-surface text-nope">
          <X size={22} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-bold text-ink-disabled">გამოტოვება</span>
      </div>
      <div className="relative w-[150px] rotate-5 overflow-hidden rounded-[22px] bg-surface shadow-[0_20px_40px_-16px_rgba(82,31,18,0.32)]">
        <PetPhoto photo={{ gradient: GRADIENTS.coralWarm, emoji: "🐈" }} emojiSize={66} className="h-[150px]" />
        <div className="px-3 py-2.5">
          <div className="text-[15px] font-extrabold text-ink">თომა, 3</div>
        </div>
        <div className="absolute right-3 top-3.5 rotate-12 rounded-lg border-[3px] border-like px-2 py-0.5 text-[15px] font-black text-like">
          მოწონება
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-like text-white shadow-[0_10px_20px_-8px_rgba(52,178,123,0.7)]">
          <Heart size={26} fill="currentColor" />
        </div>
        <span className="text-[11px] font-bold text-chip-green-text">მოწონება</span>
      </div>
    </div>
  );
}

function SlideThree() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center">
        <div className="flex h-24 w-24 -rotate-6 items-center justify-center rounded-full border-4 border-white text-[44px] shadow-[0_12px_24px_-12px_rgba(82,31,18,0.35)]" style={{ background: GRADIENTS.peachGold }}>
          🐈
        </div>
        <div className="z-[2] -mx-3.5 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary text-2xl shadow-[0_8px_16px_-6px_rgba(226,100,59,0.6)]">
          💛
        </div>
        <div className="flex h-24 w-24 rotate-6 items-center justify-center rounded-full border-4 border-white text-[44px] shadow-[0_12px_24px_-12px_rgba(82,31,18,0.35)]" style={{ background: GRADIENTS.coralRust }}>
          🐈
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="rounded-[14px] rounded-bl-[4px] bg-line px-[13px] py-[9px] text-[13px] font-semibold text-ink">
          გამარჯობა! 👋
        </div>
        <div className="rounded-[14px] rounded-br-[4px] bg-primary px-[13px] py-[9px] text-[13px] font-semibold text-white">
          მოდი შევხვდეთ 🙂
        </div>
      </div>
    </div>
  );
}

const slides = [
  {
    art: <SlideOne />,
    title: "პროფილი შენი ცხოველია",
    body: (
      <>
        ატეხილზე ბარათი წარმოადგენს <b>ცხოველს</b> — არა შენ. შენ ხარ მფლობელი, რომელიც მას
        წარადგენს.
      </>
    ),
    cta: "გაგრძელება",
  },
  {
    art: <SlideTwo />,
    title: "ათვალიერებ მისი სახელით",
    body: (
      <>
        <b>მარჯვნივ</b> — მოგწონს, <b>მარცხნივ</b> — გამოტოვება. შენ ირჩევ შენი ცხოველისთვის
        შესაფერის პარტნიორს.
      </>
    ),
    cta: "გაგრძელება",
  },
  {
    art: <SlideThree />,
    title: "ორმხრივი მოწონება = დამთხვევა",
    body: (
      <>
        როცა ორივე ცხოველი ერთმანეთს მოიწონებს, იხსნება <b>ჩატი ორ მფლობელს</b> შორის —
        დანარჩენი თქვენზეა.
      </>
    ),
    cta: "დავიწყოთ 🐾",
  },
];

export default function IntroPage() {
  const router = useRouter();
  const finishIntro = useApp((s) => s.finishIntro);
  const [i, setI] = useState(0);
  const slide = slides[i];
  const last = i === slides.length - 1;

  const done = () => {
    finishIntro();
    router.replace("/auth");
  };

  return (
    <Screen padded={false} className="px-7 pb-11 pt-[calc(env(safe-area-inset-top)+28px)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: "radial-gradient(120% 100% at 50% 0%, #FADFD2 0%, rgba(251,245,239,0) 100%)" }}
      />
      <div className="relative flex h-[30px] justify-end">
        {!last && (
          <button onClick={done} className="cursor-pointer text-sm font-bold text-ink-faint">
            გამოტოვება
          </button>
        )}
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col items-center gap-10"
          >
            {slide.art}
            <div className="text-center">
              <h2 className="text-[29px] font-extrabold leading-tight text-ink">{slide.title}</h2>
              <p className="mx-auto mt-3.5 max-w-[280px] text-base font-medium leading-relaxed text-ink-label">
                {slide.body}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative mb-6 flex justify-center gap-2">
        {slides.map((_, d) => (
          <span
            key={d}
            className={`h-2 rounded-full transition-all duration-[220ms] ${d === i ? "w-[26px] bg-primary" : "w-2 bg-line-strong"}`}
          />
        ))}
      </div>
      <Button className="relative" onClick={() => (last ? done() : setI(i + 1))}>
        {slide.cta}
      </Button>
    </Screen>
  );
}
