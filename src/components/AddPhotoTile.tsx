"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Loader2, Plus } from "lucide-react";
import { uploadPhoto } from "@/lib/upload";
import type { PhotoPlaceholder } from "@/lib/types";

/**
 * A dashed "add photo" slot with a hidden file input. Uploads to S3 (or falls
 * back to the given placeholder when storage is off) and hands back the photo.
 */
export default function AddPhotoTile({
  onAdd,
  fallback,
  folder = "pets",
  className = "",
  style,
  children,
}: {
  onAdd: (photo: PhotoPlaceholder) => void;
  fallback: PhotoPlaceholder;
  folder?: "pets" | "docs";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onAdd(await uploadPhoto(file, fallback, folder));
    } catch {
      onAdd(fallback); // network hiccup → keep the flow moving with placeholder
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => inputRef.current?.click()}
      style={style}
      className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-line-strong bg-surface text-ink-faint transition-colors duration-[160ms] hover:border-terracotta-200 disabled:opacity-60 ${className}`}
    >
      {busy ? <Loader2 className="animate-spin" size={24} /> : (children ?? <Plus size={26} strokeWidth={1.5} />)}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void pick(e.target.files?.[0])}
      />
    </button>
  );
}
