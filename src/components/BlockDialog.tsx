"use client";

import { motion } from "framer-motion";

/** sf2 — centered destructive confirm for blocking. */
export default function BlockDialog({
  name,
  onBlock,
  onCancel,
}: {
  name: string;
  onBlock: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] items-center justify-center p-[22px]">
      <motion.div
        className="absolute inset-0 bg-[rgba(28,23,18,0.55)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      />
      <motion.div
        className="relative w-[300px] rounded-3xl bg-cream px-[22px] py-[26px] text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-[30px]">
          🚫
        </div>
        <h3 className="text-[21px] font-extrabold text-ink">დაბლოკო {name}?</h3>
        <p className="mb-[22px] mt-2.5 text-sm font-medium leading-normal text-ink-label">
          ვეღარ ნახავთ ერთმანეთს დასტაში და თქვენი მიმოწერა დაიხურება. ამის გაუქმება ნებისმიერ
          დროს შეგიძლია პარამეტრებიდან.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onBlock}
            className="h-[50px] cursor-pointer rounded-[14px] bg-danger text-base font-extrabold text-white transition-all duration-[160ms] hover:brightness-95"
          >
            დიახ, დაბლოკვა
          </button>
          <button
            onClick={onCancel}
            className="h-[50px] cursor-pointer rounded-[14px] text-base font-bold text-ink-muted hover:bg-fill"
          >
            გაუქმება
          </button>
        </div>
      </motion.div>
    </div>
  );
}
