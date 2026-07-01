import type { PhotoPlaceholder } from "@/lib/types";
import type { CSSProperties, ReactNode } from "react";

/**
 * Placeholder pet photo — the mocks use an emoji on a warm gradient wherever a
 * real user-uploaded photo will live. Swap internals for next/image later.
 */
export default function PetPhoto({
  photo,
  emojiSize = 40,
  className = "",
  style,
  children,
}: {
  photo: PhotoPlaceholder;
  emojiSize?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: photo.gradient, ...style }}
    >
      <span style={{ fontSize: emojiSize }} aria-hidden>
        {photo.emoji}
      </span>
      {children}
    </div>
  );
}
