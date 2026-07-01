"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import PetPhoto from "@/components/PetPhoto";
import { Chip, PhotoPill, VerifiedBadge } from "@/components/ui";
import type { Candidate } from "@/lib/types";

/**
 * The draggable front card. Physics from the mock: rotate(dx/18), slight
 * vertical drift, ±100px commit threshold, stamp opacity = |dx|/90.
 */
export default function SwipeCard({
  candidate,
  commit, // -1 nope | 1 like, set by buttons; null while idle
  onCommitted,
}: {
  candidate: Candidate;
  commit: -1 | 1 | null;
  onCommitted: (dir: -1 | 1) => void;
}) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useTransform(x, (v) => Math.abs(v) * 0.04);
  const rotate = useTransform(x, (v) => v / 18);
  const likeOpacity = useTransform(x, [0, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-90, 0], [1, 0]);

  const flyOut = (dir: -1 | 1) => {
    animate(x, dir * 560, { duration: 0.35, ease: [0.4, 0, 0.2, 1] }).then(() =>
      onCommitted(dir),
    );
  };

  useEffect(() => {
    if (commit) flyOut(commit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commit]);

  return (
    <motion.div
      className="absolute inset-x-4 top-0 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, y, rotate }}
      drag="x"
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const dx = x.get();
        if (dx > 100 || info.velocity.x > 600) flyOut(1);
        else if (dx < -100 || info.velocity.x < -600) flyOut(-1);
        else animate(x, 0, { duration: 0.32, ease: [0.34, 1.56, 0.64, 1] });
      }}
    >
      <div className="select-none overflow-hidden rounded-[28px] bg-surface shadow-[0_26px_50px_-18px_rgba(82,31,18,0.34)]">
        <PetPhoto
          photo={candidate.photos[0]}
          emojiSize={120}
          className="h-[340px]"
        >
          {/* stamps */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute left-[22px] top-[26px] -rotate-[16deg] rounded-xl border-4 border-like bg-white/16 px-4 py-1 text-3xl font-black tracking-wider text-like"
          >
            მოწონება
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute right-[22px] top-[26px] rotate-[16deg] rounded-xl border-4 border-nope bg-[rgba(82,31,18,0.18)] px-4 py-1 text-3xl font-black tracking-wider text-[#EFE7DE]"
          >
            გამოტოვება
          </motion.div>
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            <PhotoPill>
              🐈 კატა · {candidate.breed.split(" ")[0]}
            </PhotoPill>
            <PhotoPill>
              <MapPin size={12} className="text-primary" /> {candidate.distanceKm} კმ
            </PhotoPill>
          </div>
        </PetPhoto>
        <button
          className="w-full cursor-pointer px-[18px] pb-5 pt-4 text-left"
          onClick={() => router.push(`/pet/${candidate.id}`)}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold text-ink">{candidate.name}</span>
            <span className="text-xl font-semibold text-ink-muted">{candidate.ageYears}</span>
            {candidate.verified && <VerifiedBadge size={22} />}
            <span className="ml-auto text-[13px] font-bold text-primary-hover">
              {candidate.gender === "male" ? "♂ მამრი" : "♀ მდედრი"}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-normal text-ink-label">
            {candidate.bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {candidate.healthTags.map((t) => (
              <Chip key={t} tone="green">
                ✓ {t}
              </Chip>
            ))}
          </div>
        </button>
      </div>
    </motion.div>
  );
}
