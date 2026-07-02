"use client";

import Link from "next/link";
import PetPhoto from "@/components/PetPhoto";
import { VerifiedBadge } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function ConversationList() {
  const { matches } = useApp();
  return (
    <div className="flex flex-col">
      {matches.map((conv, i) => {
        const c = conv.candidate;
        const last = conv.messages[conv.messages.length - 1];
        const preview =
          last?.kind === "image"
            ? "📷 ფოტო"
            : last?.kind === "location"
              ? "📍 მდებარეობა"
              : (last?.text ?? "თქვენ დაემთხვიეთ — მიესალმე 👋");
        const unread = conv.unread > 0;
        return (
          <Link
            key={conv.id}
            href={`/chats/${conv.id}`}
            className={`flex items-center gap-3.5 py-3.5 ${i < matches.length - 1 ? "border-b border-fill" : ""}`}
          >
            <PetPhoto photo={c.photos[0]} emojiSize={26} className="h-14 w-14 flex-none rounded-full" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-[5px]">
                <span className="text-base font-extrabold text-ink">{c.name}</span>
                {c.verified && <VerifiedBadge size={16} />}
              </span>
              <span
                className={`mt-0.5 block truncate text-sm ${
                  unread ? "font-semibold text-ink" : "font-medium text-ink-muted"
                }`}
              >
                {preview}
              </span>
            </span>
            <span className="flex flex-none flex-col items-end gap-1.5">
              <span className="text-xs font-semibold text-ink-faint">{conv.lastTime}</span>
              {unread && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-extrabold text-white">
                  {conv.unread}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
