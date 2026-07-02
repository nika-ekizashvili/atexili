"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PetPhoto from "@/components/PetPhoto";
import type { Candidate, Pet } from "@/lib/types";

/** Full-bleed match celebration — spring pop (600ms). */
export default function MatchOverlay({
  pet,
  candidate,
  chatId,
  onClose,
}: {
  pet: Pet;
  candidate: Candidate;
  chatId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <motion.div
      className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col items-center justify-center px-[30px] py-10 text-center"
      style={{ background: "radial-gradient(120% 60% at 50% 30%, rgba(226,100,59,0.97), rgba(120,48,27,0.98))" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex w-full flex-col items-center"
      >
        <div className="font-display text-[52px] font-bold leading-none text-white">დამთხვევა!</div>
        <p className="mb-[34px] mt-3.5 max-w-[250px] text-base font-semibold leading-relaxed text-terracotta-100">
          {pet.name} და {candidate.name} ერთმანეთს მოეწონენ 💛
        </p>
        <div className="mb-[38px] flex items-center justify-center">
          <PetPhoto
            photo={pet.photos[0]}
            emojiSize={52}
            className="h-28 w-28 -rotate-6 rounded-full border-4 border-white"
          />
          <div className="z-[2] -mx-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[28px] shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
            💛
          </div>
          <PetPhoto
            photo={candidate.photos[0]}
            emojiSize={52}
            className="h-28 w-28 rotate-6 rounded-full border-4 border-white"
          />
        </div>
        <button
          onClick={() => router.push(`/chats/${chatId}`)}
          className="mb-3 h-[54px] w-full max-w-[300px] cursor-pointer rounded-2xl bg-white text-[17px] font-extrabold text-primary-hover transition-transform duration-[160ms] hover:-translate-y-px"
        >
          გაუგზავნე შეტყობინება
        </button>
        <button
          onClick={onClose}
          className="h-[50px] w-full max-w-[300px] cursor-pointer rounded-2xl border-[1.5px] border-white/60 text-[15px] font-bold text-white transition-colors duration-[160ms] hover:bg-white/10"
        >
          განაგრძე ათვალიერება
        </button>
      </motion.div>
    </motion.div>
  );
}
