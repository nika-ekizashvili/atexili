import type { PhotoPlaceholder } from "@/lib/types";
import type { CSSProperties, ReactNode } from "react";

/**
 * Pet photo. Renders the uploaded S3 image when `photo.url` is set; otherwise
 * falls back to the mock's emoji-on-gradient placeholder.
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
      {photo.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: emojiSize }} aria-hidden>
          {photo.emoji}
        </span>
      )}
      {children}
    </div>
  );
}
