"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import { BackButton, FieldLabel, Segmented, TextInput } from "@/components/ui";
import { GRADIENTS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { useBootstrapped } from "@/lib/useBootstrapped";
import type { Intent, PhotoPlaceholder } from "@/lib/types";

/** ed2 — edit pet (photo grid, name, bio, intent, delete). */
export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const ready = useBootstrapped();
  const { pets, updatePet, deletePet } = useApp();
  const pet = pets.find((p) => p.id === id);

  const [name, setName] = useState(pet?.name ?? "");
  const [bio, setBio] = useState(pet?.bio ?? "");
  const [intent, setIntent] = useState<Intent>(pet?.intent ?? "mate");
  const [photos, setPhotos] = useState<PhotoPlaceholder[]>(pet?.photos ?? []);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!ready || !pet) return null;

  return (
    <div className="flex min-h-dvh flex-col pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="flex items-center justify-between px-[22px] pb-4 pt-2">
        <BackButton />
        <span className="text-[17px] font-extrabold text-ink">{pet.name}ს რედაქტირება</span>
        <button
          onClick={() => {
            void updatePet(id, { name: name.trim() || pet.name, bio, intent, photos }).then(() =>
              router.back(),
            );
          }}
          className="cursor-pointer text-[15px] font-extrabold text-primary-hover"
        >
          შენახვა
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[18px] px-[22px] pb-10">
        {/* photos */}
        <div>
          <FieldLabel>ფოტოები</FieldLabel>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((photo, i) => (
              <button
                key={i}
                title="წაშლა"
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                className="relative cursor-pointer overflow-hidden rounded-xl"
                style={{ aspectRatio: "3/4" }}
              >
                <PetPhoto photo={photo} emojiSize={28} className="h-full w-full" />
                {i === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-[rgba(82,31,18,0.5)] py-0.5 text-center text-[9px] font-bold text-white">
                    მთავარი
                  </span>
                )}
              </button>
            ))}
            {photos.length < 7 && (
              <button
                onClick={() =>
                  setPhotos([
                    ...photos,
                    {
                      gradient: Object.values(GRADIENTS)[photos.length % 6],
                      emoji: pet.species === "dog" ? "🐕" : pet.species === "cat" ? "🐈" : "🐾",
                    },
                  ])
                }
                className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line-strong bg-surface text-ink-faint transition-colors duration-[160ms] hover:border-terracotta-200"
                style={{ aspectRatio: "3/4" }}
              >
                <Plus size={24} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        <div>
          <FieldLabel>სახელი</FieldLabel>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[50px] font-semibold"
          />
        </div>

        <div>
          <FieldLabel>ბიო</FieldLabel>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="min-h-[70px] w-full rounded-[14px] border-[1.5px] border-line-strong bg-surface px-4 py-3 text-[15px] font-medium leading-normal text-ink outline-none transition-colors duration-[160ms] focus:border-primary"
          />
        </div>

        <div>
          <FieldLabel>განზრახვა</FieldLabel>
          <Segmented
            height={48}
            options={[
              { value: "mate", label: "💕 დაწყვილება" },
              { value: "available", label: "✅ ხელმისაწვდომი" },
            ]}
            value={intent}
            onChange={setIntent}
          />
        </div>

        <button
          onClick={() => setConfirmDelete(true)}
          className="flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-[14px] text-[15px] font-bold text-danger transition-colors duration-[160ms] hover:bg-danger-soft"
        >
          <Trash2 size={17} />
          ცხოველის წაშლა
        </button>
      </div>

      {/* delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] items-center justify-center p-[22px]">
            <motion.div
              className="absolute inset-0 bg-[rgba(28,23,18,0.55)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(false)}
            />
            <motion.div
              className="relative w-[300px] rounded-3xl bg-cream px-[22px] py-[26px] text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-[30px]">
                🗑
              </div>
              <h3 className="text-[21px] font-extrabold text-ink">წაშალო {pet.name}?</h3>
              <p className="mb-[22px] mt-2.5 text-sm font-medium leading-normal text-ink-label">
                პროფილი, მოწონებები და სტატისტიკა სამუდამოდ წაიშლება.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    void deletePet(id).then(() => router.replace("/pets"));
                  }}
                  className="h-[50px] cursor-pointer rounded-[14px] bg-danger text-base font-extrabold text-white hover:brightness-95"
                >
                  დიახ, წაშლა
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-[50px] cursor-pointer rounded-[14px] text-base font-bold text-ink-muted hover:bg-fill"
                >
                  გაუქმება
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
